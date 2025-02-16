# 設定

# aws cloudwatch put-metric-data \
#     --namespace "YourNamespace" \
#     --metric-name "YourMetricName" \
#     --value 100 \
#     --dimensions Name=YourDimension,Value=YourValue

# aws logs put-log-events \
#     --log-group-name "YourLogGroup" \
#     --log-stream-name "YourLogStream" \
#     --log-events '[{"timestamp":'$(date +%s000)', "message":"This is a test log message"}]' \
#     --sequence-token "YourSequenceToken"

# LOG_GROUP="YourLogGroup"
# LOG_STREAM="YourLogStream"
# # SequenceToken を取得
# TOKEN=$(aws logs describe-log-streams --log-group-name "$LOG_GROUP" --log-stream-name-prefix "$LOG_STREAM" --query 'logStreams[0].uploadSequenceToken' --output text)
# # 現在の時刻を取得（ミリ秒）
# TIMESTAMP=$(date +%s000)
# # ログを送信
# aws logs put-log-events \
#     --log-group-name "$LOG_GROUP" \
#     --log-stream-name "$LOG_STREAM" \
#     --log-events "[{\"timestamp\":$TIMESTAMP, \"message\":\"New log entry\"}]" \
#     ${TOKEN:+--sequence-token "$TOKEN"}

$LOGIN_PAGE_URL = "http://192.168.11.30:8080/realms/master/protocol/saml/clients/aws"
$USERNAME = "keycloak-admin"
$PASSWORD = "password"

$AWS_ROLE_ARN = "arn:aws:iam::111597699083:role/keycloak-admin"   # 変更
$AWS_IDP_ARN = "arn:aws:iam::111597699083:saml-provider/keycloak"  # 変更
$AWS_REGION = "us-east-2"  # 東京リージョン
$S3_BUCKET_NAME = "kzyk-sato.com"  # S3バケット名 (変更)
$LOCAL_FILE_PATH = "C:\sample\upload-sample.txt"  # アップロードするファイルのパス
$S3_OBJECT_NAME = "download-sample.txt"  # S3上のファイル名
$DOWNLOADED_FILE_PATH = "C:\sample\download-sample.txt"  # ダウンロード先のファイルパス

function Get-SAMLAssertion {
    Write-Host "*** Getting SAML Assertion ***"
    
    $session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
    $response = Invoke-WebRequest -Uri $LOGIN_PAGE_URL -SessionVariable session
    
    $html = $response.Content
    if ($html -match '<form.*?action="(.*?)"') {
        $postUrl = $matches[1]
        if ($postUrl -notmatch "^http") {
            $postUrl = "http://192.168.11.30:8080$postUrl"
        }
    } else {
        $postUrl = $LOGIN_PAGE_URL
    }

    $formData = @{}
    $inputMatches = [regex]::Matches($html, '<input.*?name="(.*?)".*?value="(.*?)".*?>')
    foreach ($match in $inputMatches) {
        $formData[$match.Groups[1].Value] = $match.Groups[2].Value
    }

    $formData["username"] = $USERNAME
    $formData["password"] = $PASSWORD
    
    $postResponse = Invoke-WebRequest -Uri $postUrl -Method Post -Body $formData -WebSession $session
    
    $samlMatch = [regex]::Matches($postResponse.Content, '<input.*?name="SAMLResponse".*?value="(.*?)".*?>')
    
    if ($samlMatch.Count -gt 0) {
        return $samlMatch[0].Groups[1].Value
    } else {
        Write-Host "SAML Response not found. Exiting."
        exit 1
    }
}

function Assume-AWSRoleWithSAML {
    param ($SAMLAssertion)
    
    Write-Host "*** Assuming AWS Role with SAML ***"
    
    $stsResponse = aws sts assume-role-with-saml `
        --role-arn $AWS_ROLE_ARN `
        --principal-arn $AWS_IDP_ARN `
        --saml-assertion $SAMLAssertion `
        --query 'Credentials' `
        --output json | ConvertFrom-Json
    
    if (-not $stsResponse) {
        Write-Host "Error: Failed to assume AWS Role with SAML. Exiting."
        exit 1
    }
    
    return $stsResponse
}

function Upload-ToS3 {
    param ($Credentials)
    
    Write-Host "*** Uploading File to S3 ***"
    
    $env:AWS_ACCESS_KEY_ID = $Credentials.AccessKeyId
    $env:AWS_SECRET_ACCESS_KEY = $Credentials.SecretAccessKey
    $env:AWS_SESSION_TOKEN = $Credentials.SessionToken
    
    aws s3 cp $LOCAL_FILE_PATH "s3://$S3_BUCKET_NAME/$S3_OBJECT_NAME" --region $AWS_REGION
    
    Write-Host "Uploaded $LOCAL_FILE_PATH to S3 bucket $S3_BUCKET_NAME as $S3_OBJECT_NAME"
}

function Download-FromS3 {
    param ($Credentials)
    
    Write-Host "*** Downloading File from S3 ***"
    
    $env:AWS_ACCESS_KEY_ID = $Credentials.AccessKeyId
    $env:AWS_SECRET_ACCESS_KEY = $Credentials.SecretAccessKey
    $env:AWS_SESSION_TOKEN = $Credentials.SessionToken
    
    aws s3 cp "s3://$S3_BUCKET_NAME/$S3_OBJECT_NAME" $DOWNLOADED_FILE_PATH --region $AWS_REGION
    
    Write-Host "Downloaded $S3_OBJECT_NAME from S3 bucket $S3_BUCKET_NAME to $DOWNLOADED_FILE_PATH"
}

$SAMLAssertion = Get-SAMLAssertion
$AWSCredentials = Assume-AWSRoleWithSAML -SAMLAssertion $SAMLAssertion

Upload-ToS3 -Credentials $AWSCredentials
Download-FromS3 -Credentials $AWSCredentials
