$KEYCLOAK_IP = "192.168.11.30"
$LOGIN_PAGE_URL = "http://192.168.11.30:8080/realms/master/protocol/saml/clients/aws"
$USERNAME = "keycloak-admin"
$PASSWORD = "password"
$AWS_ROLE_ARN = "arn:aws:iam::111597699083:role/keycloak-admin"
$AWS_IDP_ARN = "arn:aws:iam::111597699083:saml-provider/keycloak"
$AWS_REGION = "us-east-2"
$S3_FILE_PATH = "upload-sample.txt"
$S3_BUCKET_NAME = "kzyk-sato.com"
$LOCAL_FILE_PATH = "C:\sample\download-sample.txt"

[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12 -bor [System.Net.SecurityProtocolType]::Tls13

function Get-SAMLAssertion {
    param (
        [string]$sso_url,
        [string]$idp_user,
        [string]$idp_pass
    )

    Write-Output "*** Get SAML Assertion ***"

    # セッション管理
    $session = New-Object Microsoft.PowerShell.Commands.WebRequestSession

    # Keycloak ログインページ取得
    $response = Invoke-WebRequest -Uri $sso_url -WebSession $session
    $html = $response.Content

    # クッキー情報
    $cookieHeader = ($session.Cookies.GetCookies($sso_url) | ForEach-Object { "$($_.Name)=$($_.Value)" }) -join "; "

    # Keycloak ログインフォームの `action` URL を取得
    if ($html -match 'action="([^"]+)"') {
        $postUrl = $matches[1]
        if (-not ($postUrl -match '^http')) {
            $postUrl = $sso_url -replace "/realms/.*", $postUrl
        }
    } else {
        throw "Login form action URL not found"
    }

    # フォームデータを構築
    $form_data = @{
        username = $idp_user
        password = $idp_pass
    }

    # `input` 要素の `name` と `value` を取得
    $matches = Select-String -Pattern '<input[^>]+name="([^"]+)"[^>]+value="([^"]*)"' -InputObject $html -AllMatches
    foreach ($match in $matches.Matches) {
        $name = $match.Groups[1].Value
        $value = $match.Groups[2].Value
        if ($name -ne "username" -and $name -ne "password") {
            $form_data[$name] = $value
        }
    }

    # Keycloak にログイン
    $postResponse = Invoke-WebRequest -Uri $postUrl -Method Post -Body $form_data -Headers @{
        "Content-Type" = "application/x-www-form-urlencoded"
        "Cookie" = $cookieHeader
    } -WebSession $session

    # SAMLResponse を取得
    if ($postResponse.Content -match 'name="SAMLResponse" value="([^"]+)"') {
        return $matches[1]
    } else {
        throw "SAML Assertion not found"
    }
}

function Assume-Role-With-SAML {
    param (
        [string]$samlAssertion
    )

    Write-Host "*** Assuming AWS Role with SAML via AWS STS API ***"

    $STS_URL = "https://sts.amazonaws.com/"
    $params = @{
        Action         = "AssumeRoleWithSAML"
        RoleArn        = $AWS_ROLE_ARN
        PrincipalArn   = $AWS_IDP_ARN
        SAMLAssertion  = $samlAssertion
        Version        = "2011-06-15"
    }

    # STS API を直接呼び出す (AWS Tools for PowerShell を使用しない)
    $response = Invoke-RestMethod -Uri $STS_URL -Method Post -Body $params -ContentType "application/x-www-form-urlencoded"

    if ($response.AssumeRoleWithSAMLResponse -and $response.AssumeRoleWithSAMLResponse.AssumeRoleWithSAMLResult) {
        $credentials = $response.AssumeRoleWithSAMLResponse.AssumeRoleWithSAMLResult.Credentials
        Write-Host "AWS Credentials Retrieved Successfully"
        return @{
            aws_access_key_id    = $credentials.AccessKeyId
            aws_secret_access_key    = $credentials.SecretAccessKey
            aws_session_token = $credentials.SessionToken
        }
    } else {
        Write-Host "Error: Failed to assume AWS Role with SAML. Exiting."
        exit 1
    }
}

function Get-S3AuthHeaders {
    param (
        [string]$method,
        [string]$bucket,
        [string]$key,
        [hashtable]$credentials
    )

    $s3host = "$bucket.s3.amazonaws.com"
    $date = [DateTime]::UtcNow.ToString("r")
    $canonicalResource = "/$bucket/$key"
    $stringToSign = "$method`n`n`n$date`n$canonicalResource"

    $hmac = New-Object System.Security.Cryptography.HMACSHA1
    $hmac.Key = [Text.Encoding]::UTF8.GetBytes($credentials.aws_secret_access_key)
    $signature = [Convert]::ToBase64String($hmac.ComputeHash([Text.Encoding]::UTF8.GetBytes($stringToSign)))

    return @{
        "Authorization" = "AWS $($credentials.aws_access_key_id):$signature"
        "Date" = $date
        "Host" = $s3host
    }
}

function Upload-To-S3 {
    param (
        [hashtable]$credentials
    )
    Write-Output "AWS Credentials:"
    Write-Output "Access Key: $($credentials.aws_access_key_id)"
    Write-Output "Secret Key: $($credentials.aws_secret_access_key)"
    Write-Output "Session Token: $($credentials.aws_session_token)"

    $fileBytes = [System.IO.File]::ReadAllBytes("C:\sample\$S3_FILE_PATH")
    $headers = Get-S3AuthHeaders -method "PUT" -bucket $S3_BUCKET_NAME -key $S3_FILE_PATH -credentials $credentials

    Invoke-RestMethod -Uri "https://$S3_BUCKET_NAME.s3.amazonaws.com/$S3_FILE_PATH" -Method Put -Headers $headers -Body $fileBytes -ContentType "application/octet-stream"

    Write-Output "Uploaded $S3_FILE_PATH to S3 bucket $S3_BUCKET_NAME"
}

function Download-From-S3 {
    param (
        [hashtable]$credentials
    )
    Write-Output "AWS Credentials:"
    Write-Output "Access Key: $($credentials.aws_access_key_id)"
    Write-Output "Secret Key: $($credentials.aws_secret_access_key)"
    Write-Output "Session Token: $($credentials.aws_session_token)"

    $headers = Get-S3AuthHeaders -method "GET" -bucket $S3_BUCKET_NAME -key $S3_FILE_PATH -credentials $credentials
    $response = Invoke-RestMethod -Uri "https://$S3_BUCKET_NAME.s3.amazonaws.com/$S3_FILE_PATH" -Method Get -Headers $headers -OutFile $LOCAL_FILE_PATH

    Write-Output "Downloaded $S3_FILE_PATH from S3 bucket $S3_BUCKET_NAME to $LOCAL_FILE_PATH"
}

# 実行
$samlAssertion = Get-SAMLAssertion -sso_url $LOGIN_PAGE_URL -idp_user $USERNAME -idp_pass $PASSWORD
Write-Output "SAML Assertion:"
Write-Output $samlAssertion
$awsCredentials = Assume-Role-With-SAML -samlAssertion $samlAssertion
Upload-To-S3 -credentials $awsCredentials
Download-From-S3 -credentials $awsCredentials
