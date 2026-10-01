/**
 * CCNA 200-301 Master Course Matrix Data Module
 * <!-- DOE-VERSION: 2026.10.01 -->
 */

export const CCNA_MATRIX = [
  {
    "day": 1,
    "topic": "Network Devices",
    "videos": [
      "001_Day_01_Lecture_Network Devices.mp4",
      "002_Day_01_Lab_Packet Tracer Introduction.mp4",
      "003_Day_01_Extra_Anki Flashcards.mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_01_Lab_-_Packet_Tracer_Introduction.pkt",
      "path": "/media/labs/Day_01_Lab_-_Packet_Tracer_Introduction.pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 22,
      "deck_url": "/media/flashcards/json/day_01_flashcards.json"
    },
    "commands": []
  },
  {
    "day": 2,
    "topic": "Interfaces and Cables",
    "videos": [
      "004_Day_02_Lecture_Interfaces and Cables.mp4",
      "005_Day_02_Lab_Connecting Devices.mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_02_Lab_-_Connecting_Devices.pkt",
      "path": "/media/labs/Day_02_Lab_-_Connecting_Devices.pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 57,
      "deck_url": "/media/flashcards/json/day_02_flashcards.json"
    },
    "commands": []
  },
  {
    "day": 3,
    "topic": "How the TCP IP Model Actually Works",
    "videos": [
      "006_Day_03_Lecture_How the TCP_IP Model Actually Works.mp4",
      "007_Day_03_Lab_OSI Model.mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_03_Lab_-_OSI_Model.pkt",
      "path": "/media/labs/Day_03_Lab_-_OSI_Model.pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 25,
      "deck_url": "/media/flashcards/json/day_03_flashcards.json"
    },
    "commands": []
  },
  {
    "day": 4,
    "topic": "Intro to the CLI",
    "videos": [
      "008_Day_04_Lecture_Intro to the CLI.mp4",
      "009_Day_04_Lab_Basic Device Security.mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_04_Lab_-_Basic_Device_Security.pkt",
      "path": "/media/labs/Day_04_Lab_-_Basic_Device_Security.pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 28,
      "deck_url": "/media/flashcards/json/day_04_flashcards.json"
    },
    "commands": [
      {
        "cmd": "enable",
        "mode": "User Exec",
        "desc": "Enter Privileged Exec mode"
      },
      {
        "cmd": "disable",
        "mode": "Priv Exec",
        "desc": "Return to User Exec mode"
      },
      {
        "cmd": "configure terminal",
        "mode": "Priv Exec",
        "desc": "Enter Global Configuration mode"
      },
      {
        "cmd": "hostname R1",
        "mode": "Global Config",
        "desc": "Set device hostname to R1"
      },
      {
        "cmd": "exit",
        "mode": "Any Config",
        "desc": "Exit current configuration sub-mode"
      },
      {
        "cmd": "end",
        "mode": "Any Config",
        "desc": "Return directly to Privileged Exec mode (or press Ctrl+Z)"
      },
      {
        "cmd": "show running-config",
        "mode": "Priv Exec",
        "desc": "View active configuration in RAM"
      },
      {
        "cmd": "write memory",
        "mode": "Priv Exec",
        "desc": "Save running-config to startup-config in NVRAM"
      }
    ]
  },
  {
    "day": 5,
    "topic": "Ethernet LAN Switching (Part 1)",
    "videos": [
      "010_Day_05_Part_1_Ethernet LAN Switching (Part 1).mp4"
    ],
    "lab": {
      "has_lab": false,
      "pkt_file": null,
      "path": null
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 38,
      "deck_url": "/media/flashcards/json/day_05_flashcards.json"
    },
    "commands": [
      {
        "cmd": "interface gigabitethernet 0/0",
        "mode": "Global Config",
        "desc": "Enter interface configuration mode"
      },
      {
        "cmd": "description Uplink to Core Switch",
        "mode": "Interface",
        "desc": "Add descriptive label to interface"
      },
      {
        "cmd": "ip address 192.168.1.1 255.255.255.0",
        "mode": "Interface",
        "desc": "Assign IPv4 address and subnet mask"
      },
      {
        "cmd": "no shutdown",
        "mode": "Interface",
        "desc": "Enable and bring the interface administratively up"
      },
      {
        "cmd": "show ip interface brief",
        "mode": "Priv Exec",
        "desc": "Summary table of IP addresses and interface status"
      },
      {
        "cmd": "show interfaces g0/0",
        "mode": "Priv Exec",
        "desc": "Detailed interface counters, errors, and MTU"
      }
    ]
  },
  {
    "day": 6,
    "topic": "Ethernet LAN Switching (Part 2)",
    "videos": [
      "011_Day_06_Part_2_Ethernet LAN Switching (Part 2).mp4",
      "012_Day_06_Lab_Analyzing Ethernet Switching.mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_06_Lab_-_Ethernet_LAN_Switching.pkt",
      "path": "/media/labs/Day_06_Lab_-_Ethernet_LAN_Switching.pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 17,
      "deck_url": "/media/flashcards/json/day_06_flashcards.json"
    },
    "commands": [
      {
        "cmd": "enable secret Cisco123!",
        "mode": "Global Config",
        "desc": "Set encrypted Privileged Exec password"
      },
      {
        "cmd": "service password-encryption",
        "mode": "Global Config",
        "desc": "Encrypt all plain-text passwords in config"
      },
      {
        "cmd": "line console 0",
        "mode": "Global Config",
        "desc": "Enter console line configuration mode"
      },
      {
        "cmd": "password ConsolePass123",
        "mode": "Line Config",
        "desc": "Set console login password"
      },
      {
        "cmd": "login",
        "mode": "Line Config",
        "desc": "Require password entry on console connection"
      },
      {
        "cmd": "banner motd # Authorized Access Only #",
        "mode": "Global Config",
        "desc": "Configure legal warning login banner"
      }
    ]
  },
  {
    "day": 7,
    "topic": "IPv4 Addressing (Part 1)",
    "videos": [
      "013_Day_07_Part_1_IPv4 Addressing (Part 1).mp4"
    ],
    "lab": {
      "has_lab": false,
      "pkt_file": null,
      "path": null
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 27,
      "deck_url": "/media/flashcards/json/day_07_flashcards.json"
    },
    "commands": [
      {
        "cmd": "show mac address-table",
        "mode": "Priv Exec",
        "desc": "Display switch MAC address table"
      },
      {
        "cmd": "clear mac address-table dynamic",
        "mode": "Priv Exec",
        "desc": "Flush all dynamically learned MAC addresses"
      },
      {
        "cmd": "mac address-table static 0001.0002.0003 vlan 1 interface g0/1",
        "mode": "Global Config",
        "desc": "Bind static MAC address to port"
      }
    ]
  },
  {
    "day": 8,
    "topic": "IPv4 Addressing (Part 2)",
    "videos": [
      "014_Day_08_Part_2_IPv4 Addressing (Part 2).mp4",
      "015_Day_08_Lab_Configuring IP Addresses.mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_08_Lab_-_IPv4_Addresses.pkt",
      "path": "/media/labs/Day_08_Lab_-_IPv4_Addresses.pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 17,
      "deck_url": "/media/flashcards/json/day_08_flashcards.json"
    },
    "commands": []
  },
  {
    "day": 9,
    "topic": "Switch Interfaces",
    "videos": [
      "016_Day_09_Lecture_Switch Interfaces.mp4",
      "017_Day_09_Lab_Configuring Interfaces.mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_09_Lab_-_Interface_Configuration.pkt",
      "path": "/media/labs/Day_09_Lab_-_Interface_Configuration.pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 23,
      "deck_url": "/media/flashcards/json/day_09_flashcards.json"
    },
    "commands": [
      {
        "cmd": "show interfaces status",
        "mode": "Priv Exec",
        "desc": "Display port status, duplex, speed, and VLAN"
      },
      {
        "cmd": "speed 100",
        "mode": "Interface",
        "desc": "Manually force port speed to 100 Mbps"
      },
      {
        "cmd": "duplex full",
        "mode": "Interface",
        "desc": "Manually set full-duplex transmission mode"
      },
      {
        "cmd": "mdix auto",
        "mode": "Interface",
        "desc": "Enable Auto-MDIX cable detection"
      }
    ]
  },
  {
    "day": 10,
    "topic": "IPv4 Header",
    "videos": [
      "018_Day_10_Lecture_IPv4 Header.mp4"
    ],
    "lab": {
      "has_lab": false,
      "pkt_file": null,
      "path": null
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 56,
      "deck_url": "/media/flashcards/json/day_10_flashcards.json"
    },
    "commands": []
  },
  {
    "day": 11,
    "topic": "Routing Fundamentals",
    "videos": [
      "019_Day_11_Part_1_Routing Fundamentals.mp4",
      "020_Day_11_Part_2_Static Routing.mp4",
      "021_Day_11_Lab_Configuring Static Routes.mp4",
      "022_Day_11_Lab_Troubleshooting Static Routes.mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_11_Lab_-_Troubleshooting_Static_Routes.pkt",
      "path": "/media/labs/Day_11_Lab_-_Troubleshooting_Static_Routes.pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 29,
      "deck_url": "/media/flashcards/json/day_11_flashcards.json"
    },
    "commands": [
      {
        "cmd": "ip route 192.168.2.0 255.255.255.0 10.0.0.2",
        "mode": "Global Config",
        "desc": "Configure static route via next-hop IP"
      },
      {
        "cmd": "ip route 192.168.3.0 255.255.255.0 g0/1",
        "mode": "Global Config",
        "desc": "Configure static route via exit interface"
      },
      {
        "cmd": "ip route 0.0.0.0 0.0.0.0 10.0.0.2",
        "mode": "Global Config",
        "desc": "Configure default static route (Gateway of Last Resort)"
      },
      {
        "cmd": "show ip route",
        "mode": "Priv Exec",
        "desc": "Display the IPv4 routing table"
      }
    ]
  },
  {
    "day": 12,
    "topic": "The Life of a Packet",
    "videos": [
      "023_Day_12_Lecture_The Life of a Packet.mp4",
      "024_Day_12_Lab_Life of a Packet.mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_12_Lab_-_Life_of_a_Packet.pkt",
      "path": "/media/labs/Day_12_Lab_-_Life_of_a_Packet.pkt"
    },
    "flashcards": {
      "has_cards": false,
      "card_count": 0,
      "deck_url": null
    },
    "commands": []
  },
  {
    "day": 13,
    "topic": "Subnetting (Part 1)",
    "videos": [
      "025_Day_13_Part_1_Subnetting (Part 1).mp4"
    ],
    "lab": {
      "has_lab": false,
      "pkt_file": null,
      "path": null
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 21,
      "deck_url": "/media/flashcards/json/day_13_flashcards.json"
    },
    "commands": []
  },
  {
    "day": 14,
    "topic": "Subnetting (Part 2)",
    "videos": [
      "026_Day_14_Part_2_Subnetting (Part 2).mp4"
    ],
    "lab": {
      "has_lab": false,
      "pkt_file": null,
      "path": null
    },
    "flashcards": {
      "has_cards": false,
      "card_count": 0,
      "deck_url": null
    },
    "commands": []
  },
  {
    "day": 15,
    "topic": "Subnetting (Part 3 - VLSM)",
    "videos": [
      "027_Day_15_Part_3_Subnetting (Part 3 - VLSM).mp4",
      "028_Day_15_Lab_Subnetting (VLSM).mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_15_Lab_-_VLSM.pkt",
      "path": "/media/labs/Day_15_Lab_-_VLSM.pkt"
    },
    "flashcards": {
      "has_cards": false,
      "card_count": 0,
      "deck_url": null
    },
    "commands": []
  },
  {
    "day": 16,
    "topic": "VLANs (Part 1)",
    "videos": [
      "029_Day_16_Part_1_VLANs (Part 1).mp4",
      "030_Day_16_Lab_VLANs (Part 1).mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_16_Lab_-_VLANs_(Part_1).pkt",
      "path": "/media/labs/Day_16_Lab_-_VLANs_(Part_1).pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 12,
      "deck_url": "/media/flashcards/json/day_16_flashcards.json"
    },
    "commands": [
      {
        "cmd": "vlan 10",
        "mode": "Global Config",
        "desc": "Create VLAN 10 and enter VLAN config mode"
      },
      {
        "cmd": "name Engineering",
        "mode": "VLAN Config",
        "desc": "Assign name to VLAN 10"
      },
      {
        "cmd": "interface range g0/1 - 4",
        "mode": "Global Config",
        "desc": "Select multiple interfaces simultaneously"
      },
      {
        "cmd": "switchport mode access",
        "mode": "Interface",
        "desc": "Set port as an access port"
      },
      {
        "cmd": "switchport access vlan 10",
        "mode": "Interface",
        "desc": "Assign port to VLAN 10"
      },
      {
        "cmd": "show vlan brief",
        "mode": "Priv Exec",
        "desc": "Display all VLANs and their assigned access ports"
      }
    ]
  },
  {
    "day": 17,
    "topic": "VLANs (Part 2)",
    "videos": [
      "031_Day_17_Part_2_VLANs (Part 2).mp4",
      "032_Day_17_Lab_2_VLANs (Part 2).mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_17_Lab_-_VLANs_(Part_2).pkt",
      "path": "/media/labs/Day_17_Lab_-_VLANs_(Part_2).pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 33,
      "deck_url": "/media/flashcards/json/day_17_flashcards.json"
    },
    "commands": [
      {
        "cmd": "interface g0/24",
        "mode": "Global Config",
        "desc": "Select trunk interface"
      },
      {
        "cmd": "switchport mode trunk",
        "mode": "Interface",
        "desc": "Configure port as an 802.1Q trunk"
      },
      {
        "cmd": "switchport trunk allowed vlan 10,20,30",
        "mode": "Interface",
        "desc": "Filter allowed VLANs on trunk link"
      },
      {
        "cmd": "switchport trunk native vlan 99",
        "mode": "Interface",
        "desc": "Set untagged native VLAN to 99"
      },
      {
        "cmd": "show interfaces trunk",
        "mode": "Priv Exec",
        "desc": "Verify active trunk ports and allowed VLANs"
      }
    ]
  },
  {
    "day": 18,
    "topic": "VLANs (Part 3)",
    "videos": [
      "033_Day_18_Part_3_VLANs (Part 3).mp4",
      "034_Day_18_Lab_3_VLANs (Part 3).mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_18_Lab_-_Multilayer_Switching.pkt",
      "path": "/media/labs/Day_18_Lab_-_Multilayer_Switching.pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 9,
      "deck_url": "/media/flashcards/json/day_18_flashcards.json"
    },
    "commands": [
      {
        "cmd": "interface g0/0.10",
        "mode": "Global Config",
        "desc": "Create router subinterface for VLAN 10"
      },
      {
        "cmd": "encapsulation dot1Q 10",
        "mode": "Subinterface",
        "desc": "Enable 802.1Q tagging for VLAN 10"
      },
      {
        "cmd": "ip address 192.168.10.1 255.255.255.0",
        "mode": "Subinterface",
        "desc": "Assign gateway IP for VLAN 10"
      },
      {
        "cmd": "interface g0/0.20",
        "mode": "Global Config",
        "desc": "Create router subinterface for VLAN 20"
      },
      {
        "cmd": "encapsulation dot1Q 20",
        "mode": "Subinterface",
        "desc": "Enable 802.1Q tagging for VLAN 20"
      },
      {
        "cmd": "ip address 192.168.20.1 255.255.255.0",
        "mode": "Subinterface",
        "desc": "Assign gateway IP for VLAN 20"
      },
      {
        "cmd": "interface g0/0",
        "mode": "Global Config",
        "desc": "Enter physical interface"
      },
      {
        "cmd": "no shutdown",
        "mode": "Interface",
        "desc": "Bring up physical interface"
      }
    ]
  },
  {
    "day": 19,
    "topic": "DTP VTP",
    "videos": [
      "035_Day_19_Lecture_DTP_VTP.mp4",
      "036_Day_19_Lab_DTP_VTP.mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_19_Lab_-_DTP_&_VTP.pkt",
      "path": "/media/labs/Day_19_Lab_-_DTP_&_VTP.pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 44,
      "deck_url": "/media/flashcards/json/day_19_flashcards.json"
    },
    "commands": [
      {
        "cmd": "switchport nonegotiate",
        "mode": "Interface",
        "desc": "Disable Dynamic Trunking Protocol (DTP)"
      },
      {
        "cmd": "vtp domain CCNA_LAB",
        "mode": "Global Config",
        "desc": "Set VTP domain name"
      },
      {
        "cmd": "vtp mode transparent",
        "mode": "Global Config",
        "desc": "Set VTP mode to transparent (recommended)"
      },
      {
        "cmd": "show vtp status",
        "mode": "Priv Exec",
        "desc": "Display VTP domain, version, and mode"
      }
    ]
  },
  {
    "day": 20,
    "topic": "Spanning Tree Protocol (Part 1)",
    "videos": [
      "037_Day_20_Part_1_Spanning Tree Protocol (Part 1).mp4",
      "038_Day_20_Lab_Analyzing STP.mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_20_Lab_-_Analyzing_STP.pkt",
      "path": "/media/labs/Day_20_Lab_-_Analyzing_STP.pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 36,
      "deck_url": "/media/flashcards/json/day_20_flashcards.json"
    },
    "commands": [
      {
        "cmd": "spanning-tree vlan 1 root primary",
        "mode": "Global Config",
        "desc": "Set switch as STP root bridge for VLAN 1"
      },
      {
        "cmd": "spanning-tree vlan 1 priority 4096",
        "mode": "Global Config",
        "desc": "Manually set STP bridge priority (multiples of 4096)"
      },
      {
        "cmd": "show spanning-tree",
        "mode": "Priv Exec",
        "desc": "Display STP topology, root ID, and port roles"
      }
    ]
  },
  {
    "day": 21,
    "topic": "PortFast (STP Toolkit)",
    "videos": [
      "039_Day_21_Part_1_PortFast (STP Toolkit).mp4",
      "040_Day_21_Part_2_BPDU Guard _ BPDU Filter (STP Toolkit).mp4",
      "041_Day_21_Part_2_Spanning Tree Protocol (Part 2).mp4",
      "042_Day_21_Part_3_Root Guard (STP Toolkit).mp4",
      "043_Day_21_Part_4_Loop Guard (STP Toolkit).mp4",
      "044_Day_21_Lab_Configuring STP (PVST ).mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_21_Lab_-_Configuring_Spanning_Tree.pkt",
      "path": "/media/labs/Day_21_Lab_-_Configuring_Spanning_Tree.pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 88,
      "deck_url": "/media/flashcards/json/day_21_flashcards.json"
    },
    "commands": [
      {
        "cmd": "interface range g0/1 - 10",
        "mode": "Global Config",
        "desc": "Select edge access ports"
      },
      {
        "cmd": "spanning-tree portfast",
        "mode": "Interface",
        "desc": "Bypass listening/learning states on edge ports"
      },
      {
        "cmd": "spanning-tree bpduguard enable",
        "mode": "Interface",
        "desc": "Shut down port if unexpected BPDU is received"
      },
      {
        "cmd": "show spanning-tree summary",
        "mode": "Priv Exec",
        "desc": "View PortFast and BPDU Guard global state"
      }
    ]
  },
  {
    "day": 22,
    "topic": "Rapid Spanning Tree Protocol",
    "videos": [
      "045_Day_22_Lecture_Rapid Spanning Tree Protocol.mp4",
      "046_Day_22_Lab_Rapid STP.mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_22_Lab_-_Rapid_STP.pkt",
      "path": "/media/labs/Day_22_Lab_-_Rapid_STP.pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 39,
      "deck_url": "/media/flashcards/json/day_22_flashcards.json"
    },
    "commands": [
      {
        "cmd": "spanning-tree mode rapid-pvst",
        "mode": "Global Config",
        "desc": "Enable 802.1w Rapid Spanning Tree Protocol"
      },
      {
        "cmd": "show spanning-tree vlan 1",
        "mode": "Priv Exec",
        "desc": "Verify Rapid-PVST port roles and states"
      }
    ]
  },
  {
    "day": 23,
    "topic": "EtherChannel",
    "videos": [
      "047_Day_23_Lecture_EtherChannel.mp4",
      "048_Day_23_Lab_Configuring EtherChannel.mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_23_Lab_-_EtherChannel.pkt",
      "path": "/media/labs/Day_23_Lab_-_EtherChannel.pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 18,
      "deck_url": "/media/flashcards/json/day_23_flashcards.json"
    },
    "commands": [
      {
        "cmd": "interface range g0/1 - 2",
        "mode": "Global Config",
        "desc": "Select bundled physical ports"
      },
      {
        "cmd": "channel-group 1 mode active",
        "mode": "Interface",
        "desc": "Enable LACP EtherChannel (Active mode)"
      },
      {
        "cmd": "interface port-channel 1",
        "mode": "Global Config",
        "desc": "Configure logical EtherChannel interface"
      },
      {
        "cmd": "switchport mode trunk",
        "mode": "Port-Channel",
        "desc": "Apply trunking across EtherChannel bundle"
      },
      {
        "cmd": "show etherchannel summary",
        "mode": "Priv Exec",
        "desc": "Verify bundled interfaces (look for (P) in bundle)"
      }
    ]
  },
  {
    "day": 24,
    "topic": "Dynamic Routing",
    "videos": [
      "049_Day_24_Lecture_Dynamic Routing.mp4",
      "050_Day_24_Lab_Floating Static Routes.mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_24_Lab_-_Floating_Static_Routes.pkt",
      "path": "/media/labs/Day_24_Lab_-_Floating_Static_Routes.pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 51,
      "deck_url": "/media/flashcards/json/day_24_flashcards.json"
    },
    "commands": []
  },
  {
    "day": 25,
    "topic": "RIP   EIGRP",
    "videos": [
      "051_Day_25_Lecture_RIP _ EIGRP.mp4",
      "052_Day_25_Lab_Configuring EIGRP.mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_25_Lab_-_EIGRP_Configuration.pkt",
      "path": "/media/labs/Day_25_Lab_-_EIGRP_Configuration.pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 43,
      "deck_url": "/media/flashcards/json/day_25_flashcards.json"
    },
    "commands": []
  },
  {
    "day": 26,
    "topic": "OSPF Part 1",
    "videos": [
      "053_Day_26_Part_1_OSPF Part 1.mp4",
      "054_Day_26_Lab_Configuring OSPF (1).mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_26_Lab_-_OSPF_(Part_1).pkt",
      "path": "/media/labs/Day_26_Lab_-_OSPF_(Part_1).pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 34,
      "deck_url": "/media/flashcards/json/day_26_flashcards.json"
    },
    "commands": [
      {
        "cmd": "router ospf 1",
        "mode": "Global Config",
        "desc": "Enable OSPF routing process 1"
      },
      {
        "cmd": "router-id 1.1.1.1",
        "mode": "OSPF Config",
        "desc": "Manually configure OSPF Router ID"
      },
      {
        "cmd": "network 192.168.1.0 0.0.0.255 area 0",
        "mode": "OSPF Config",
        "desc": "Advertise network in OSPF backbone Area 0"
      },
      {
        "cmd": "show ip ospf neighbor",
        "mode": "Priv Exec",
        "desc": "Display OSPF neighbor states (Full/DR/BDR)"
      }
    ]
  },
  {
    "day": 27,
    "topic": "OSPF Part 2",
    "videos": [
      "055_Day_27_Part_2_OSPF Part 2.mp4",
      "056_Day_27_Lab_Configuring OSPF (2).mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_27_Lab_-_OSPF_(Part_2).pkt",
      "path": "/media/labs/Day_27_Lab_-_OSPF_(Part_2).pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 47,
      "deck_url": "/media/flashcards/json/day_27_flashcards.json"
    },
    "commands": [
      {
        "cmd": "passive-interface default",
        "mode": "OSPF Config",
        "desc": "Make all interfaces passive by default"
      },
      {
        "cmd": "no passive-interface g0/0",
        "mode": "OSPF Config",
        "desc": "Allow OSPF hellos only on link to neighbor"
      },
      {
        "cmd": "auto-cost reference-bandwidth 1000",
        "mode": "OSPF Config",
        "desc": "Set OSPF reference bandwidth to 1 Gbps (1000 Mbps)"
      },
      {
        "cmd": "show ip ospf interface brief",
        "mode": "Priv Exec",
        "desc": "Display OSPF cost and interface state"
      }
    ]
  },
  {
    "day": 28,
    "topic": "OSPF Part 3",
    "videos": [
      "057_Day_28_Part_3_OSPF Part 3.mp4",
      "058_Day_28_Lab_Configuring OSPF (3).mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_28_Lab_-_OSPF_(Part_3).pkt",
      "path": "/media/labs/Day_28_Lab_-_OSPF_(Part_3).pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 40,
      "deck_url": "/media/flashcards/json/day_28_flashcards.json"
    },
    "commands": []
  },
  {
    "day": 29,
    "topic": "First Hop Redundancy Protocols",
    "videos": [
      "059_Day_29_Lecture_First Hop Redundancy Protocols.mp4",
      "060_Day_29_Lab_Configuring HSRP.mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_29_Lab_-_HSRP_Configuration.pkt",
      "path": "/media/labs/Day_29_Lab_-_HSRP_Configuration.pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 36,
      "deck_url": "/media/flashcards/json/day_29_flashcards.json"
    },
    "commands": [
      {
        "cmd": "interface g0/0",
        "mode": "Global Config",
        "desc": "Enter gateway interface"
      },
      {
        "cmd": "standby 1 ip 192.168.1.254",
        "mode": "Interface",
        "desc": "Configure HSRP group 1 virtual IP address"
      },
      {
        "cmd": "standby 1 priority 110",
        "mode": "Interface",
        "desc": "Increase HSRP priority to become Active router"
      },
      {
        "cmd": "standby 1 preempt",
        "mode": "Interface",
        "desc": "Enable preemption to reclaim Active state if rebooted"
      },
      {
        "cmd": "show standby brief",
        "mode": "Priv Exec",
        "desc": "Display HSRP group, virtual IP, and Active/Standby status"
      }
    ]
  },
  {
    "day": 30,
    "topic": "TCP   UDP",
    "videos": [
      "061_Day_30_Lecture_TCP _ UDP.mp4",
      "062_Day_30_Lab_Wireshark Demo (TCP_UDP).mp4"
    ],
    "lab": {
      "has_lab": false,
      "pkt_file": null,
      "path": null
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 67,
      "deck_url": "/media/flashcards/json/day_30_flashcards.json"
    },
    "commands": []
  },
  {
    "day": 31,
    "topic": "IPv6 Part 1",
    "videos": [
      "063_Day_31_Part_1_IPv6 Part 1.mp4",
      "064_Day_31_Lab_Configuring IPv6 (Part 1).mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_31_Lab_-_IPv6_Configuration_(Part_1).pkt",
      "path": "/media/labs/Day_31_Lab_-_IPv6_Configuration_(Part_1).pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 13,
      "deck_url": "/media/flashcards/json/day_31_flashcards.json"
    },
    "commands": []
  },
  {
    "day": 32,
    "topic": "IPv6 Part 2",
    "videos": [
      "065_Day_32_Part_2_IPv6 Part 2.mp4",
      "066_Day_32_Lab_2_Configuring IPv6 (Part 2).mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_32_Lab_-_IPv6_Configuration_(Part_2).pkt",
      "path": "/media/labs/Day_32_Lab_-_IPv6_Configuration_(Part_2).pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 75,
      "deck_url": "/media/flashcards/json/day_32_flashcards.json"
    },
    "commands": []
  },
  {
    "day": 33,
    "topic": "IPv6 Part 3",
    "videos": [
      "067_Day_33_Part_3_IPv6 Part 3.mp4",
      "068_Day_33_Lab_3_Configuring IPv6 (Part 3).mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_33_Lab_-_IPv6_Static_Routes.pkt",
      "path": "/media/labs/Day_33_Lab_-_IPv6_Static_Routes.pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 45,
      "deck_url": "/media/flashcards/json/day_33_flashcards.json"
    },
    "commands": []
  },
  {
    "day": 34,
    "topic": "Standard ACLs",
    "videos": [
      "069_Day_34_Lecture_Standard ACLs.mp4",
      "070_Day_34_Lab_Standard ACLs.mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_34_Lab_-_Standard_ACLs.pkt",
      "path": "/media/labs/Day_34_Lab_-_Standard_ACLs.pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 22,
      "deck_url": "/media/flashcards/json/day_34_flashcards.json"
    },
    "commands": [
      {
        "cmd": "access-list 1 permit 192.168.1.0 0.0.0.255",
        "mode": "Global Config",
        "desc": "Standard ACL: Permit traffic from 192.168.1.0/24"
      },
      {
        "cmd": "interface g0/0",
        "mode": "Global Config",
        "desc": "Select target interface"
      },
      {
        "cmd": "ip access-group 1 in",
        "mode": "Interface",
        "desc": "Apply ACL 1 to inbound traffic on interface"
      },
      {
        "cmd": "show access-lists",
        "mode": "Priv Exec",
        "desc": "Display configured ACLs and match counters"
      }
    ]
  },
  {
    "day": 35,
    "topic": "Extended ACLs",
    "videos": [
      "071_Day_35_Lecture_Extended ACLs.mp4",
      "072_Day_35_Lab_Extended ACLs.mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_35_Lab_-_Extended_ACLs.pkt",
      "path": "/media/labs/Day_35_Lab_-_Extended_ACLs.pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 26,
      "deck_url": "/media/flashcards/json/day_35_flashcards.json"
    },
    "commands": [
      {
        "cmd": "ip access-list extended BLOCK_SSH",
        "mode": "Global Config",
        "desc": "Create named extended ACL"
      },
      {
        "cmd": "deny tcp 192.168.1.0 0.0.0.255 host 10.0.0.1 eq 22",
        "mode": "Extended ACL",
        "desc": "Deny SSH traffic to server"
      },
      {
        "cmd": "permit ip any any",
        "mode": "Extended ACL",
        "desc": "Permit all other IP traffic"
      },
      {
        "cmd": "interface g0/0",
        "mode": "Global Config",
        "desc": "Enter interface"
      },
      {
        "cmd": "ip access-group BLOCK_SSH in",
        "mode": "Interface",
        "desc": "Apply extended ACL to inbound interface"
      }
    ]
  },
  {
    "day": 36,
    "topic": "CDP   LLDP",
    "videos": [
      "073_Day_36_Lecture_CDP _ LLDP.mp4",
      "074_Day_36_Lab_CDP _ LLDP.mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_36_Lab_-_CDP_&_LLDP.pkt",
      "path": "/media/labs/Day_36_Lab_-_CDP_&_LLDP.pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 40,
      "deck_url": "/media/flashcards/json/day_36_flashcards.json"
    },
    "commands": []
  },
  {
    "day": 37,
    "topic": "NTP",
    "videos": [
      "075_Day_37_Lecture_NTP.mp4",
      "076_Day_37_Lab_NTP.mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_37_Lab_-_NTP.pkt",
      "path": "/media/labs/Day_37_Lab_-_NTP.pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 39,
      "deck_url": "/media/flashcards/json/day_37_flashcards.json"
    },
    "commands": []
  },
  {
    "day": 38,
    "topic": "DNS",
    "videos": [
      "077_Day_38_Lecture_DNS.mp4",
      "078_Day_38_Lab_DNS.mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_38_Lab_-_DNS.pkt",
      "path": "/media/labs/Day_38_Lab_-_DNS.pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 20,
      "deck_url": "/media/flashcards/json/day_38_flashcards.json"
    },
    "commands": []
  },
  {
    "day": 39,
    "topic": "DHCP",
    "videos": [
      "079_Day_39_Lecture_DHCP.mp4",
      "080_Day_39_Lab_DHCP.mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_39_Lab_-_DHCP.pkt",
      "path": "/media/labs/Day_39_Lab_-_DHCP.pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 26,
      "deck_url": "/media/flashcards/json/day_39_flashcards.json"
    },
    "commands": [
      {
        "cmd": "ip dhcp excluded-address 192.168.1.1 192.168.1.10",
        "mode": "Global Config",
        "desc": "Exclude static addresses from DHCP pool"
      },
      {
        "cmd": "ip dhcp pool LAN_POOL",
        "mode": "Global Config",
        "desc": "Create DHCP address pool"
      },
      {
        "cmd": "network 192.168.1.0 255.255.255.0",
        "mode": "DHCP Config",
        "desc": "Define subnet to allocate"
      },
      {
        "cmd": "default-router 192.168.1.1",
        "mode": "DHCP Config",
        "desc": "Specify Default Gateway for clients"
      },
      {
        "cmd": "dns-server 8.8.8.8 8.8.4.4",
        "mode": "DHCP Config",
        "desc": "Specify DNS servers for clients"
      },
      {
        "cmd": "show ip dhcp binding",
        "mode": "Priv Exec",
        "desc": "List active leases and assigned client MACs"
      }
    ]
  },
  {
    "day": 40,
    "topic": "SNMP",
    "videos": [
      "081_Day_40_Lecture_SNMP.mp4",
      "082_Day_40_Lab_SNMP.mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_40_Lab_-_SNMP.pkt",
      "path": "/media/labs/Day_40_Lab_-_SNMP.pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 33,
      "deck_url": "/media/flashcards/json/day_40_flashcards.json"
    },
    "commands": []
  },
  {
    "day": 41,
    "topic": "Syslog",
    "videos": [
      "083_Day_41_Lecture_Syslog.mp4",
      "084_Day_41_Lab_Syslog.mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_41_Lab_-_Syslog.pkt",
      "path": "/media/labs/Day_41_Lab_-_Syslog.pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 40,
      "deck_url": "/media/flashcards/json/day_41_flashcards.json"
    },
    "commands": []
  },
  {
    "day": 42,
    "topic": "SSH",
    "videos": [
      "085_Day_42_Lecture_SSH.mp4",
      "086_Day_42_Lab_SSH.mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_42_Lab_-_SSH.pkt",
      "path": "/media/labs/Day_42_Lab_-_SSH.pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 28,
      "deck_url": "/media/flashcards/json/day_42_flashcards.json"
    },
    "commands": [
      {
        "cmd": "ip domain-name lab.local",
        "mode": "Global Config",
        "desc": "Set domain name required for RSA key generation"
      },
      {
        "cmd": "crypto key generate rsa modulus 2048",
        "mode": "Global Config",
        "desc": "Generate 2048-bit RSA encryption keys"
      },
      {
        "cmd": "ip ssh version 2",
        "mode": "Global Config",
        "desc": "Enforce secure SSH Version 2 only"
      },
      {
        "cmd": "username admin privilege 15 secret AdminPass123",
        "mode": "Global Config",
        "desc": "Create local admin user account"
      },
      {
        "cmd": "line vty 0 4",
        "mode": "Global Config",
        "desc": "Enter Virtual Terminal lines"
      },
      {
        "cmd": "transport input ssh",
        "mode": "Line Config",
        "desc": "Restrict VTY access to SSH only (blocks Telnet)"
      },
      {
        "cmd": "login local",
        "mode": "Line Config",
        "desc": "Authenticate using local username database"
      }
    ]
  },
  {
    "day": 43,
    "topic": "FTP   TFTP",
    "videos": [
      "087_Day_43_Lecture_FTP _ TFTP.mp4",
      "088_Day_43_Lab_FTP _ TFTP.mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_43_Lab_-_FTP_&_TFTP.pkt",
      "path": "/media/labs/Day_43_Lab_-_FTP_&_TFTP.pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 36,
      "deck_url": "/media/flashcards/json/day_43_flashcards.json"
    },
    "commands": []
  },
  {
    "day": 44,
    "topic": "NAT (Part 1)",
    "videos": [
      "089_Day_44_Part_1_NAT (Part 1).mp4",
      "090_Day_44_Lab_Static NAT.mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_44_Lab_-_Static_NAT.pkt",
      "path": "/media/labs/Day_44_Lab_-_Static_NAT.pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 19,
      "deck_url": "/media/flashcards/json/day_44_flashcards.json"
    },
    "commands": [
      {
        "cmd": "interface g0/0",
        "mode": "Global Config",
        "desc": "Select LAN interface"
      },
      {
        "cmd": "ip nat inside",
        "mode": "Interface",
        "desc": "Designate interface as NAT inside"
      },
      {
        "cmd": "interface g0/1",
        "mode": "Global Config",
        "desc": "Select WAN interface"
      },
      {
        "cmd": "ip nat outside",
        "mode": "Interface",
        "desc": "Designate interface as NAT outside"
      },
      {
        "cmd": "ip nat inside source static 192.168.1.10 203.0.113.10",
        "mode": "Global Config",
        "desc": "Configure 1-to-1 Static NAT translation"
      },
      {
        "cmd": "show ip nat translations",
        "mode": "Priv Exec",
        "desc": "Display active NAT translations"
      }
    ]
  },
  {
    "day": 45,
    "topic": "NAT (part 2)",
    "videos": [
      "091_Day_45_Part_2_NAT (part 2).mp4",
      "092_Day_45_Lab_Dynamic NAT.mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_45_Lab_-_Dynamic_NAT.pkt",
      "path": "/media/labs/Day_45_Lab_-_Dynamic_NAT.pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 14,
      "deck_url": "/media/flashcards/json/day_45_flashcards.json"
    },
    "commands": [
      {
        "cmd": "access-list 1 permit 192.168.1.0 0.0.0.255",
        "mode": "Global Config",
        "desc": "Define ACL matching internal hosts"
      },
      {
        "cmd": "ip nat inside source list 1 interface g0/1 overload",
        "mode": "Global Config",
        "desc": "Configure PAT (Port Address Translation / NAT Overload)"
      },
      {
        "cmd": "show ip nat statistics",
        "mode": "Priv Exec",
        "desc": "Display NAT hit counters and active bindings"
      }
    ]
  },
  {
    "day": 46,
    "topic": "QoS (Part 1)",
    "videos": [
      "093_Day_46_Part_1_QoS (Part 1).mp4",
      "094_Day_46_Lab_Voice VLANs.mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_46_Lab_-_Voice_VLANs.pkt",
      "path": "/media/labs/Day_46_Lab_-_Voice_VLANs.pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 41,
      "deck_url": "/media/flashcards/json/day_46_flashcards.json"
    },
    "commands": []
  },
  {
    "day": 47,
    "topic": "QoS (Part 2)",
    "videos": [
      "095_Day_47_Part_2_QoS (Part 2).mp4",
      "096_Day_47_Lab_QoS.mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_47_Lab_-_QoS.pkt",
      "path": "/media/labs/Day_47_Lab_-_QoS.pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 55,
      "deck_url": "/media/flashcards/json/day_47_flashcards.json"
    },
    "commands": []
  },
  {
    "day": 48,
    "topic": "Security Fundamentals",
    "videos": [
      "097_Day_48_Lecture_Security Fundamentals.mp4",
      "098_Day_48_Lab_Kali Linux Demo.mp4"
    ],
    "lab": {
      "has_lab": false,
      "pkt_file": null,
      "path": null
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 54,
      "deck_url": "/media/flashcards/json/day_48_flashcards.json"
    },
    "commands": []
  },
  {
    "day": 49,
    "topic": "Port Security",
    "videos": [
      "099_Day_49_Lecture_Port Security.mp4",
      "100_Day_49_Lab_Port Security.mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_49_Lab_-_Port_Security.pkt",
      "path": "/media/labs/Day_49_Lab_-_Port_Security.pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 34,
      "deck_url": "/media/flashcards/json/day_49_flashcards.json"
    },
    "commands": [
      {
        "cmd": "interface g0/1",
        "mode": "Global Config",
        "desc": "Select access switchport"
      },
      {
        "cmd": "switchport mode access",
        "mode": "Interface",
        "desc": "Force access mode"
      },
      {
        "cmd": "switchport port-security",
        "mode": "Interface",
        "desc": "Enable Port Security on interface"
      },
      {
        "cmd": "switchport port-security maximum 2",
        "mode": "Interface",
        "desc": "Allow maximum of 2 learned MAC addresses"
      },
      {
        "cmd": "switchport port-security mac-address sticky",
        "mode": "Interface",
        "desc": "Dynamically learn and save MAC to running-config"
      },
      {
        "cmd": "switchport port-security violation shutdown",
        "mode": "Interface",
        "desc": "Shut down port on violation (err-disable)"
      },
      {
        "cmd": "show port-security interface g0/1",
        "mode": "Priv Exec",
        "desc": "Display port security status and counters"
      }
    ]
  },
  {
    "day": 50,
    "topic": "DHCP Snooping",
    "videos": [
      "101_Day_50_Lecture_DHCP Snooping.mp4",
      "102_Day_50_Lab_DHCP Snooping.mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_50_Lab_-_DHCP_Snooping.pkt",
      "path": "/media/labs/Day_50_Lab_-_DHCP_Snooping.pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 21,
      "deck_url": "/media/flashcards/json/day_50_flashcards.json"
    },
    "commands": [
      {
        "cmd": "ip dhcp snooping",
        "mode": "Global Config",
        "desc": "Enable DHCP Snooping globally on switch"
      },
      {
        "cmd": "ip dhcp snooping vlan 10,20",
        "mode": "Global Config",
        "desc": "Enable snooping on specific VLANs"
      },
      {
        "cmd": "interface g0/24",
        "mode": "Global Config",
        "desc": "Select uplink port to legitimate DHCP server"
      },
      {
        "cmd": "ip dhcp snooping trust",
        "mode": "Interface",
        "desc": "Configure port as trusted DHCP source"
      },
      {
        "cmd": "show ip dhcp snooping binding",
        "mode": "Priv Exec",
        "desc": "Display learned IP-to-MAC DHCP bindings table"
      }
    ]
  },
  {
    "day": 51,
    "topic": "Dynamic ARP Inspection",
    "videos": [
      "103_Day_51_Lecture_Dynamic ARP Inspection.mp4",
      "104_Day_51_Lab_Dynamic ARP Inspection.mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_51_Lab_-_Dynamic_ARP_Inspection.pkt",
      "path": "/media/labs/Day_51_Lab_-_Dynamic_ARP_Inspection.pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 17,
      "deck_url": "/media/flashcards/json/day_51_flashcards.json"
    },
    "commands": [
      {
        "cmd": "ip arp inspection vlan 10",
        "mode": "Global Config",
        "desc": "Enable Dynamic ARP Inspection (DAI) on VLAN 10"
      },
      {
        "cmd": "interface g0/24",
        "mode": "Global Config",
        "desc": "Select uplink trunk interface"
      },
      {
        "cmd": "ip arp inspection trust",
        "mode": "Interface",
        "desc": "Configure interface as trusted for ARP replies"
      },
      {
        "cmd": "show ip arp inspection",
        "mode": "Priv Exec",
        "desc": "Display DAI statistics and dropped packet counts"
      }
    ]
  },
  {
    "day": 52,
    "topic": "LAN Architectures",
    "videos": [
      "105_Day_52_Lecture_LAN Architectures.mp4",
      "106_Day_52_Lab_STP _ FHRP Synchronization.mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_52_Lab_-_STP_&_HSRP_Synchronization.pkt",
      "path": "/media/labs/Day_52_Lab_-_STP_&_HSRP_Synchronization.pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 21,
      "deck_url": "/media/flashcards/json/day_52_flashcards.json"
    },
    "commands": []
  },
  {
    "day": 53,
    "topic": "WAN Architectures",
    "videos": [
      "107_Day_53_Lecture_WAN Architectures.mp4",
      "108_Day_53_Lab_GRE Tunnels.mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_53_Lab_-_GRE_Tunnels.pkt",
      "path": "/media/labs/Day_53_Lab_-_GRE_Tunnels.pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 37,
      "deck_url": "/media/flashcards/json/day_53_flashcards.json"
    },
    "commands": []
  },
  {
    "day": 54,
    "topic": "Virtualization   Cloud",
    "videos": [
      "109_Day_54_Part_1_Virtualization _ Cloud.mp4",
      "110_Day_54_Part_2_Containers.mp4",
      "111_Day_54_Part_3_VRF.mp4",
      "112_Day_54_Lab_Oracle VirtualBox.mp4"
    ],
    "lab": {
      "has_lab": false,
      "pkt_file": null,
      "path": null
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 54,
      "deck_url": "/media/flashcards/json/day_54_flashcards.json"
    },
    "commands": []
  },
  {
    "day": 55,
    "topic": "Wireless Fundamentals",
    "videos": [
      "113_Day_55_Lecture_Wireless Fundamentals.mp4"
    ],
    "lab": {
      "has_lab": false,
      "pkt_file": null,
      "path": null
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 69,
      "deck_url": "/media/flashcards/json/day_55_flashcards.json"
    },
    "commands": []
  },
  {
    "day": 56,
    "topic": "Wireless Architectures",
    "videos": [
      "114_Day_56_Lecture_Wireless Architectures.mp4"
    ],
    "lab": {
      "has_lab": false,
      "pkt_file": null,
      "path": null
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 57,
      "deck_url": "/media/flashcards/json/day_56_flashcards.json"
    },
    "commands": []
  },
  {
    "day": 57,
    "topic": "Wireless Security",
    "videos": [
      "115_Day_57_Lecture_Wireless Security.mp4"
    ],
    "lab": {
      "has_lab": false,
      "pkt_file": null,
      "path": null
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 43,
      "deck_url": "/media/flashcards/json/day_57_flashcards.json"
    },
    "commands": []
  },
  {
    "day": 58,
    "topic": "Wireless Configuration",
    "videos": [
      "116_Day_58_Lecture_Wireless Configuration.mp4",
      "117_Day_58_Lab_Wireless LANs.mp4"
    ],
    "lab": {
      "has_lab": true,
      "pkt_file": "Day_58_Lab_-_Wireless_LANs.pkt",
      "path": "/media/labs/Day_58_Lab_-_Wireless_LANs.pkt"
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 34,
      "deck_url": "/media/flashcards/json/day_58_flashcards.json"
    },
    "commands": []
  },
  {
    "day": 59,
    "topic": "Intro to Network Automation",
    "videos": [
      "118_Day_59_Part_1_Intro to Network Automation.mp4",
      "119_Day_59_Part_2_AI _ Machine Learning.mp4"
    ],
    "lab": {
      "has_lab": false,
      "pkt_file": null,
      "path": null
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 38,
      "deck_url": "/media/flashcards/json/day_59_flashcards.json"
    },
    "commands": []
  },
  {
    "day": 60,
    "topic": "JSON  XML    YAML",
    "videos": [
      "120_Day_60_Lecture_JSON_ XML_ _ YAML.mp4"
    ],
    "lab": {
      "has_lab": false,
      "pkt_file": null,
      "path": null
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 26,
      "deck_url": "/media/flashcards/json/day_60_flashcards.json"
    },
    "commands": []
  },
  {
    "day": 61,
    "topic": "REST APIs",
    "videos": [
      "121_Day_61_Lecture_REST APIs.mp4",
      "122_Day_61_Part_2_REST API Authentication.mp4"
    ],
    "lab": {
      "has_lab": false,
      "pkt_file": null,
      "path": null
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 50,
      "deck_url": "/media/flashcards/json/day_61_flashcards.json"
    },
    "commands": []
  },
  {
    "day": 62,
    "topic": "Software-Defined Networking",
    "videos": [
      "123_Day_62_Lecture_Software-Defined Networking.mp4"
    ],
    "lab": {
      "has_lab": false,
      "pkt_file": null,
      "path": null
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 19,
      "deck_url": "/media/flashcards/json/day_62_flashcards.json"
    },
    "commands": []
  },
  {
    "day": 63,
    "topic": "Ansible  Puppet    Chef",
    "videos": [
      "124_Day_63_Part_1_Ansible_ Puppet_ _ Chef.mp4",
      "125_Day_63_Part_2_Terraform.mp4"
    ],
    "lab": {
      "has_lab": false,
      "pkt_file": null,
      "path": null
    },
    "flashcards": {
      "has_cards": true,
      "card_count": 54,
      "deck_url": "/media/flashcards/json/day_63_flashcards.json"
    },
    "commands": []
  }
];
