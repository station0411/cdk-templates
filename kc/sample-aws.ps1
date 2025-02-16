# PowerShellスクリプト: S3へのアップロード・ダウンロード (Keycloak SAML認証)

# 設定
# $KeycloakIP = "192.168.11.30"
$LoginPageUrl = "http://192.168.11.30:8080/realms/master/protocol/saml/clients/aws"
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

function Get-SAMLAssertion {
    Write-Host "*** Getting SAML Assertion ***"
    
    # 初回リクエストでログインページ取得
    $session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
    $response = Invoke-WebRequest -Uri $LoginPageUrl -SessionVariable session

    # ログインフォームの情報取得
    $html = $response.Content
    if ($html -match '<form.*?action="(.*?)"') {
        $postUrl = $matches[1]
        if ($postUrl -notmatch "^http") {
            $postUrl = "http://$KeycloakIP:8080$postUrl"
        }
    } else {
        $postUrl = $LoginPageUrl
    }

    Write-Host "Post URL: $postUrl"

    # ログインフォームの情報取得
    $formData = @{}
    $inputMatches = [regex]::Matches($html, '<input.*?name="(.*?)".*?value="(.*?)".*?>')
    foreach ($match in $inputMatches) {
        $formData[$match.Groups[1].Value] = $match.Groups[2].Value
    }

    # ユーザー名・パスワードをセット
    $formData["username"] = $Username
    $formData["password"] = $Password

    # フォーム送信
    $postResponse = Invoke-WebRequest -Uri $postUrl -Method Post -Body $formData -WebSession $session
    Write-Host "Post Response Content: " $postResponse.Content  # デバッグ用

    # SAMLResponseを取得
    $samlMatch = [regex]::Matches($postResponse.Content, '<input.*?name="SAMLResponse".*?value="(.*?)".*?>')

    if ($samlMatch.Count -gt 0) {
        $SAMLAssertion = $samlMatch[0].Groups[1].Value
        Write-Host "SAML Assertion Retrieved Successfully"
    } else {
        Write-Host "SAML Response not found. Exiting."
        exit 1
    }

    return $SAMLAssertion
}

# AWS STS認証
function Assume-AWSRoleWithSAML {
    param ($SAMLAssertion)

    Write-Host "*** Assuming AWS Role with SAML ***"

    # AWS Tools モジュールが正しくロードされているかチェック
    if (-not (Get-Command -Name Use-STSRoleWithSAML -ErrorAction SilentlyContinue)) {
        Write-Host "Error: AWS.Tools.SecurityToken module does not have 'Use-STSRoleWithSAML'"
        Write-Host "Please update the AWS Tools for PowerShell."
        exit 1
    }

    # AWS STS 認証の実行
    $stsResponse = Use-STSRoleWithSAML -RoleArn $AWSRoleArn -PrincipalArn $AWSIdPArn -SAMLAssertion $SAMLAssertion

    Write-Host "AWS STS Response:"
    Write-Host $stsResponse

    if ($stsResponse -and $stsResponse.Credentials) {
        Write-Host "AWS Credentials Retrieved Successfully"
        return @{
            AccessKey    = $stsResponse.Credentials.AccessKeyId
            SecretKey    = $stsResponse.Credentials.SecretAccessKey
            SessionToken = $stsResponse.Credentials.SessionToken
        }
    } else {
        Write-Host "Error: Failed to assume AWS Role with SAML. Exiting."
        exit 1
    }
}

# メイン処理
$SAMLAssertion = Get-SAMLAssertion

if (-not $SAMLAssertion) {
    Write-Host "Error: Failed to retrieve SAML Assertion. Exiting."
    exit 1
}

$AWSCredentials = Assume-AWSRoleWithSAML -SAMLAssertion $SAMLAssertion

# S3 アップロード関数
function Upload-ToS3 {
    param ($Credentials)

    Write-Host "*** Uploading File to S3 ***"
    
    Set-AWSCredential -AccessKey $Credentials.AccessKey -SecretKey $Credentials.SecretKey -SessionToken $Credentials.SessionToken -StoreAs SAMLSession
    Write-S3Object -BucketName $S3BucketName -File $LocalFilePath -Key $S3ObjectName -Region $AWSRegion -ProfileName SAMLSession
    
    Write-Host "Uploaded $LocalFilePath to S3 bucket $S3BucketName as $S3ObjectName"
}

# S3 ダウンロード関数
function Download-FromS3 {
    param ($Credentials)

    Write-Host "*** Downloading File from S3 ***"
    
    Set-AWSCredential -AccessKey $Credentials.AccessKey -SecretKey $Credentials.SecretKey -SessionToken $Credentials.SessionToken -StoreAs SAMLSession
    Read-S3Object -BucketName $S3BucketName -Key $S3ObjectName -File $DownloadedFilePath -Region $AWSRegion -ProfileName SAMLSession
    
    Write-Host "Downloaded $S3ObjectName from S3 bucket $S3BucketName to $DownloadedFilePath"
}

Upload-ToS3 -Credentials $AWSCredentials
Download-FromS3 -Credentials $AWSCredentials