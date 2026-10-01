/**
 * 16-Week Career Roadmap & Technical Interview Bank Data
 * <!-- DOE-VERSION: 2026.10.01 -->
 */

export const PLAN = [
{
  id:"p0", label:"Week 0", title:"Set the board before you study anything",
  window:"3–5 days",
  aim:"Five days of admin that decide how useful the next four months are. Service-year logistics, a working machine, a place to put evidence, and the first applications out the door before you feel ready.",
  blocks:[
    {
      id:"b01", title:"Service year and paperwork", aim:"In Nigeria the service year sets your next twelve months, and most employers ask for the discharge or exemption certificate. Decide the strategy now rather than discovering it in month three.",
      tasks:[
        {id:"t1", text:"Confirm your mobilisation batch and call-up status on the NYSC portal."},
        {id:"t2", text:"Decide the PPA strategy: an IT-capable place of primary assignment beats a comfortable one, because a service year spent in a server room is a year of experience on the CV."},
        {id:"t3", text:"Write a one-page PPA pitch — who you are, what you can already do, what you would do for them — and send it to at least ten small firms, schools and clinics with IT needs."},
        {id:"t4", text:"Scan degree certificate, statement of result and any transcripts into one folder you can attach to applications in seconds."}
      ],
      res:[
        {n:"NYSC portal", u:"https://portal.nysc.gov.ng/", k:"site", c:"free", note:"Call-up letter, mobilisation timetable, relocation."},
        {n:"MyJobMag — NYSC and graduate trainee listings", u:"https://www.myjobmag.com/jobs-by-title/nysc-graduate-trainee", k:"site", c:"free", note:"PPA openings appear here constantly, including IT units."},
        {n:"MyJobMag — entry-level jobs in Nigeria", u:"https://www.myjobmag.com/cp/entry-level-jobs-nigeria", k:"site", c:"free"}
      ]
    },
    {
      id:"b02", title:"Machine setup, deliberately light", aim:"An 8 GB laptop is fine for everything in this track if you don't turn it into a virtualisation experiment on day one. Browser labs first, WSL second, virtual machines only when a lab genuinely needs one.",
      tasks:[
        {id:"t1", text:"Install WSL2 with Ubuntu. This is your Linux machine for the next two months — no dual boot, no VM."},
        {id:"t2", text:"Install Wireshark and Cisco Packet Tracer. Nothing else yet."},
        {id:"t3", text:"Install Git, create a GitHub account if you don't have one, and make a public repo called <code>it-lab-notes</code> with a README."},
        {id:"t4", text:"Set the rule: every command you run this month gets a line in the notes repo saying what it showed and why anyone would run it."}
      ],
      res:[
        {n:"Install WSL (Microsoft)", u:"https://learn.microsoft.com/en-us/windows/wsl/install", k:"doc", c:"free"},
        {n:"Wireshark download", u:"https://www.wireshark.org/download.html", k:"tool", c:"free"},
        {n:"Cisco Packet Tracer via NetAcad", u:"https://www.netacad.com/", k:"tool", c:"free", note:"Free with a Cisco NetAcad account; search the catalogue for Packet Tracer."},
        {n:"GitHub", u:"https://github.com/", k:"tool", c:"free"}
      ]
    },
    {
      id:"b03", title:"CV, LinkedIn and the first five applications", aim:"You apply now, at week zero, while unqualified. Rejections are free and the feedback loop is the point. The CV describes what you can do today plus what you are visibly building.",
      tasks:[
        {id:"t1", text:"Rewrite the CV under one headline: computer science graduate moving into IT infrastructure and security. Not 'aspiring cybersecurity professional'."},
        {id:"t2", text:"Describe the final-year project honestly as a benchmarking study, not a working detector. Wording that survives an interview: built and benchmarked a static malware classification pipeline on PE-header features, including cross-dataset generalisation testing."},
        {id:"t3", text:"Rewrite the LinkedIn headline and About section to match, and turn on 'open to work' for IT support, technical support, NOC and systems support."},
        {id:"t4", text:"Create saved job alerts on four boards using the role titles in the job campaign section below."},
        {id:"t5", text:"Send five applications this week. Yes, this week."}
      ],
      res:[
        {n:"Jobberman", u:"https://www.jobberman.com/", k:"site", c:"free"},
        {n:"MyJobMag", u:"https://www.myjobmag.com/", k:"site", c:"free"},
        {n:"Indeed Nigeria", u:"https://ng.indeed.com/", k:"site", c:"free"},
        {n:"LinkedIn Jobs", u:"https://www.linkedin.com/jobs/", k:"site", c:"free", note:"In Lagos a large share of IT support roles are posted here first and filled through referral before they reach a board."}
      ]
    }
  ]
},
{
  id:"p1", label:"Weeks 1–4", title:"Networking, properly",
  window:"weeks 1–4",
  aim:"The single highest-return investment in this whole plan. Networking is the substrate under IT support, under the NOC, under the SOC. Get genuinely good at it and every later subject becomes cheaper to learn.",
  blocks:[
    {
      id:"b11", title:"Week 1 — how machines actually talk", aim:"Build the mental model: frames and packets, MAC and IP, the difference between a switch and a router, what a default gateway is for. By Friday you should be able to draw the path of a packet from your laptop to a web server on paper.",
      tasks:[
        {id:"t1", text:"Start the TryHackMe Pre Security path and finish the networking modules in it."},
        {id:"t2", text:"Watch Professor Messer's N10-009 sections on the OSI model, network devices, IP fundamentals and ports."},
        {id:"t3", text:"Run and document each of: <code>ipconfig /all</code>, <code>arp -a</code>, <code>route print</code>, <code>nslookup</code>, <code>ping</code>, <code>tracert</code>, <code>netstat -ano</code>. For each: what it shows, why a technician runs it, what fault it helps diagnose."},
        {id:"t4", text:"Do the same on the Linux side: <code>ip a</code>, <code>ip r</code>, <code>ss -tulpn</code>, <code>dig</code>, <code>traceroute</code>."},
        {id:"t5", text:"Commit the command journal to the notes repo. This is your first piece of public evidence."}
      ],
      res:[
        {n:"TryHackMe — Pre Security path", u:"https://tryhackme.com/path/outline/presecurity", k:"course", c:"free", note:"Browser-based, no setup, designed for zero prior experience. Around 40 hours end to end."},
        {n:"Professor Messer — CompTIA Network+ N10-009 course index", u:"https://www.professormesser.com/network-plus/n10-009/n10-009-video/n10-009-training-course/", k:"video", c:"free", note:"87 videos, roughly 13 hours, organised by exam objective. The whole video course is free."},
        {n:"Cisco NetAcad — Introduction to Cybersecurity", u:"https://www.netacad.com/courses/introduction-to-cybersecurity", k:"course", c:"free", note:"Short survey course with a free Cisco certificate of completion. Good orientation, light on depth."},
        {n:"TryHackMe — free content overview", u:"https://tryhackme.com/resources/blog/free_path", k:"doc", c:"free"}
      ]
    },
    {
      id:"b12", title:"Week 2 — subnetting until it is boring", aim:"Subnetting is the one networking skill that gets tested in interviews because it cannot be faked. Target: solve network address, broadcast, first and last host for any /n in under thirty seconds, on paper.",
      tasks:[
        {id:"t1", text:"Learn the mechanics: network address, broadcast address, host range, mask, CIDR, private versus public ranges."},
        {id:"t2", text:"Do twenty randomly generated subnetting problems a day for five days. This is not optional and it is not interesting; do it anyway."},
        {id:"t3", text:"Explain in writing what happens between typing a URL and the page rendering — ARP, DNS, gateway, NAT, TCP handshake, TLS, HTTP. Commit it."},
        {id:"t4", text:"Build a three-router, two-switch topology in Packet Tracer and make every host ping every other host."}
      ],
      res:[
        {n:"Subnetting practice generator (Practical Networking)", u:"https://subnetipv4.com/", k:"practice", c:"free", note:"Random problem generator with auto-check. The daily drill lives here."},
        {n:"subnettingpractice.com", u:"https://subnettingpractice.com/", k:"practice", c:"free", note:"Text and image-based questions, plus a subnet calculator to verify answers."},
        {n:"subnetting.net", u:"https://www.subnetting.net/", k:"practice", c:"free"},
        {n:"Jeremy's IT Lab — free full CCNA course", u:"https://www.youtube.com/@JeremysITLab", k:"video", c:"free", note:"Over 100 videos following the CCNA 200-301 objectives, each with a Packet Tracer lab built on screen."},
        {n:"Jeremy's IT Lab — recommended resources and free labs", u:"https://www.jeremysitlab.com/ccna-resources/", k:"lab", c:"free"},
        {n:"Community notes for the Jeremy's IT Lab course", u:"https://github.com/psaumur/CCNA_Course_Notes", k:"doc", c:"free", note:"Day-by-day markdown notes. Useful for revision, not a substitute for watching."},
        {n:"Jeremy's IT Lab on Teachable (ad-free, slides, quizzes)", u:"https://courses.jeremysitlab.com/p/ccna", k:"course", c:"paid", note:"Same content as the free YouTube course, plus PDFs and quizzes."}
      ]
    },
    {
      id:"b13", title:"Week 3 — routing, switching and the CLI", aim:"Move from knowing what a router does to configuring one. Even at IT-support level, the person who can read a switch config is the person who gets promoted out of the help desk.",
      tasks:[
        {id:"t1", text:"VLANs, trunking, and why a switch stops broadcast storms."},
        {id:"t2", text:"Static routing, then a single-area OSPF lab."},
        {id:"t3", text:"DHCP and DNS configured by hand, then deliberately broken and diagnosed."},
        {id:"t4", text:"NAT, port forwarding, and why your laptop's private address never appears on the internet."},
        {id:"t5", text:"Record one short screen capture of yourself building and testing a topology. It goes in the portfolio later."}
      ],
      res:[
        {n:"Cisco NetAcad course catalogue", u:"https://www.netacad.com/", k:"course", c:"free", note:"Networking Basics and Networking Devices & Initial Configuration are free and self-paced with Packet Tracer labs."},
        {n:"Cisco Networking Academy overview", u:"https://www.cisco.com/site/us/en/learn/training-certifications/training/netacad/index.html", k:"doc", c:"free"},
        {n:"Professor Messer — Network+ certification hub", u:"https://www.professormesser.com/get-n10-009-network-plus-certified/", k:"doc", c:"free", note:"Free course, live monthly Q&A, weekly pop quizzes."}
      ]
    },
    {
      id:"b14", title:"Week 4 — consolidate and prove it", aim:"A week without new material. You write, you drill, you produce the first real portfolio artefact.",
      tasks:[
        {id:"t1", text:"Write a networking troubleshooting runbook: eight faults, the diagnostic sequence for each, the commands used, what output confirms the cause."},
        {id:"t2", text:"Publish it as a proper README in the notes repo, with terminal output pasted in."},
        {id:"t3", text:"Fifty subnetting problems in one sitting, timed."},
        {id:"t4", text:"Decide whether you are going for Network+ or CCNA later, and write down why. Do not buy anything yet."},
        {id:"t5", text:"Ten applications sent this month. Count them."}
      ],
      res:[]
    }
  ]
},
{
  id:"p2", label:"Weeks 5–8", title:"Operating systems: Linux and Windows",
  window:"weeks 5–8",
  aim:"Stop being a person who has heard of Linux. Employers hiring support and NOC staff test two things in practice: can you drive a terminal, and can you find out why a Windows machine is misbehaving.",
  blocks:[
    {
      id:"b21", title:"Weeks 5–6 — Linux you can actually drive", aim:"Files, permissions, processes, packages, services, logs, and enough bash to automate something small. Comfort, not mastery.",
      tasks:[
        {id:"t1", text:"Navigation and files: <code>pwd ls cd mkdir touch cp mv rm cat less head tail</code>."},
        {id:"t2", text:"Searching and text: <code>grep find awk sed sort uniq wc</code> and pipes."},
        {id:"t3", text:"Permissions and ownership: <code>chmod chown</code>, and what 755 actually means bit by bit."},
        {id:"t4", text:"Processes and services: <code>ps top kill systemctl journalctl</code>."},
        {id:"t5", text:"Networking from the shell: <code>ip ss curl wget ssh dig</code>."},
        {id:"t6", text:"Write one bash script that does something you would otherwise do by hand — a backup, a log filter, a health check."},
        {id:"t7", text:"Clear OverTheWire Bandit levels 0 through 20."}
      ],
      res:[
        {n:"Linux Journey", u:"https://linuxjourney.com/", k:"course", c:"free", note:"Short structured lessons, no account needed. The gentlest sensible start."},
        {n:"The Linux Command Line — free PDF (William Shotts)", u:"https://linuxcommand.org/tlcl.php", k:"book", c:"free", note:"555 pages, Creative Commons, free download. The reference you keep open in a second window."},
        {n:"OverTheWire — Bandit wargame", u:"https://overthewire.org/wargames/bandit/", k:"lab", c:"free", note:"Levels solved over SSH. The single best way to make terminal work stick."},
        {n:"tldr pages", u:"https://tldr.sh/", k:"tool", c:"free", note:"Example-first command help. Install it in WSL on day one."},
        {n:"Linux Basics for Hackers, 2nd edition", u:"https://nostarch.com/linux-basics-hackers-2nd-edition", k:"book", c:"paid", note:"Optional. Security-flavoured Linux introduction; skip it if money is tight, the free PDF above covers more ground."}
      ]
    },
    {
      id:"b22", title:"Weeks 7–8 — Windows administration and PowerShell", aim:"You already run Windows, and most Nigerian IT support work is Windows work. Users, groups, permissions, services, the event log, Defender, the firewall, and PowerShell as a first-class tool rather than a curiosity.",
      tasks:[
        {id:"t1", text:"Users, groups, NTFS permissions, and what 'run as administrator' changes."},
        {id:"t2", text:"Processes, services, startup items, scheduled tasks, environment variables."},
        {id:"t3", text:"Event Viewer: find a failed logon, a service crash and a driver error, and explain each."},
        {id:"t4", text:"PowerShell equivalents of everything you learned in week 1: <code>Get-NetIPConfiguration Get-Process Get-Service Get-NetTCPConnection Test-NetConnection Get-WinEvent</code>."},
        {id:"t5", text:"Run Process Explorer and Autoruns from Sysinternals against your own machine and write down what you find."},
        {id:"t6", text:"Windows Defender and Windows Firewall: create a rule, test that it blocks, remove it."},
        {id:"t7", text:"Extend the troubleshooting runbook with a Windows half."}
      ],
      res:[
        {n:"PowerShell 101 (Microsoft Learn)", u:"https://learn.microsoft.com/en-us/powershell/scripting/learn/ps101/00-introduction", k:"doc", c:"free", note:"The official beginner course. Work through it end to end rather than dipping."},
        {n:"Sysinternals suite and documentation", u:"https://learn.microsoft.com/en-us/sysinternals/", k:"tool", c:"free", note:"Process Explorer, Autoruns, Procmon. Free, tiny downloads, used daily by real analysts."},
        {n:"Windows documentation (Microsoft Learn)", u:"https://learn.microsoft.com/en-us/windows/", k:"doc", c:"free"},
        {n:"TryHackMe — Cyber Security 101 path", u:"https://tryhackme.com/paths", k:"course", c:"freemium", note:"Goes deeper into Linux, Windows, Active Directory and PowerShell. Some rooms are subscriber-only."}
      ]
    }
  ]
},
{
  id:"p3", label:"Weeks 9–12", title:"Packets, security fundamentals, frameworks",
  window:"weeks 9–12",
  aim:"Where the networking and systems work turns into security work. This is also where your final-year project stops looking like a machine learning exercise and starts looking like relevant background.",
  blocks:[
    {
      id:"b31", title:"Weeks 9–10 — Wireshark and traffic analysis", aim:"Open a capture and say what happened. Not 'I know Wireshark exists' — actually identify a DNS lookup, a handshake, a redirect and a piece of beaconing.",
      tasks:[
        {id:"t1", text:"Capture your own traffic while loading a website; find the DNS query, the SYN, SYN-ACK, ACK, and the TLS client hello."},
        {id:"t2", text:"Learn display filters properly: <code>http.request</code>, <code>dns</code>, <code>tcp.flags.syn==1</code>, <code>ip.addr==</code>, and how to combine them."},
        {id:"t3", text:"Follow a TCP stream and an HTTP stream, and export an object from a capture."},
        {id:"t4", text:"Work through five Wireshark sample captures and write one paragraph on each."},
        {id:"t5", text:"Then, and only in an isolated environment, do two malware traffic exercises and write up the indicators you found."}
      ],
      res:[
        {n:"Wireshark documentation and User's Guide", u:"https://www.wireshark.org/docs/", k:"doc", c:"free"},
        {n:"Wireshark wiki — sample captures", u:"https://wiki.wireshark.org/samplecaptures", k:"lab", c:"free", note:"Clean protocol examples: ARP, DHCP, DNS, TCP, ICMP, wireless. Start here."},
        {n:"Wireshark tutorial and filter cheat sheet (HackerTarget)", u:"https://hackertarget.com/wireshark-tutorial-and-cheat-sheet/", k:"doc", c:"free"},
        {n:"Netresec — index of public PCAP repositories", u:"https://www.netresec.com/?page=PcapFiles", k:"lab", c:"free", note:"Includes CTF and competition captures. Some archives contain real malware; read the warnings."},
        {n:"Malware-Traffic-Analysis.net — training exercises", u:"https://www.malware-traffic-analysis.net/training-exercises.html", k:"lab", c:"free", note:"Real infection captures with questions and answers. Only open these in a disposable VM with networking off."},
        {n:"Practical Packet Analysis, 3rd edition — capture files", u:"https://nostarch.com/download/ppa-capture-files.zip", k:"lab", c:"free", note:"The book's example captures are a free download even if you don't buy the book."},
        {n:"Practical Packet Analysis, 3rd edition (Chris Sanders)", u:"https://nostarch.com/packetanalysis3", k:"book", c:"paid", note:"The best single book on using Wireshark for real troubleshooting. Worth it later, not now."}
      ]
    },
    {
      id:"b32", title:"Weeks 11–12 — security fundamentals and the shared vocabulary", aim:"The concepts every security interview assumes, plus the two frameworks whose names appear in almost every job description.",
      tasks:[
        {id:"t1", text:"CIA triad, authentication versus authorisation, least privilege, defence in depth."},
        {id:"t2", text:"Hashing versus encryption versus encoding — and why confusing them is an instant interview fail."},
        {id:"t3", text:"Vulnerability, exploit, payload, threat, risk. Define each in one sentence without hedging."},
        {id:"t4", text:"Malware families, phishing, credential stuffing, brute force, lateral movement."},
        {id:"t5", text:"Read the MITRE ATT&CK enterprise matrix and map three techniques you have already seen in a capture or a log."},
        {id:"t6", text:"Read the NIST Cybersecurity Framework 2.0 functions and be able to name all six."},
        {id:"t7", text:"Work the first three PortSwigger Academy topics — SQL injection, XSS, authentication — so you understand what web attacks look like from the attacker's side."}
      ],
      res:[
        {n:"MITRE ATT&CK", u:"https://attack.mitre.org/", k:"doc", c:"free", note:"The shared vocabulary. Every technique has an ID like T1566; analysts write those IDs in reports."},
        {n:"CISA — best practices for ATT&CK mapping", u:"https://www.cisa.gov/news-events/news/best-practices-mitre-attckr-mapping", k:"doc", c:"free"},
        {n:"NIST Cybersecurity Framework", u:"https://www.nist.gov/cyberframework", k:"doc", c:"free", note:"Version 2.0 added Govern to the original five functions."},
        {n:"PortSwigger Web Security Academy", u:"https://portswigger.net/web-security", k:"lab", c:"free", note:"Free, interactive, with progress tracking. Widely considered better than most paid web security courses."},
        {n:"PortSwigger — structured learning paths", u:"https://portswigger.net/web-security/learning-paths", k:"course", c:"free"},
        {n:"Google Cybersecurity Professional Certificate", u:"https://www.coursera.org/professional-certificates/google-cybersecurity", k:"course", c:"freemium", note:"Audit free, or apply for Coursera financial aid for the full certificate at no cost. Around 170 hours. A credential, not a substitute for the hands-on work above."}
      ]
    }
  ]
},
{
  id:"p4", label:"Weeks 13–16", title:"Security operations: logs, SIEM, detection",
  window:"weeks 13–16",
  aim:"The actual day job of a junior analyst: an alert arrives, you decide whether it matters, you write down why. Everything before this was preparation for being able to answer that question.",
  blocks:[
    {
      id:"b41", title:"Weeks 13–14 — logs and a SIEM", aim:"Ingest real data, query it, build a detection, explain a result. On 8 GB of RAM, run one Splunk instance at a time and close everything else.",
      tasks:[
        {id:"t1", text:"Install Splunk Enterprise (free tier) and ingest Windows event logs from your own machine."},
        {id:"t2", text:"Learn enough SPL to filter, count, group and time-chart. Ten queries you wrote yourself, saved."},
        {id:"t3", text:"Load the Boss of the SOC v3 dataset and work through the guided scenario."},
        {id:"t4", text:"Build one dashboard and one alert — failed logons by source, for example — and document the logic."},
        {id:"t5", text:"Take Splunk's free Blue Team Academy introductory courses."}
      ],
      res:[
        {n:"Splunk — free self-paced training courses", u:"https://www.splunk.com/en_us/training/free-courses/overview.html", k:"course", c:"free", note:"Includes the Blue Team Academy introduction to SOC work and the analyst role."},
        {n:"Splunk Boss of the SOC", u:"https://bots.splunk.com/", k:"lab", c:"free"},
        {n:"BOTS v3 dataset on GitHub", u:"https://github.com/splunk/botsv3", k:"lab", c:"free", note:"Open-licensed, pre-indexed, runs on the free Splunk Enterprise trial. Large download — plan your data."}
      ]
    },
    {
      id:"b42", title:"Weeks 15–16 — alert triage and incident write-ups", aim:"Practise the loop: alert, investigate, decide, document. The written investigation is the deliverable — that is literally what the job produces.",
      tasks:[
        {id:"t1", text:"Work the LetsDefend free tier: take alerts from the queue, investigate, close or escalate with reasons."},
        {id:"t2", text:"Complete three CyberDefenders community challenges and publish your methodology for each."},
        {id:"t3", text:"Write two full incident reports: summary, timeline, evidence, indicators, impact, recommendation. One page each, no padding."},
        {id:"t4", text:"Map every finding to an ATT&CK technique ID."},
        {id:"t5", text:"Ask someone technical to read one report and tell you where it is unclear."}
      ],
      res:[
        {n:"LetsDefend", u:"https://letsdefend.io/", k:"lab", c:"freemium", note:"Simulated SOC with a real alert queue and SIEM-like interface. The free tier is enough to learn the workflow."},
        {n:"CyberDefenders — blue team labs", u:"https://cyberdefenders.org/blue-team-labs/", k:"lab", c:"freemium", note:"DFIR and threat-hunting challenges with real forensic artefacts. Generous free tier."},
        {n:"TryHackMe — SOC Level 1 path", u:"https://tryhackme.com/paths", k:"course", c:"freemium", note:"Structured guided rooms. Good scaffolding if LetsDefend feels like being thrown in."}
      ]
    }
  ]
},
{
  id:"px", label:"Running", title:"Track A — the job campaign",
  window:"every week, from week 0",
  aim:"This runs in parallel from day one. The job hunt is not something that starts after the learning; it is one of the things being learned. Ten applications a week, tracked, with the reasons for rejection recorded where you get them.",
  blocks:[
    {
      id:"bA1", title:"Search these titles, not just 'cybersecurity'", aim:"Breadth matters more than precision at entry level, and the infrastructure roles are where the doors actually open.",
      tasks:[
        {id:"t1", text:"Primary: IT Support, IT Support Officer, Technical Support, IT Technician, Help Desk, Desktop Support, Systems Support."},
        {id:"t2", text:"Networking: Network Support, Network Technician, NOC Technician, Junior Network Administrator."},
        {id:"t3", text:"Trainee: IT Graduate Trainee, Junior Systems Administrator, IT Intern."},
        {id:"t4", text:"Security, in parallel: SOC Analyst, SOC Trainee, Junior Security Analyst, Cybersecurity Graduate Trainee."},
        {id:"t5", text:"Apply to roles asking for two years' experience anyway. 'Entry level, two years required' is a wish list, not a filter."}
      ],
      res:[]
    },
    {
      id:"bA2", title:"Referral beats applications", aim:"In Lagos a large share of these roles are filled before they are posted. Cold applications are the slow lane; you run both.",
      tasks:[
        {id:"t1", text:"List ten people who already know you — lecturers, seniors, church, family friends — and tell each of them specifically what you are looking for. Not 'any job'."},
        {id:"t2", text:"Join two Nigerian IT or security communities on WhatsApp, Telegram or Slack and be visibly useful in them."},
        {id:"t3", text:"Post one thing you built or learned publicly every fortnight. Short, specific, no hashtag padding."},
        {id:"t4", text:"After every interview, write down the questions you could not answer and turn them into the next week's study list."}
      ],
      res:[]
    },
    {
      id:"bA3", title:"Application log", aim:"Tracked properly, an application log tells you which version of your CV works. Untracked, you just feel bad.",
      tasks:[], res:[], widget:"apps"
    }
  ]
},
{
  id:"py", label:"Running", title:"Track B — own your final-year project",
  window:"2–3 hours a week",
  aim:"The malware classification project is the single most security-relevant thing on the CV, and the most dangerous if you cannot explain it. If parts of it were AI-generated, do not lie and do not bin it: learn it until it is genuinely yours.",
  blocks:[
    {
      id:"bB1", title:"Rebuild it by hand", aim:"Reading code you did not write does not survive an interviewer asking why the scaler was fitted only on the training split.",
      tasks:[
        {id:"t1", text:"Delete one module and rewrite it from scratch without looking, then diff against the original. Repeat for every module."},
        {id:"t2", text:"Be able to explain: what a PE file is, what a PE header contains, and why that metadata separates malicious from benign binaries at all."},
        {id:"t3", text:"Explain the preprocessing: why the scaler was fitted on training data only, why the split was stratified, what leakage would look like."},
        {id:"t4", text:"Explain the models: what LightGBM does differently from random forest, and why you compared against logistic regression at all."},
        {id:"t5", text:"Explain the metrics: what F1 balances, why accuracy is a poor headline for detection, what a false positive costs a SOC at 3am."},
        {id:"t6", text:"Explain the interesting result: within-dataset accuracy near 99% collapsing to the mid-60s across datasets, and what that says about benchmark numbers generally."}
      ],
      res:[
        {n:"MITRE ATT&CK — for mapping the malware behaviour you classified", u:"https://attack.mitre.org/", k:"doc", c:"free"},
        {n:"Practical Malware Analysis (Sikorski & Honig)", u:"https://nostarch.com/catalog/security", k:"book", c:"paid", note:"The standard text if you later want to go deeper into static and dynamic analysis. Not needed for this track."}
      ]
    },
    {
      id:"bB2", title:"Split the repository in two", aim:"The archive keeps everything. The portfolio version is the one you send to employers, and it should be clean enough to read in five minutes.",
      tasks:[
        {id:"t1", text:"Archive repo: keep the full project — datasets, thesis drafts, supervisor materials, experiment artefacts."},
        {id:"t2", text:"Portfolio repo: source, a small sample dataset, results, and a README that a stranger can follow. No <code>__pycache__</code>, no Word lock files, no reference PDFs."},
        {id:"t3", text:"README leads with the honest framing: a benchmarking study of static PE-header classification including cross-dataset generalisation and inference-cost measurement."},
        {id:"t4", text:"State the dataset limitation openly — that only two of the four are ransomware-versus-goodware and the other two are general malware-versus-benign. Catching your own confound is a strength, not something to bury."},
        {id:"t5", text:"Add a results table and one chart of the cross-dataset degradation. It is the most interesting number you have."}
      ],
      res:[]
    }
  ]
},
{
  id:"pz", label:"Decisions", title:"Certifications, portfolio and interviews",
  window:"month 3 onward",
  aim:"What to buy, what to build, and what you will be asked. None of this happens in week one.",
  blocks:[
    {
      id:"bC1", title:"The certification decision, deferred to month three", aim:"Certificates do real filtering work at the Nigerian CV screen, so 'never bother' is wrong advice — but so is buying a voucher before you can subnet. Study free, pay late, pay once.",
      tasks:[
        {id:"t1", text:"Study Network+ material free from week one. Decide in month three whether to sit it."},
        {id:"t2", text:"If you want the networking path: CCNA carries more weight with Nigerian employers than Network+, and Jeremy's course covers it free."},
        {id:"t3", text:"If you want the security path: Security+ after Network+, not instead of it."},
        {id:"t4", text:"Fund the voucher from a first salary, not from savings before employment."},
        {id:"t5", text:"Free credentials worth collecting meanwhile: Cisco NetAcad course certificates, TryHackMe path completions, Google Cybersecurity via Coursera financial aid."}
      ],
      res:[
        {n:"Professor Messer — Network+ hub (free video course)", u:"https://www.professormesser.com/get-n10-009-network-plus-certified/", k:"video", c:"free"},
        {n:"Jeremy's IT Lab — free CCNA course", u:"https://www.youtube.com/@JeremysITLab", k:"video", c:"free"},
        {n:"Coursera financial aid — Google Cybersecurity Certificate", u:"https://www.coursera.org/professional-certificates/google-cybersecurity", k:"course", c:"freemium", note:"The aid application takes about fifteen minutes and roughly two weeks to approve; approval rates are high."}
      ]
    },
    {
      id:"bC2", title:"Four portfolio artefacts, not twelve", aim:"Employers skim. Four small, finished, well-documented things beat a graveyard of half-built repos.",
      tasks:[
        {id:"t1", text:"Networking and Windows troubleshooting runbook with real command output."},
        {id:"t2", text:"A Packet Tracer topology with a written design rationale and test results."},
        {id:"t3", text:"Two traffic-analysis or alert-triage write-ups with ATT&CK mappings."},
        {id:"t4", text:"The cleaned portfolio version of the final-year project."},
        {id:"t5", text:"A pinned GitHub profile README that ties the four together in six sentences."}
      ],
      res:[]
    },
    {
      id:"bC3", title:"Interview question bank", aim:"Answer each of these out loud, timed, before you need to. Open one, say the answer, then check yourself.",
      tasks:[], res:[], widget:"qa"
    },
    {
      id:"bC4", title:"Working log", aim:"One line a day. What you did, what broke, what you still cannot explain. This is also where interview answers come from six weeks later.",
      tasks:[], res:[], widget:"log"
    }
  ]
}
];

export const QA = [
  ["Walk me through what happens when you type a URL and press enter.",
   "Browser cache and hosts file, DNS resolution (recursive resolver, root, TLD, authoritative), ARP for the gateway if the destination is off-subnet, TCP three-way handshake, TLS handshake, HTTP request, response, render. Interviewers are listening for whether you know where ARP stops and routing starts."],
  ["What is the difference between a switch and a router?",
   "A switch forwards frames within a broadcast domain using MAC addresses; a router forwards packets between networks using IP addresses and maintains a routing table. A switch does not shrink a broadcast domain unless you introduce VLANs."],
  ["A user says the internet is down. What do you check, in order?",
   "Scope it first — one machine or everyone. Then link, IP configuration, gateway reachability, DNS resolution, then external reachability by IP versus by name. Naming the order matters more than naming the tools."],
  ["What does 192.168.10.75/26 give you?",
   "Network 192.168.10.64, broadcast 192.168.10.127, usable hosts .65 to .126, 62 hosts. If you cannot do this in under thirty seconds you are not ready to be asked it."],
  ["Difference between hashing and encryption?",
   "Encryption is reversible with a key and protects confidentiality; hashing is one-way and protects integrity or stores password verifiers. Encoding is neither and protects nothing."],
  ["What is the difference between authentication and authorisation?",
   "Authentication establishes who you are; authorisation determines what that identity may do. Most privilege-escalation incidents are authorisation failures, not authentication failures."],
  ["You see 300 failed logons from one IP followed by one success. What do you do?",
   "Treat it as a probable successful brute force. Confirm the account, check what the session did after the success, check whether the source is expected, contain the account, escalate. Say what evidence would change your mind."],
  ["What is a false positive and why does it matter operationally?",
   "An alert that fires on benign activity. It matters because analyst attention is the scarce resource: a noisy rule trains a team to ignore the category, which is how real detections get closed unread."],
  ["Tell me about your final-year project.",
   "Lead with the honest framing — a benchmark of static PE-header classifiers including cross-dataset testing and inference-cost measurement. Then lead with the interesting finding, which is the generalisation collapse, not the headline accuracy."],
  ["Your model got 99% accuracy. Is it production-ready?",
   "No. Within-dataset accuracy measures fit to one distribution. Cross-dataset evaluation dropped it to roughly 65%, which means the features were partly capturing dataset artefacts. In production the relevant questions are base rate, false-positive cost and drift over time."],
  ["Which parts of that code did you write?",
   "Answer plainly. Say what was generated, say that you rewrote it module by module to understand it, then demonstrate that by explaining a design decision in detail. Interviewers forgive tool use; they do not forgive being unable to explain your own repository."],
  ["Why do you want IT support rather than a security role?",
   "Because security operations sit on top of networking and systems, and you would rather be the analyst who understands the infrastructure than the one reading alerts about systems they have never administered. Say it as a plan, not an apology."],
  ["What is MITRE ATT&CK, in one sentence?",
   "A public catalogue of observed adversary tactics and techniques with stable IDs, which gives defenders a shared vocabulary for describing what an attacker did."],
  ["Where do you see the gaps in your own knowledge right now?",
   "Name two real ones and say what you are doing about each this month. Claiming no gaps at entry level reads as either dishonest or unaware."]
];

export const STATUSES = ["Applied","Screening","Interview","Task/Test","Offer","Rejected","No reply"];

export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyCP4dS9tG9Weklw4Yq2s7EJW2NyAoJgwxQ",
  authDomain: "it-tracker-md.firebaseapp.com",
  projectId: "it-tracker-md",
  storageBucket: "it-tracker-md.firebasestorage.app",
  messagingSenderId: "402091333238",
  appId: "1:402091333238:web:bd788de1d0c092d23ef157",
  measurementId: "G-0TD84QG4SG"
};
