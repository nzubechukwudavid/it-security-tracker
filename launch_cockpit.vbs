' 1-Click Study Cockpit Launcher
' Silently starts the local media daemon on port 8080 and opens the web application in a dedicated, distraction-free native app window.
Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

pythonPath = "C:\Python313\pythonw.exe"
scriptPath = "C:\Users\David\Projects\it-security-tracker\serve_study_media.py"
url = "http://localhost:8080"
profileDir = "C:\Users\David\Projects\it-security-tracker\data\cache\app_profile"

' Start local media daemon silently without opening a terminal window (0 = hidden)
WshShell.Run Chr(34) & pythonPath & Chr(34) & " " & Chr(34) & scriptPath & Chr(34), 0, False

' Brief pause for port bind
WScript.Sleep 500

' Detect browser executable for dedicated standalone app window
edgePath1 = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
edgePath2 = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
bravePath = "C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe"

appExe = ""
If fso.FileExists(edgePath1) Then
    appExe = edgePath1
ElseIf fso.FileExists(edgePath2) Then
    appExe = edgePath2
ElseIf fso.FileExists(bravePath) Then
    appExe = bravePath
End If

If appExe <> "" Then
    ' Launch borderless, standalone window without URL bar or existing tabs
    cmd = Chr(34) & appExe & Chr(34) & " --app=" & url & " --user-data-dir=" & Chr(34) & profileDir & Chr(34) & " --start-maximized --no-first-run --no-default-browser-check"
    WshShell.Run cmd, 1, False
Else
    ' Fallback to standard URL launch if no chromium browser binary is located
    WshShell.Run url
End If