# PowerShellスクリプト: S3へのアップロード・ダウンロード (Keycloak SAML認証)

# 最新の TLS プロトコル (1.2 または 1.3) を使用する
# [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12, [Net.SecurityProtocolType]::Tls13


# 設定
# $KeycloakIP = "localhost"
$LoginPageUrl = "http://192.168.11.30:8080/realms/master/protocol/saml/clients/aws"
# $LoginPageUrl = "http://localhost:8080/realms/master/protocol/saml/clients/aws?kc_action=RESTART"
$Username = "keycloak-admin"
$Password = "password"

$AWSRoleArn = "arn:aws:iam::111597699083:role/keycloak-admin"   # 変更
$AWSIdPArn = "arn:aws:iam::111597699083:saml-provider/keycloak"  # 変更
$AWSRegion = "us-east-2"  # 東京リージョン
$S3BucketName = "kzyk-sato.com"  # S3バケット名 (変更)
$LocalFilePath = "C:\sample\upload-sample.txt"  # アップロードするファイルのパス
$S3ObjectName = "download-sample.txt"  # S3上のファイル名
$DownloadedFilePath = "C:\sample\download-sample.txt"  # ダウンロード先のファイルパス

# Install-Module -Name AWS.Tools.SecurityToken -Force -Scope CurrentUser

# Keycloak への SAML 認証
function Get-SAMLAssertion {
    Write-Host "*** Restarting Keycloak Login and Getting SAML Assertion ***"

    # セッションを作成
    $session = New-Object Microsoft.PowerShell.Commands.WebRequestSession

    # Write-Host "Using Login Page URL: $LoginPageUrl"

    # ログインページにアクセス
    try {
        $response = Invoke-WebRequest -Uri $LoginPageUrl -WebSession $session
        $cookie = $response.Headers["Set-Cookie"]
    } catch {
        Write-Host "Error: Failed to access Keycloak login page."
        Write-Host "Message: $($_.Exception.Message)"
        exit 1
    }

    # ログインフォームのアクションURLを取得
    if ($response.Content -match '<form.*?action="(.*?)"') {
        $postUrl = $matches[1]
        if ($postUrl -notmatch "^http") {
            $postUrl = "http://192.168.11.30:8080$postUrl"
        }
    } else {
        Write-Host "Error: Login form not found."
        exit 1
    }

    # Write-Host "Post URL: $postUrl"

    # hidden フィールドを取得
    $hiddenFields = @{}
    if ($response.Content -match '<input type="hidden" name="([^"]+)" value="([^"]*)">') {
        foreach ($match in $matches) {
            $hiddenFields[$match[1]] = $match[2]
        }
    }

    # **フォームデータに hidden フィールドを追加**
    $formData = $hiddenFields + @{
        "username" = $Username
        "password" = $Password
    }

    # **ヘッダーに `Content-Type` を追加し、セッションの Cookie を設定**
    $headers = @{
        "Content-Type" = "application/x-www-form-urlencoded"
        "Cookie" = $cookie
    }

    # 認証リクエストを送信
    try {
        $postResponse = Invoke-WebRequest -Uri $postUrl -Method Post -Headers $headers -Body $formData -WebSession $session
    } catch {
        Write-Host "Error: Failed to post login credentials."
        Write-Host "Message: $($_.Exception.Message)"
        exit 1
    }

    # SAMLResponse を取得
    if ($postResponse.Content -match 'name="SAMLResponse" value="([^"]+)"') {
        $samlAssertion = $matches[1]
        Write-Host "SAML Assertion Retrieved Successfully"
        return $samlAssertion
    } else {
        Write-Host "Error: SAML Response not found. Exiting."
        exit 1
    }
}

# AWS STS認証
function Assume-AWSRoleWithSAML {
    param ($SAMLAssertion)

    Write-Host "*** Assuming AWS Role with SAML via AWS STS API ***"

    $STS_URL = "https://sts.amazonaws.com/"
    $params = @{
        Action         = "AssumeRoleWithSAML"
        RoleArn        = $AWSRoleArn
        PrincipalArn   = $AWSIdPArn
        SAMLAssertion  = $SAMLAssertion
        Version        = "2011-06-15"
    }

    # STS API を直接呼び出す (AWS Tools for PowerShell を使用しない)
    $response = Invoke-RestMethod -Uri $STS_URL -Method Post -Body $params -ContentType "application/x-www-form-urlencoded"

    if ($response.AssumeRoleWithSAMLResponse -and $response.AssumeRoleWithSAMLResponse.AssumeRoleWithSAMLResult) {
        $credentials = $response.AssumeRoleWithSAMLResponse.AssumeRoleWithSAMLResult.Credentials
        Write-Host "AWS Credentials Retrieved Successfully"
        Write-Host $credentials.AccessKeyId
        Write-Host $credentials.SecretAccessKey
        Write-Host $credentials.SessionToken
        return @{
            AccessKey    = $credentials.AccessKeyId
            SecretKey    = $credentials.SecretAccessKey
            SessionToken = $credentials.SessionToken
        }
    } else {
        Write-Host "Error: Failed to assume AWS Role with SAML. Exiting."
        exit 1
    }
}

# S3 アップロード関数
function Upload-ToS3 {
    param (
        [string]$BucketName,
        [string]$FilePath,
        [hashtable]$Credentials
    )

    Write-Host "*** Uploading File to S3 via REST API ***"

    $FileName = [System.IO.Path]::GetFileName($FilePath)
    $S3_URL = "https://s3.us-east-2.amazonaws.com/$BucketName/$FileName"
    $FileContent = [System.IO.File]::ReadAllBytes($FilePath)
    $AWSRegion = "us-east-2"

    # AWS Signature Version 4 のために必要なデータ
    $AccessKey = $Credentials.AccessKey
    $SecretKey = $Credentials.SecretKey  # ← ここで SecretAccessKey を取得
    $SessionToken = $Credentials.SessionToken
    $Service = "s3"
    $Algorithm = "AWS4-HMAC-SHA256"
    $RequestDate = (Get-Date).ToUniversalTime().ToString("yyyyMMddTHHmmssZ")
    $RequestDateShort = $RequestDate.Substring(0,8)

    # Canonical Request
    $CanonicalURI = "/$BucketName/$FileName"
    $CanonicalQueryString = ""
    $CanonicalHeaders = "host:s3.$AWSRegion.amazonaws.com`n" + "x-amz-content-sha256:UNSIGNED-PAYLOAD`n" + "x-amz-date:$RequestDate`n" + "x-amz-security-token:$SessionToken`n"
    $SignedHeaders = "host;x-amz-content-sha256;x-amz-date;x-amz-security-token"
    $PayloadHash = "UNSIGNED-PAYLOAD"

    $CanonicalRequest = "PUT`n$CanonicalURI`n$CanonicalQueryString`n$CanonicalHeaders`n$SignedHeaders`n$PayloadHash"

    # 修正: SHA256 ハッシュの計算
    $CanonicalRequestHash = [BitConverter]::ToString((New-Object System.Security.Cryptography.SHA256Managed).ComputeHash([System.Text.Encoding]::UTF8.GetBytes($CanonicalRequest))) -replace "-",""

    # String to Sign
    $CredentialScope = "$RequestDateShort/$AWSRegion/$Service/aws4_request"
    $StringToSign = "$Algorithm`n$RequestDate`n$CredentialScope`n$CanonicalRequestHash"

    # HMAC-SHA256 計算関数
    function HMAC-SHA256 ($key, $data) {
        $hmacsha256 = New-Object System.Security.Cryptography.HMACSHA256
        $hmacsha256.Key = $key
        return $hmacsha256.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($data))
    }

    # SecretAccessKey を明示的に使用
    function Get-HMACSHA256String {
        param ($key, $data)
        return [BitConverter]::ToString((HMAC-SHA256 $key $data)) -replace "-",""
    }

    # 修正: SecretAccessKey を適切に使用
    $DateKey = HMAC-SHA256 ([System.Text.Encoding]::UTF8.GetBytes("AWS4" + $SecretKey)) $RequestDateShort
    $RegionKey = HMAC-SHA256 $DateKey $AWSRegion
    $ServiceKey = HMAC-SHA256 $RegionKey $Service
    $SigningKey = HMAC-SHA256 $ServiceKey "aws4_request"
    $Signature = Get-HMACSHA256String -key $SigningKey -data $StringToSign

    # Authorization ヘッダーの作成
    $AuthorizationHeader = "$Algorithm Credential=$AccessKey/$CredentialScope, SignedHeaders=$SignedHeaders, Signature=$Signature"

    # ヘッダーを設定
    $Headers = @{
        "Authorization"        = $AuthorizationHeader
        "x-amz-date"           = $RequestDate
        "x-amz-security-token" = $SessionToken
        "x-amz-content-sha256" = "UNSIGNED-PAYLOAD"
    }

    try {
        # PUTリクエストでS3にアップロード
        $Response = Invoke-RestMethod -Uri $S3_URL -Method Put -Headers $Headers -Body $FileContent -ContentType "application/octet-stream"
        Write-Host "Response: $Response"
    } catch {
        Write-Host "Error: Failed to upload to S3."
        Write-Host "Status Code: $($_.Exception.Response.StatusCode.Value__)"
        Write-Host "Message: $($_.Exception.Message)"
        exit 1
    }

    Write-Host "Uploaded $FilePath to S3 bucket $BucketName as $FileName"
}


# S3 ダウンロード関数
function Download-FromS3 {
    param (
        [string]$BucketName,
        [string]$FileName,
        [string]$DownloadPath,
        [hashtable]$Credentials
    )

    Write-Host "*** Downloading File from S3 via REST API ***"

    # $S3_URL = "https://$BucketName.s3.amazonaws.com/$FileName"
    $S3_URL = "https://s3.us-east-2.amazonaws.com/$BucketName/$FileName"  # 修正ポイント

    $Headers = @{
        "x-amz-security-token" = $Credentials.SessionToken
        "Authorization"        = "AWS4-HMAC-SHA256 Credential=$($Credentials.AccessKey)/$(Get-Date -Format "yyyyMMdd")/us-east-1/s3/aws4_request"
    }

    # S3からファイルを取得
    $FileContent = Invoke-RestMethod -Uri $S3_URL -Method Get -Headers $Headers

    # ファイルに保存
    [System.IO.File]::WriteAllBytes($DownloadPath, $FileContent)

    Write-Host "Downloaded $FileName from S3 bucket $BucketName to $DownloadPath"
}

# メイン処理
$SAMLAssertion = Get-SAMLAssertion

if (-not $SAMLAssertion) {
    Write-Host "Error: Failed to retrieve SAML Assertion. Exiting."
    exit 1
}

$AWSCredentials = Assume-AWSRoleWithSAML -SAMLAssertion $SAMLAssertion
# Write-Host $AWSCredentials.SessionToken
Upload-ToS3 -BucketName $S3BucketName -FilePath $LocalFilePath -Credentials $AWSCredentials
Download-FromS3 -BucketName $S3BucketName -FileName "upload-sample.txt" -DownloadPath $DownloadedFilePath -Credentials $AWSCredentials