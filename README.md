# IT → Security Career Track & Study Cockpit
> **A zero-friction, offline-capable study cockpit and real-time job-hunt pipeline designed to systematically transition a computer science/engineering graduate into Enterprise IT Support, Network Engineering (Cisco CCNA 200-301), and Security Operations (SOC).**

[![Live Web App](https://img.shields.io/badge/Live_App-it--security--tracker.vercel.app-00dfa2?style=for-the-badge&logo=vercel)](https://it-security-tracker.vercel.app)
[![Architecture](https://img.shields.io/badge/Architecture-DOE_2026.10.01-00b4d8?style=for-the-badge)](https://it-security-tracker.vercel.app)
[![WCAG](https://img.shields.io/badge/Accessibility-WCAG_2.2_AA-6f42c1?style=for-the-badge)](https://it-security-tracker.vercel.app)
[![Python](https://img.shields.io/badge/Daemon-Python_3.10+-3776ab?style=for-the-badge&logo=python)](serve_study_media.py)

---

## 🎯 Program Vision & Core Purpose

Navigating the transition from academic computer science into enterprise infrastructure and cybersecurity requires more than passive video consumption. It requires **hands-on muscle memory**, **active recall**, **non-punitive pacing**, and an **aggressive, automated job-application campaign**.

This project provides a single, unified operating system for this 16-week transformation:
1. **CCNA 200-301 Mastery**: 63 structured days covering Jeremy's IT Lab lectures, Packet Tracer configuration labs, and Anki review cycles.
2. **Enterprise Practical Skills**: 32-bit bitwise IPv4 subnetting practice under speed, Cisco IOS CLI syntax memory, and live SIEM/SOC fundamentals.
3. **Automated Job Search Engine**: Directly synchronized with an autonomous 4-hour GitHub Actions job crawler and Vercel KV store tracking sent applications, interviews, and fresh Lagos/Remote opportunities.
4. **Cross-Device Parity**: Study at home on your workstation with local 1080p high-bitrate video scrubbing, and review flashcards or roadmap milestones on your mobile phone via 1-tap pairing.

---

## 🚀 Key Features & Architectural Highlights

### 1. Mode A: Single-Screen Study Cockpit
* **Today's Mission HUD**: Dynamic single-screen interface displaying the current day's lecture topic, official exam objectives, and direct Packet Tracer lab download links.
* **Dual-Engine Video Streamer ([RFC 7233](https://tools.ietf.org/html/rfc7233))**:
  * *Local Stream (Primary)*: Serves downloaded 1080p videos via a Python byte-range streaming daemon (serve_study_media.py) on port 8080 with instant seeking and zero buffering.
  * *YouTube Fallback (Auto-Detect)*: Automatically probes local daemon health in under 600ms; if offline (e.g. on mobile data), seamlessly switches to official YouTube embeds.
* **Picture-in-Picture (PiP) Floating Controller**: 1-click floating video overlay that hovers over Cisco Packet Tracer or terminal windows for distraction-free single-screen labbing.
* **SuperMemo SM-2 Spaced Repetition**: 2,157 Anki flashcards extracted directly from the CCNA curriculum embedded in-browser. Features 3D card flipping, difficulty ratings (Again, Hard, Good, Easy), and interval calculations—no desktop Anki software required.
* **Interactive Subnetting Gym**: Practice calculating Network IDs, Broadcast IDs, First/Last Usable hosts, and Host Counts across /24 to /30 subnets with instant validation and 4 progressive mastery tiers.
* **Cisco IOS CLI Cheatsheet**: Context-aware command reference matching the active day's syllabus (enable, lan, switchport, ip route, outer ospf, crypto key, port-security) with 1-click clipboard copy.
* **Adaptive Velocity Engine**: Tracks active study time using the W3C Page Visibility API. Uses Exponentially Weighted Moving Average (EWMA) to forecast exam readiness dynamically without punitive red markers.

### 2. Mode B: 16-Week Working Track (Roadmap)
* **98 Milestone Tasks**: Complete operational blueprint spanning:
  * **Phase 0 (Weeks 0–1)**: NYSC PPA strategy, service-year server-room placement pitch, portfolio evidence vault setup.
  * **Phase 1 (Weeks 2–10)**: CCNA 200-301 master sprint (Networking fundamentals, IP connectivity, Security fundamentals, Automation).
  * **Phase 2 (Weeks 11–13)**: Security Operations (SOC), Wazuh/Splunk SIEM home labbing, incident response triage, and ticketing workflows.
  * **Phase 3 (Weeks 14–16)**: High-impact interview campaign, cold reachouts, technical screening prep, and contract negotiation.
* **Bidirectional Progress Synchronization**: Completing days in the Study Cockpit automatically checks off corresponding roadmap milestones, and vice-versa.
* **Instant Task Search & Filtering**: Rapid keyword filtering across task titles, tools, and objectives.

### 3. Real-Time Action Hub & Autonomous Bot Integration
* **Live Vercel KV Sync**: Queries the live REST API at https://david-job-finder.vercel.app/api/applied to track real application statuses without manual logging.
* **Autonomous 4-Hour Crawler**: Synchronized with GitHub Actions scheduled crawler (job_bot.yml) scraping entry-level tech roles across Lagos and remote global boards.
* **Pipeline Metrics at a Glance**:
  * 📬 **42 Applications Sent** (39 submitted, 3 interview calls)
  * 🎙️ **3 Active Interview Screenings** (Vethan Concept Group, Geoinfotech Resources, UnifiedTrust Network)
  * ✨ **85 Fresh Unapplied Roles** ready for review
  * 🚫 **196 Ignored / Filtered Roles**
* **Direct Action Hub Launcher**: Prominent **🚀 Open 1-Click Action Hub ↗** button for instant 1-tap application submissions.

### 4. Cross-Device Cloud Sync & Mobile Pairing
* **Local-First with Firestore Vault**: Data persists locally in localStorage first (offline instant load), with debounced background sync to Firebase Firestore.
* **1-Tap Pairing & QR Code**: Pair mobile browsers instantly by scanning the QR code in the **More** drawer or sharing the 1-Tap URL (?sync=david-track-2026) via WhatsApp/Telegram.
* **Debounced Echo-Guarded Sync**: State commits are debounced (2.5s) to eliminate rapid status flashing and preserve network quotas. Local writes filter out Firestore snapshot echoes.

---

## 🛠️ Technology Stack & Standards

| Layer | Technologies & Standards |
| :--- | :--- |
| **Frontend Core** | Vanilla JavaScript (ES2022 Modules), HTML5 Semantic Structure, Web Components |
| **Design System** | Pure CSS (Custom HSL color system, Glassmorphism, Dark/Light modes, Zero CSS frameworks) |
| **Streaming Engine** | RFC 7233 (HTTP 206 Partial Content), HTML5 Video API, W3C MediaSession, W3C Picture-in-Picture |
| **Algorithms** | SuperMemo SM-2 Spaced Repetition, IPv4 Bitwise Mask Calculation, EWMA Study Velocity |
| **Cloud Synchronization** | Firebase Firestore (Multi-device state channels), Vercel KV (Serverless Redis REST) |
| **Media Daemon** | Python 3.10+ Standard Library (http.server, socketserver.ThreadingMixIn, urllib) |
| **PWA & Offline** | W3C Service Worker (stale-while-revalidate), Web App Manifest |
| **Accessibility & Security** | WCAG 2.2 AA Compliance, OWASP A01 Path Traversal Canonical Sandboxing |

---

## 📂 Repository Layout

`
it-security-tracker/
├── web/                           # Production web application (deployed to Vercel)
│   ├── index.html                 # Unified single-screen Study Cockpit & Roadmap
│   ├── legacy_tracker.html        # Original milestone tracker (preserved archive)
│   ├── css/
│   │   └── cockpit.css            # Modular design system, HSL variables & typography
│   ├── js/
│   │   ├── app.js                 # App lifecycle bootstrap, routing & keybindings
│   │   ├── state.js               # Reactive store with history ring-buffer & debounced sync
│   │   ├── matrix.js              # CCNA 63-day master syllabus & video mapping
│   │   ├── player.js              # Dual-engine RFC 7233 / YouTube video player
│   │   ├── pip.js                 # W3C Picture-in-Picture floating video controller
│   │   ├── subnetting.js          # Interactive bitwise IPv4 subnetting practice gym
│   │   ├── flashcards.js          # SuperMemo SM-2 active recall spaced repetition deck
│   │   ├── cheatsheet.js          # Cisco IOS command reference with 1-click copy
│   │   ├── velocity.js            # Page Visibility study timer & EWMA forecast engine
│   │   ├── roadmapData.js         # 16-Week Working Track structured curriculum (98 tasks)
│   │   ├── roadmapView.js         # Interactive roadmap renderer with checkbox tracking
│   │   ├── jobsView.js            # Real-time Vercel KV & GitHub Actions job tracker
│   │   └── drawer.js              # Operations drawer (About, Pairing, Jobs, Q&A, Backup)
│   ├── data/
│   │   └── flashcards/            # 60 Anki flashcard JSON decks (2,157 cards)
│   ├── sw.js                      # Offline service worker caching engine
│   ├── manifest.webmanifest       # Progressive Web App configuration
│   └── vercel.json                # Vercel deployment routing & headers
├── serve_study_media.py           # Standalone RFC 7233 local video daemon & KV bridge
├── requirements.txt               # Dependencies (Standard library, 0 mandatory extras)
├── .gitignore                     # Git ignore rules
└── README.md                      # Project documentation
`

---

## 🚦 Quick Start Guide

### Option A: Use the Live Web Application
Simply open **[https://it-security-tracker.vercel.app](https://it-security-tracker.vercel.app)** in any desktop or mobile browser.
* All flashcards, subnetting practice, roadmap tasks, and YouTube video streams are 100% operational in standalone mode.

### Option B: Run with Local 1080p Video Streaming (Desktop)
To stream downloaded CCNA lecture videos locally with zero-latency scrubbing:

1. **Clone the repository:**
   `ash
   git clone https://github.com/nzubechukwudavid/it-security-tracker.git
   cd it-security-tracker
   `

2. **Launch the local media streaming daemon:**
   `ash
   python serve_study_media.py
   `
   * The server starts on http://127.0.0.1:8080/.
   * It serves videos directly from your local download folder with byte-range seeking.

3. **Open the cockpit:**
   * Open web/index.html in your browser, or visit the live app at https://it-security-tracker.vercel.app (it probes and connects to your local daemon automatically).

### Option C: Mobile Phone Pairing
1. On your desktop, click **... More** in the top-right masthead.
2. Select **☁️ Cloud Sync & Mobile Pairing**.
3. Scan the displayed QR code with your phone camera, or tap **📋 Copy 1-Tap Link** and send it to your phone via WhatsApp or Telegram.
4. Your phone opens the app paired to your session key. Progress ticks, flashcards, and completed days sync across both screens in real time.

---

## 🗺️ 16-Week Working Track Overview

| Phase | Duration | Focus Area | Key Milestones |
| :---: | :---: | :--- | :--- |
| **Phase 0** | Weeks 0–1 | Pre-Study Admin & NYSC Strategy | NYSC call-up validation, IT-capable PPA pitching, working machine setup, evidence repository. |
| **Phase 1** | Weeks 2–10 | Cisco CCNA 200-301 Deep Dive | Network devices, IPv4/IPv6 subnetting, VLANs, Trunks, STP, EtherChannel, OSPF, ACLs, NAT, Security. |
| **Phase 2** | Weeks 11–13 | SOC & Hands-On Security Operations | Wazuh/Elastic SIEM deployment, log analysis, Linux log triage, incident investigation playbook. |
| **Phase 3** | Weeks 14–16 | Career Engine & Interview Campaign | CV transformation, technical screening interview drills, recruiter follow-ups, offer negotiations. |

---

## 📄 License & Credits

* **Curriculum Content**: Based on the comprehensive CCNA 200-301 training by Jeremy McDowell ([Jeremy's IT Lab](https://www.youtube.com/@JeremysITLab)).
* **Spaced Repetition Engine**: Built upon the SuperMemo SM-2 algorithmic model.
* **Architecture**: Maintained under DOE Architecture Standard 2026.10.01.
