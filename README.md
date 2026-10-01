# Study Cockpit & IT Security Career Track

[![Live Web App](https://img.shields.io/badge/Production-Live%20App-00c853?style=for-the-badge&logo=vercel)](https://it-security-tracker.vercel.app)
[![Job Pipeline](https://img.shields.io/badge/Job%20Bot-Action%20Hub-00e5ff?style=for-the-badge)](https://david-job-finder.vercel.app)
[![Curriculum](https://img.shields.io/badge/Cisco-CCNA%20200--301-1ba0d7?style=for-the-badge&logo=cisco)](https://www.cisco.com/)
[![License](https://img.shields.io/badge/License-MIT-gray?style=for-the-badge)](LICENSE)

An offline-first study cockpit, interactive curriculum checklist, and job search dashboard designed to systematically guide a computer science or engineering graduate into **Enterprise IT Support**, **Network Engineering (Cisco CCNA 200-301)**, and **Security Operations (SOC)**.

---

## Overview

Studying for technical certifications while managing job applications usually creates a cluttered mess of open browser tabs, lost bookmarks, scattered flashcard decks, and forgotten spreadsheets.

**Study Cockpit** consolidates the entire workflow into a single interface:

* **Daily Study Cockpit**: Video lectures with instant byte-range seeking, Picture-in-Picture mode, spaced-repetition Anki flashcards, interactive IP subnetting drills, and 1-click Cisco CLI cheatsheets.
* **16-Week Working Track**: 98 step-by-step checkpoints spanning workstation prep, CCNA networking, Linux & Windows sysadmin, packet analysis, and SOC log triage.
* **Autonomous Job Hunt Integration**: Live bidirectional sync with an autonomous job scraping bot tracking hundreds of applications, interviews, and fresh market openings.
* **Seamless Cross-Device Sync**: Study on your desktop, then scan a 1-second QR code to continue reviewing cards or syllabus checkpoints on your mobile phone in real time.

---

## Key Features

### 1. Daily Study Cockpit
* **Dual-Mode Media Streaming**: Instant local RFC 7233 byte-range streaming for downloaded 1080p CCNA lectures, with seamless automatic fallback to official YouTube streams when away from your primary desktop.
* **Multi-Part Lesson Selector**: Days with multiple resources (Lecture, Lab Walkthrough, Extra Flashcards) feature clean pill navigation to switch lessons instantly.
* **Direct YouTube Mobile Hub**: Clean 1-tap launcher to bypass embedded mobile YouTube playback restrictions and open directly in the YouTube app.
* **Floating Picture-in-Picture (PiP)**: Keep video lectures visible on top while practicing configurations in Cisco Packet Tracer or a Linux shell.
* **Built-in Spaced Repetition (2,157 Cards)**: Comprehensive Anki decks following the SuperMemo SM-2 algorithm embedded directly into the browser—no third-party software needed.
* **Interactive Subnetting Gym**: Rapid-fire IPv4 network, broadcast, CIDR, and host calculation generator with real-time feedback and streak tracking.
* **Cisco Command Cheatsheet**: Copy-paste production IOS commands for VLANs, OSPF, trunking, ACLs, and DHCP directly to your clipboard.
* **Adaptive Velocity Engine**: Non-punitive EWMA pacing that adjusts timeline targets automatically without guilt-inducing red overdue flags.

### 2. The 16-Week Structured Roadmap
* **Phase 0 — Setup & Strategy (Weeks 0–1)**: Workstation configuration (WSL2, Packet Tracer), service year planning, CV headlines, and early outreach.
* **Phase 1 — Networking Substrate (Weeks 2–10)**: Deep OSI/TCP-IP fundamentals, Jeremy's 63-day CCNA course, routing, switching, and CLI runbooks.
* **Phase 2 — Systems & Packet Analysis (Weeks 11–13)**: Linux command-line fluency, Windows administration, Wireshark packet captures, and MITRE ATT&CK framework mapping.
* **Phase 3 — SOC Operations & Career (Weeks 14–16)**: Splunk SIEM log queries, incident report authoring, technical interview bank simulations, and offer negotiation.

### 3. Native Distraction-Free Desktop Window
* **Zero Browser Clutter**: Launches directly in its own standalone application window via an isolated Chromium profile—no address bars, extension popups, or open browser tabs.
* **1-Click Launch**: A single desktop shortcut automatically initializes the background Python media daemon on port `8080` and brings up the interface instantly.

### 4. Resilient Offline-First Cloud Sync
* **Immediate Local Persistence**: All checkbox toggles, study notes, and timer states persist locally in browser storage immediately.
* **Firestore Cloud Vault**: Synchronizes automatically to Firebase Firestore with built-in revision timestamps to prevent cross-device clobbering.
* **Automatic Reconnection Flush**: Progress made while offline is safely queued and automatically uploaded the moment network connectivity resumes.
* **Instant Mobile Pairing**: Open **More → Cloud Sync & Mobile Pairing** to pair any phone via QR code or 1-tap direct link without entering passwords.
* **Glassmorphic Passcode Gate (PIN 7821)**: Protects your study cockpit, notes, and metrics across shared or mobile devices with optional 30-day device memory.

### 5. Mobile & Responsive Layout
* **Adaptive Full-Width Viewport**: Edge-to-edge touch layout, horizontal swipeable navigation for command tabs and lesson pills, and stacked lab cards formatted for thumb-friendly mobile study sessions.

---

## Quick Start

### Option A: Open in Browser (Any Device)
Visit [**https://it-security-tracker.vercel.app**](https://it-security-tracker.vercel.app) on any phone, tablet, or laptop.

### Option B: 1-Click Native Desktop App (Windows)
1. Double-click the **Study Cockpit** icon on your Desktop (or run `launch_cockpit.vbs`).
2. The local RFC 7233 media daemon silently boots in the background on port `8080`.
3. The cockpit opens immediately in a borderless, dedicated window with zero browser tab clutter.

### Option C: Manual Local Server
```bash
# Start local streaming & web daemon
python serve_study_media.py --port 8080

# Open in browser
start http://localhost:8080
```

---

## System Architecture

```
Study Cockpit Architecture
├── Web Frontend (Offline-First Single Page Application)
│   ├── index.html              # Clean semantic entrypoint with glassmorphic PIN gate
│   ├── css/cockpit.css         # Modern dark-mode design system & HSL variables
│   └── js/
│       ├── app.js              # Application coordinator & tab navigation
│       ├── state.js            # Unified store with Firestore sync & conflict guard
│       ├── matrix.js           # 63-Day CCNA video, lab, and command matrix
│       ├── roadmapData.js      # 16-Week syllabus data, tasks, & interview QA bank
│       ├── roadmapView.js      # Interactive phase & block checklist component
│       ├── player.js           # Dual-source video player with PiP support
│       ├── flashcards.js       # SuperMemo SM-2 spaced repetition deck engine
│       ├── subnetting.js       # Dynamic IPv4 subnetting problem generator
│       ├── velocity.js         # Adaptive EWMA velocity & study session timer
│       ├── jobsView.js         # Embedded AI Job-Finder pipeline interface
│       └── drawer.js           # Modal drawer (Cloud Sync, QR pairing, backups)
│
├── Local Streaming Daemon (serve_study_media.py)
│   ├── RFC 7233 Server         # Multi-threaded byte-range media chunk streamer
│   ├── Static Web Server       # 100% offline local asset hosting
│   └── Job Pipeline Cache      # 30-second cached proxy to job scraper endpoints
│
└── Desktop Launcher (launch_cockpit.vbs / .bat)
    └── Chromium Container      # Isolated --app mode with dedicated profile
```

---

## Roadmap Phases Summary

| Phase | Duration | Focus Area | Key Deliverables |
| :--- | :--- | :--- | :--- |
| **Phase 0** | Weeks 0–1 | Foundation & Setup | WSL2, Packet Tracer, CV rewrite, 5 practice applications |
| **Phase 1** | Weeks 2–10 | Cisco CCNA 200-301 | 63 Days of lectures, labs, subnetting drills, routing topologies |
| **Phase 2** | Weeks 11–13 | OS & Packet Analysis | Bash automation, Windows Event Viewer, Wireshark captures |
| **Phase 3** | Weeks 14–16 | SOC & Job Offers | Splunk BOTS v3 queries, incident write-ups, interview simulations |
| **Track A** | Continuous | Job Campaign | 10 tracked applications/week, referral network, pipeline bot |
| **Track B** | Continuous | Final-Year Project | PE malware benchmark, Green-AI metrics, public portfolio repo |

---

## Data Privacy & Backups

Your data belongs entirely to you. You can export or import your full state at any time:
1. Open **... More → Data Vault & Backup**.
2. Click **Download JSON Profile Backup** to save a timestamped snapshot of your checklist, notes, flashcard intervals, and study time.
3. Use **Restore Profile from File** on any machine to restore your complete study history.

---

## Credits & Curriculum References

* **Cisco CCNA 200-301 Curriculum**: Jeremy McDowell ([Jeremy's IT Lab](https://www.youtube.com/@JeremysITLab)).
* **CompTIA Network+ N10-009**: Professor James Messer ([Professor Messer](https://www.professormesser.com/)).
* **Spaced Repetition Algorithm**: SuperMemo SM-2 by Dr. Piotr Woźniak.