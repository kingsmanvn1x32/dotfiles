@echo OFF
:: This batch file exists to run updater-streamlink-pw.ps1 without hassle
pushd %~dp0
if exist "%~dp0\installer\updater-streamlink-pw.ps1" (
    set updater_script="%~dp0\installer\updater-streamlink-pw.ps1"
) else (
    set updater_script="%~dp0\updater-streamlink-pw.ps1"
)
powershell -noprofile -nologo -executionpolicy bypass -File %updater_script%

:: After update, updater-streamlink-pw.ps1 should not in same folder as mpv.exe
if exist "%~dp0\installer\updater-streamlink-pw.ps1" if exist "%~dp0\updater-streamlink-pw.ps1" (
    del "%~dp0\updater-streamlink-pw.ps1"
)
timeout 5
