import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon } from "lucide-react";

export const DATA = {
  name: "Sami Sheikh",
  initials: "S.S",
  url: "https://samiis.cool",
  location: "AUS, Sydney",
  locationLink: "https://www.google.com/maps/place/wollongong",
  description:
    "Cyber Security Specialist and Entrepreneur. I love building things and helping people.",
  summary:
    "I am a final year computer science student at [UOW specialising in Cyber Security and Digital Systems Security](/#education). I am also a co-founder of [MailShield AI](https://mailshield.ai).",
  avatarUrl: "/pfp.webp",
  skills: [
    "React",
    "Next.js",
    "Typescript",
    "Node.js",
    "Python",
    "Go",
    "SurrealDB",
    "Docker",
    "Kubernetes",
    "Java",
    "C++",
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/blog", icon: NotebookIcon, label: "Blog" },
  ],
  contact: {
    email: "samisheikh450@gmail.com",
    tel: "+61492918553",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/SamTheMan6978/my-personal-online-portfolio",
        icon: Icons.github,

        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/sami-sheikh-2b00931a6/",
        icon: Icons.linkedin,

        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "mailto:samisheikh450@gmail.com",
        icon: Icons.email,

        navbar: false,
      },
    },
  },

  work: [
    {
      company: "MailShield AI",
      href: "https://www.mailshield.ai/",
      badges: [],
      location: "Sydney, NSW",
      title: "Chief Information Security Officer",
      logoUrl: "/MailShield.svg",
      start: "Jun 2024",
      end: "Present",
      description:
        "Oversaw security strategy and governance for MailShield AI's advanced email threat protection (phishing, malware, BEC). Ensured GDPR, HIPAA, and SOC 2 compliance, led real-time threat detection for millions of emails, and championed ongoing AI/ML enhancements.",
    },
    {
      company: "Eager Trading LLC",
      href: "",
      badges: [],
      location: "Dubai, UAE",
      title: "IT Systems Administrator",
      logoUrl: "/eagertrading.jpeg",
      start: "Jun 2022",
      end: "Jul 2023",
      description:
        "Implemented enterprise-grade data encryption and access control protocols, reducing unauthorized access by 25%. Developed a comprehensive incident response plan that improved recovery time by 40% and maintained over 99% network uptime through proactive monitoring and system maintenance.",
    },
    {
      company: "Eager Building Contracting LLC",
      href: "",
      badges: [],
      location: "Dubai, UAE",
      title: "Network and Security Administrator",
      logoUrl: "/eagerbuilding.jpeg",
      start: "Jun 2021",
      end: "Jun 2022",
      description:
        "Configured firewall rules and VPN access policies to secure LAN/WAN infrastructure. Resolved network and hardware issues, applied regular security patches, and supported internal teams with basic troubleshooting and cybersecurity best practices.",
    },
  ],
  education: [
    {
      school: "University of Wollongong",
      href: "https://www.uow.edu.au/",
      degree: "Bachelor of Computer Science - Cyber Security and Digital Systems Security",
      logoUrl: "/uow.png",
      start: "2022",
      end: "2023",
    },
    {
      school: "University of Wollongong - Dubai",
      href: "https://www.uowdubai.ac.ae/",
      degree: "Bachelor of Computer Science - Cyber Security",
      logoUrl: "/uowd.png",
      start: "2021",
      end: "2023",
    },
    {
      school: "Winchester School, Jebel Ali",
      href: "https://www.thewinchesterschool.com/",
      degree: "IGCSE, AS, A levels and BTEC Business",
      logoUrl: "/win.svg",
      start: "2012",
      end: "2016",
    },
  ],
  projects: [
    {
      title: "Secure Communication App",
      href: "https://github.com/SamTheMan6978/Secure-Communication-Protocol-App",
      dates: "August 2024",
      active: true,
      description:
        "Developed a secure communication protocol between two parties: Alice and Bob using UDP in C++.",
      technologies: [
        "C++",
      ],
      links: [
        {
          type: "Website",
          href: "https://github.com/SamTheMan6978/Secure-Communication-Protocol-App",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "",
      video:
        "",
    },
    {
      title: "Gym Website",
      href: "https://github.com/SamTheMan6978/CSIT128-Website",
      dates: "June 2023",
      active: true,
      description:
        "Developed a gym website using HTML, CSS, and JavaScript as part of a group project for CSIT128.",
      technologies: [
        "CSS",
        "HTML",
        "JavaScript",
        "node.js",
      ],
      links: [
        {
          type: "Website",
          href: "https://github.com/SamTheMan6978/CSIT128-Website",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "",
      video:
        "",
    },
    {
      title: "File System with Authentication and Access Control Model",
      href: "https://github.com/SamTheMan6978/CSCI262---File-System-with-Authentication-and-Access-Control-Model",
      dates: "November 2024",
      active: true,
      description:
        "Implemented a secure file system with user authentication, access control and file operations. Utilised Bell-LaPadula model for access control to ensure data confidentaility based on user clearance levels.",
      technologies: [
        "C++",
        "Linux",
        "Unix",
      ],
      links: [
        {
          type: "Website",
          href: "https://github.com/SamTheMan6978/CSCI262---File-System-with-Authentication-and-Access-Control-Model",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "",
      video:
        "",
    },
  ],
  hackathons: [
    {
      title: "Portal Hackathon",
      dates: "October 29, 2016",
      location: "Kingston, Ontario",
      description:
        "Developed an internal widget for uploading assignments using Waterloo's portal app",
      image:
        "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/portal-hackathon.png",
      links: [
        {
          title: "Source",
          icon: <Icons.github className="h-4 w-4" />,
          href: "https://github.com/UWPortalSDK/crowmark",
        },
      ],
    },
  ],
} as const;
