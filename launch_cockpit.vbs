' 1-Click Study Cockpit Launcher
' Silently starts the local media daemon on port 8080 and opens the web application.
Set WshShell = CreateObject("WScript.Shell")

pythonPath = "C:\Python313\pythonw.exe"
scriptPath = "C:\Users\David\Projects\it-security-tracker\serve_study_media.py"
url = "http://localhost:8080"

' Start local media daemon silently without opening a terminal window (0 = hidden)
WshShell.Run Chr(34) & pythonPath & Chr(34) & " " & Chr(34) & scriptPath & Chr(34), 0, False

' Brief pause for port bind
WScript.Sleep 500

' Open default browser directly to the local Study Cockpit
WshShell.Run url
