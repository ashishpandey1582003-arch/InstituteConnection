@echo off
set "OLD_DIR=C:\Users\ASHISH PANDEY\OneDrive\Desktop\InstituteConnection"
set "NEW_DIR=C:\Users\ASHISH PANDEY\OneDrive\Desktop\CampusConnect"

:: Check if script is running from the original directory
if /I "%~dp0"=="%OLD_DIR%\" (
    copy /Y "%~f0" "%TEMP%\rename_temp.bat" >nul
    start "" cmd /c "%TEMP%\rename_temp.bat"
    exit /b
)

echo ==============================================================
echo  CampusConnect Folder Renamer
echo ==============================================================
echo.
echo  Please close VS Code and any other programs using the folder:
echo  "%OLD_DIR%"
echo.
echo  Waiting for the folder to unlock...
echo.

:loop
:: Check if the directory is locked by trying to rename
2>nul (
  rename "%OLD_DIR%" "CampusConnect"
)
if "%ERRORLEVEL%"=="0" (
    goto success
)

timeout /t 2 /nobreak >nul
goto loop

:success
echo.
echo  [SUCCESS] Folder renamed to CampusConnect!
echo  Opening new folder in VS Code...
echo.
code "%NEW_DIR%"
del "%~f0"
exit
