' 1-Click Study Cockpit Launcher
' Silently starts the local media daemon on port 8080 and opens the web application
Set WshShell = CreateObject("WScript.Shell")

pythonPath = "C:\Python313\pythonw.exe"
scriptPath = "C:\Users\David\Projects\it-security-tracker\serve_study_media.py"
url = "https://it-security-tracker.vercel.app"

' Start local media daemon silently without opening a terminal window (0 = hidden)
WshShell.Run """" & pythonPath & """ """ & scriptPath & """", 0, False

' Brief pause for port bind
WScript.Sleep 400

' Open default browser directly to the Study Cockpit
WshShell.Run url
