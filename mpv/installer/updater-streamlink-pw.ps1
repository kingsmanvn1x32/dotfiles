$fallback7z = Join-Path (Get-Location) "\7z\7zr.exe";

function Get-7z {
    $7z_command = Get-Command -CommandType Application -ErrorAction Ignore 7z.exe | Select-Object -Last 1
    if ($7z_command) {
        return $7z_command.Source
    }
    $7zdir = Get-ItemPropertyValue -ErrorAction Ignore "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\7-Zip" "InstallLocation"
    if ($7zdir -and (Test-Path (Join-Path $7zdir "7z.exe"))) {
        return Join-Path $7zdir "7z.exe"
    }
    if (Test-Path $fallback7z) {
        return $fallback7z
    }
    return $null
}

function Check-7z {
    if (-not (Get-7z)) {
        $null = New-Item -ItemType Directory -Force (Split-Path $fallback7z)
        $download_file = $fallback7z
        Write-Host "Downloading 7zr.exe" -ForegroundColor Green
        aria2c -x 16 -s 16 -j 16 -k 10M -o $download_file "https://www.7-zip.org/a/7zr.exe"
    }
    else {
        Write-Host "7z already exist. Skipped download" -ForegroundColor Green
    }
}

function Check-PowershellVersion {
    $version = $PSVersionTable.PSVersion.Major
    Write-Host "Checking Windows PowerShell version -- $version" -ForegroundColor Green
    if ($version -le 2) {
        Write-Host "Using Windows PowerShell $version is unsupported. Upgrade your Windows PowerShell." -ForegroundColor Red
        throw
    }
}

function Download-Archive ($filename, $link) {
    Write-Host "Downloading" $filename -ForegroundColor Green
    aria2c -x 16 -s 16 -j 16 -k 10M -o $filename $link
}

function Extract-Archive ($file) {
    $7z = Get-7z
    Write-Host "Extracting" $file -ForegroundColor Green
    & $7z x -y $file -aoa
}

function Get-Latest-Streamlink {
    $filename = ""
    $download_link = ""
    $api_gh = "https://api.github.com/repos/streamlink/windows-builds/releases/latest"
    $json = Invoke-WebRequest $api_gh -MaximumRedirection 0 -ErrorAction Ignore -UseBasicParsing | ConvertFrom-Json
    $filename = $json.assets | where { $_.name -Match "streamlink-.*-x86_64\.zip" } | Select-Object -ExpandProperty name
    $download_link = $json.assets | where { $_.name -Match "streamlink-.*-x86_64\.zip" } | Select-Object -ExpandProperty browser_download_url
    if ($filename -is [array]) {
        return $filename[0], $download_link[0]
    }
    else {
        return $filename, $download_link
    }
}

function ExtractGitFromFile {
    $noiDung = Get-Content -Path 'check-update-streamlink.txt'
    return $noiDung
}

function ExtractGitFromURL($filename) {
    $pattern = "streamlink-.*-x86_64\.zip"
    $blool = $filename -match $pattern
    return $Matches[0]
}
function nameFile($filename) {
    $pattern2 = "streamlink-.*-x86_64"
    $bool2 = $filename -match $pattern2
    return $Matches[0]
}

function Test-Admin {
    $user = [Security.Principal.WindowsIdentity]::GetCurrent();
    (New-Object Security.Principal.WindowsPrincipal $user).IsInRole([Security.Principal.WindowsBuiltinRole]::Administrator)
}

function  Create-XML {
    @"
<settings>
  <autodelete>true</autodelete>
</settings>
"@ | Set-Content "settings-streamlink.xml" -Encoding UTF8
}

function Check-Autodelete($archive) {
    $autodelete = ""
    $file = "settings-streamlink.xml"

    if (-not (Test-Path $file)) { exit }
    [xml]$doc = Get-Content $file
    if ($doc.settings.autodelete -eq "unset") {
        $result = Read-KeyOrTimeout "Delete archives after extract? [Y/n] (default=Y)" "Y"
        Write-Host ""
        if ($result -eq 'Y') {
            $autodelete = "true"
        }
        elseif ($result -eq 'N') {
            $autodelete = "false"
        }
        else {
            throw "Please enter valid input key."
        }
        $doc.settings.autodelete = $autodelete
        $doc.Save($file)
    }
    if ($doc.settings.autodelete -eq "true") {
        if (Test-Path $archive) {
            Remove-Item -Force $archive
        }
    }
}

function Upgrade-Streamlink {
    $need_download = $false
    $remoteName = ""
    $download_link = ""
    cd D:\mpv
    $remoteName, $download_link = Get-Latest-Streamlink
    $localgit = ExtractGitFromFile
    $remotegit = ExtractGitFromURL $remoteName
    if ($localgit -match $remotegit) {
        Write-Host "You are already using latest streamlink build -- $remoteName" -ForegroundColor Green
        $need_download = $false
    }
    else {
        Write-Host "Newer streamlink build available" -ForegroundColor Green
        $need_download = $true
    }

    if ($need_download) {
        Download-Archive $remoteName $download_link
        Check-7z
        Extract-Archive $remoteName
        Start-Sleep -Seconds 3
        Write-Host "Remove old streamlink folder" -ForegroundColor Green
        Remove-Item -Path "D:\mpv\streamlink" -Recurse -Force
        Start-Sleep -Seconds 3
        $filename2 = nameFile $remoteName
        Write-Host "Rename folder" $filename2 -ForegroundColor Green
        Rename-Item -Path "D:\mpv\${filename2}" -NewName "D:\mpv\streamlink" -Force
        Set-Content -Path "D:\mpv\check-update-streamlink.txt" -Value $remoteName
        Start-Sleep -Seconds 3
        Write-Host "Override twitch.py" -ForegroundColor Green
        iwr -Uri 'https://github.com/2bc4/streamlink-ttvlol/releases/latest/download/twitch.py' -OutFile .\streamlink\pkgs\streamlink\plugins\twitch.py
    }
    Check-Autodelete $remoteName
}

function Read-KeyOrTimeout ($prompt, $key) {
    $seconds = 9
    $startTime = Get-Date
    $timeOut = New-TimeSpan -Seconds $seconds

    Write-Host "$prompt " -ForegroundColor Green

    # Basic progress bar
    [Console]::CursorLeft = 0
    [Console]::Write("[")
    [Console]::CursorLeft = $seconds + 2
    [Console]::Write("]")
    [Console]::CursorLeft = 1

    while (-not [System.Console]::KeyAvailable) {
        $currentTime = Get-Date
        Start-Sleep -s 1
        Write-Host "#" -ForegroundColor Green -NoNewline
        if ($currentTime -gt $startTime + $timeOut) {
            Break
        }
    }
    if ([System.Console]::KeyAvailable) {
        $response = [System.Console]::ReadKey($true).Key
    }
    else {
        $response = $key
    }
    return $response.ToString()
}

#
# Main script entry point
#
if (Test-Admin) {
    Write-Host "Running script with administrator privileges" -ForegroundColor Yellow
}
else {
    Write-Host "Running script without administrator privileges" -ForegroundColor Red
}

try {
    Check-PowershellVersion
    # Sourceforge only support TLS 1.2
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    $global:progressPreference = 'silentlyContinue'
    Upgrade-Streamlink
    Write-Host "Operation completed" -ForegroundColor Magenta
}
catch [System.Exception] {
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
