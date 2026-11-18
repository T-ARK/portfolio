export const personalInfo = {
  name: "ARSHID CHANDRAN",
  fullName: "Arshid Chandran P K",
  glitchSuffix: "P K_",
  tagline: "Studying Computer Science with a focus on Data Science.",
  bio: [
    "Hi there! I’m Arshid Chandran P K, currently studying Computer Science with a focus on Data Science at St. Thomas College of Engineering & Technology in Kannur.",
    "I got my feet wet in coding with C++ and Java before the web caught my eye. These days I love putting together simple, responsive sites with HTML and CSS and poking around to see how browsers turn my ideas into living pages.",
    "My approach is all about building a solid foundation — clean, readable code, logical thinking — and then letting curiosity lead me toward newer web tools and frameworks."
  ],
  heroDesc: "Hi — I’m studying Computer Science with a focus on Data Science. I enjoy learning by building simple, responsive websites and small programs in C++, Java, and Python.",
  role: "Data Science Student",
  status: "SYSTEM ONLINE // AVAILABLE",
  personnelId: "Personnel ID // ARK",
  barcode: "00104-ARK-",
  profileImage: "/assets/images/profile.png",
  profileImageWebp: "/assets/images/profile.webp",
  resumeUrl: "/resume.pdf",
  social: {
    github: "https://github.com/T-ARK",
    linkedin: "https://linkedin.com/in/arshid-chandran-p-k-9974b532b",
    email: "arshidarshii12@gmail.com"
  },
  googleScriptUrl: "https://script.google.com/macros/s/AKfycbx4F8H5RevrvZtG0JpPy1zyZW-z5tFTsaaTgNqNpOufocHs2m2jhhsqW-BRMQy3d-uO/exec"
};

export const navLinks = [
  { label: ".about()", href: "#about" },
  { label: ".skills()", href: "#skills" },
  { label: ".projects()", href: "#projects" },
  { label: ".experience()", href: "#experience" },
  { label: ".contact()", href: "#contact" },
];

export const heroMetrics = [
  { label: "CPU_LOAD", value: "18%", percent: 18 },
  { label: "MEM_USAGE", value: "34%", percent: 34 },
  { label: "COMPILING_DS", value: "89%", percent: 89 },
];

export const skillCategories = [
  {
    title: "Core Languages",
    category: "languages",
    count: "[08]",
    skills: ["Python", "Java", "C++", "JavaScript (ES6+)", "Algorithms", "OOP Logic", "Debugging", "Data Structures"]
  },
  {
    title: "Data Science & Analytics",
    category: "datascience",
    count: "[07]",
    skills: ["Pandas", "NumPy", "Matplotlib", "Exploratory Data Analysis (EDA)", "Data Cleaning", "Data Visualization", "Jupyter Notebooks"]
  },
  {
    title: "Web & Frontend",
    category: "frontend",
    count: "[08]",
    skills: ["React 19", "Vite", "HTML5", "CSS3 / Modern Layouts", "Responsive UI", "Micro-Animations", "Wireframing", "Component Architecture"]
  },
  {
    title: "Backend & APIs",
    category: "backend",
    count: "[07]",
    skills: ["Flask", "Flask-CORS", "FastAPI", "RESTful APIs", "API Integration", "JSON Endpoints", "Postman"]
  },
  {
    title: "Databases & ORM",
    category: "databases",
    count: "[07]",
    skills: ["PostgreSQL", "MySQL", "SQLite", "SQLAlchemy", "Schema Migration", "DDL Parsing", "Data Consistency"]
  },
  {
    title: "Tools & Workflow",
    category: "tools",
    count: "[07]",
    skills: ["Git", "GitHub", "VS Code", "Linux Terminal", "Vite / npm", "Netlify Deployment", "Jupyter Lab"]
  }
];

export const projects = [
  {
    id: "project-banking",
    category: "JAVA DEVELOPMENT",
    title: "Smart Banking System",
    description: "A complete banking solution built in Java. Features an interactive interface with object-oriented account records, validation checks for secure transactions, and balance management.",
    features: [
      "Engineered object-oriented account records and methods.",
      "Handles validation checks for secure transaction bounds.",
      "Interactive multi-panel interface for Admin, Staff, and Customers."
    ],
    tags: ["Java", "Java Swing", "OOP Design", "Control Flow"],
    link: "https://github.com/Flash-Code-333/Smart_Banking_System",
    liveLink: null,
    image: "/assets/images/project1.png",
    imageWebp: "/assets/images/project1.webp",
    alt: "Smart Banking System Java GUI project by Arshid Chandran"
  },
  {
    id: "project-login",
    category: "UI DESIGN / INTERACTION",
    title: "Animated Login Page",
    description: "A highly responsive login interface engineered with semantic HTML and custom CSS. Employs micro-interactions, input focus animations, and hover transitions to deliver a premium user entry workflow.",
    features: [
      "Features clean, responsive input layouts.",
      "Implements visual state focus styling and transitions.",
      "Structured with fully validation-ready forms."
    ],
    tags: ["HTML5", "CSS3 Layouts", "Micro-Animations", "Input States"],
    link: "https://github.com/T-ARK/Login-Form-using-CSS",
    liveLink: "https://t-ark.github.io/Login-Form-using-CSS/",
    image: "/assets/images/project2.png",
    imageWebp: "/assets/images/project2.webp",
    alt: "Animated Login Page Web Development project by Arshid Chandran"
  },
  {
    id: "project-migrator",
    category: "PYTHON / DATABASE TOOL",
    title: "SQL Database Migrator",
    description: "A database migration and management platform designed to automate schema and data migration between MySQL and PostgreSQL databases with automated DDL conversion.",
    features: [
      "Translates table structures and key configurations natively.",
      "Parses raw DDL files and pre-processes with pandas mappings.",
      "Handles schema validation logs for complete transfer reports."
    ],
    tags: ["Python", "Flask", "Pandas", "PostgreSQL", "MySQL Dialect"],
    link: "https://github.com/sql-migrator-team/SQL-MIGRATOR",
    liveLink: null,
    image: "/assets/images/project3.png",
    imageWebp: "/assets/images/project3.webp",
    alt: "SQL Database Migrator Python Data Science tool by Arshid Chandran",
    contributorsLabel: "SQL MIGRATOR TEAM // CONTRIBUTORS:",
    contributors: [
      {
        name: "Jishnu Suresh",
        role: "Core Contributor",
        avatar: "/assets/images/contributors/contributor-jishnu.png",
        github: "https://github.com/Jishnu-JSK"
      },
      {
        name: "Arshid Chandran P K",
        role: "Developer",
        avatar: "/assets/images/profile.png",
        github: "https://github.com/T-ARK"
      },
      {
        name: "Vaishnav Sreejan",
        role: "Contributor (VS)",
        avatar: "/assets/images/contributors/contributor1.jpg",
        github: "https://github.com/VaishnavSreejan"
      },
      {
        name: "Ashin KR",
        role: "Contributor (Ashin)",
        avatar: "/assets/images/contributors/contributor4.jpg",
        github: "https://github.com/ash-in07"
      },
      {
        name: "Anukarsh C",
        role: "Contributor (AC)",
        avatar: "/assets/images/contributors/contributor3.jpg",
        github: "https://github.com/Anukarsh123"
      },
      {
        name: "Avarnika K C",
        role: "Contributor (Design/UI)",
        avatar: "/assets/images/contributors/contributor-avarnika.png",
        github: "https://github.com/avarnikakc-design"
      },
      {
        name: "Indulekha Sunil",
        role: "Contributor (Tech)",
        avatar: "/assets/images/contributors/contributor-indulekha.png",
        github: "https://github.com/indulekhasunil1-tech"
      },
      {
        name: "Fawaz Yasar",
        role: "Contributor",
        avatar: "/assets/images/contributors/contributor-fawaz.png",
        github: "https://github.com/Fawaz-Yasar"
      },
      {
        name: "Sanha Sherin",
        role: "Contributor",
        avatar: "/assets/images/contributors/contributor-sanha.png",
        github: "https://github.com/sanha-sherin"
      },
      {
        name: "Mayookha K",
        role: "Contributor",
        avatar: "/assets/images/contributors/contributor-mayookha.png",
        github: "https://github.com/Mayookha-k"
      },
      {
        name: "Aayushi Deepak",
        role: "Contributor",
        avatar: "/assets/images/contributors/contributor-aayushi.png",
        github: "https://github.com/aayushideepak2-bit"
      },
      {
        name: "Anannya AK",
        role: "Contributor",
        avatar: "/assets/images/contributors/contributor-anannya.png",
        github: "https://github.com/Anannyaa97"
      },
      {
        name: "Vishnu Pradeep",
        role: "Contributor",
        avatar: "/assets/images/contributors/contributor-vishnu.png",
        github: "https://github.com/vishnupradeep-vp"
      },
      {
        name: "Sampreeth",
        role: "Contributor",
        avatar: "/assets/images/contributors/contributor-sampreeth.png",
        github: "https://github.com/sampreeth444"
      },
      {
        name: "Anuvarnna",
        role: "Contributor",
        avatar: "/assets/images/contributors/contributor-anuvarnna.png",
        github: "https://github.com/anuvarnna"
      },
      {
        name: "Kripal V V",
        role: "Contributor",
        avatar: "/assets/images/contributors/contributor-kripal.png",
        github: "https://github.com/vvkripal-hue"
      },
      {
        name: "Adhi Adithya",
        role: "Contributor",
        avatar: "/assets/images/contributors/contributor-gamingwithjokers.png",
        github: "https://github.com/adhiadithiya888-hub"
      }
    ]
  },
  {
    id: "project-nidx",
    category: "AI / NETWORK SECURITY",
    title: "NID-X: ML Network Intrusion Detector",
    description: "Next-gen network security platform powered by machine learning. Ingests packet captures, inspects real-time anomaly probabilities, and triages security alerts in a live FastAPI + React console.",
    features: [
      "Multi-model classifiers (Random Forest, HistGradientBoosting, Decision Tree).",
      "FastAPI inference pipeline for real-time anomaly packet scoring.",
      "Interactive security triage dashboard with threat telemetry radar."
    ],
    tags: ["Python", "FastAPI", "Scikit-Learn", "React", "Network Security", "ML Flow"],
    link: "https://github.com/T-ARK/NID-X",
    liveLink: "https://nid-x.onrender.com",
    image: "/assets/images/project4.png",
    imageWebp: "/assets/images/project4.webp",
    alt: "NID-X Machine Learning Network Intrusion Detector by Arshid Chandran"
  },
  {
    id: "project-sales",
    category: "DATA SCIENCE / VECTOR ANALYTICS",
    title: "Sales Data Analyzer & BI Platform",
    description: "High-performance Sales Data Analyzer and Business Intelligence platform engineered to process and visualize 100K–1M+ transaction records with vectorized telemetry dashboards.",
    features: [
      "Vectorized ETL workflows processing 1M+ rows with Pandas and NumPy.",
      "Automated schema inference, data validation, and anomaly filtration.",
      "Real-time revenue telemetry with trend analysis and latency benchmarks."
    ],
    tags: ["Python", "Pandas", "NumPy", "Data Analytics", "BI Platform", "ETL"],
    link: "https://github.com/T-ARK/sales-analyzer",
    liveLink: null,
    image: "/assets/images/project5.png",
    imageWebp: "/assets/images/project5.webp",
    alt: "Sales Data Analyzer and BI Platform by Arshid Chandran"
  },
  {
    id: "project-valicrypt",
    category: "CRYPTOGRAPHY / SECURITY",
    title: "ValiCrypt: Secure Steganography System",
    description: "Zero-knowledge steganography vault that encrypts sensitive payloads using authenticated AES-256-GCM and Argon2id key derivation, embedding data imperceptibly in image/video carriers.",
    features: [
      "Authenticated AES-256-GCM encryption paired with Argon2id key derivation.",
      "LSB media carrier manipulation for undetectable steganographic embedding.",
      "Cryptographic checksum verification and automated data recovery workflows."
    ],
    tags: ["Python", "Cryptography", "AES-256-GCM", "Argon2id", "Steganography", "Security"],
    link: "https://github.com/T-ARK/ValiCrypt",
    liveLink: "https://valicrypt.onrender.com/",
    image: "/assets/images/project6.png",
    imageWebp: "/assets/images/project6.webp",
    alt: "ValiCrypt Secure Steganography Application by Arshid Chandran"
  },
  {
    id: "project-nexaptra",
    category: "CYBERSECURITY / NETWORK FORENSICS",
    title: "Nexaptra: Tactical PCAP Forensics",
    description: "An AI-driven forensic network analysis and PCAP investigation platform built with FastAPI, Scapy, React, and TypeScript. Provides real-time packet inspection and anomaly classification.",
    features: [
      "Multi-layer packet capture & protocol forensic decoding with Scapy.",
      "Deep flow timeline reconstruction and interactive endpoint communication maps.",
      "Automated forensic PDF report generation with hash integrity verification."
    ],
    tags: ["Python", "FastAPI", "Scapy", "React", "TypeScript", "PCAP Forensics", "Tailwind"],
    link: "https://github.com/T-ARK/Nexaptra",
    liveLink: "https://nexaptra.onrender.com/",
    image: "/assets/images/project7.png",
    imageWebp: "/assets/images/project7.webp",
    alt: "Nexaptra Tactical PCAP Forensics Platform by Arshid Chandran"
  },
  {
    id: "project-astrocare",
    category: "AEROSPACE BIOMEDICAL / NASA CHALLENGE",
    title: "AstroCare: Astronaut Health Intelligence",
    description: "Autonomous aerospace biomedical telemetry and astronaut vital monitoring system designed according to NASA Human Research Program (HRP) standards for the NASA Space Apps Challenge.",
    features: [
      "Real-time physiological telemetry (HR, SpO₂, Core Temp, Blood Pressure, Radiation).",
      "AI-driven spaceflight anomaly detection & mission risk scoring engine.",
      "Specialized clinical countermeasures and emergency mission check-in triage console."
    ],
    tags: ["TypeScript", "React", "NASA Space Apps", "FastAPI", "Biomedical AI", "Telemetry"],
    link: "https://github.com/NASA-SPACE-APP-CHALLANGE/AstroCare",
    liveLink: "https://astrocare-frontend-boof.onrender.com/",
    image: "/assets/images/project8.png",
    imageWebp: "/assets/images/project8.webp",
    alt: "AstroCare Astronaut Health Monitoring System by Arshid Chandran",
    contributorsLabel: "TEAM ALGOX // CONTRIBUTORS:",
    contributors: [
      {
        name: "Arshid Chandran P K",
        role: "Lead Developer",
        avatar: "/assets/images/profile.png",
        github: "https://github.com/T-ARK"
      },
      {
        name: "Vaishnav Sreejan",
        role: "Core Contributor (VS)",
        avatar: "/assets/images/contributors/contributor1.jpg",
        github: "https://github.com/VaishnavSreejan"
      },
      {
        name: "Anukarsh C",
        role: "Contributor (AC)",
        avatar: "/assets/images/contributors/contributor3.jpg",
        github: "https://github.com/Anukarsh123"
      },
      {
        name: "Ashin KR",
        role: "Contributor (Ashin)",
        avatar: "/assets/images/contributors/contributor4.jpg",
        github: "https://github.com/ash-in07"
      },
      {
        name: "Sinan M K",
        role: "Team AlgoX",
        avatar: "/assets/images/contributors/contributor2.png",
        github: "https://github.com/sinanmk24"
      }
    ]
  }
];

export const experiences = [
  {
    id: "exp-bits",
    role: "Software Development Intern",
    company: "Dineesh Information Technology Systems (DITS), Kannur",
    date: "Jan 2024 — 2 weeks",
    points: [
      "Built a full-stack SQL Database Migration Tool using Python, Flask, MySQL, and PostgreSQL to transfer data across database systems while maintaining integrity and consistency.",
      "Worked on frontend development using HTML, CSS, and JavaScript — improving form layouts, input validation, and interface usability of the migration dashboard.",
      "Diagnosed and resolved Cross-Origin Resource Sharing (CORS) issues by configuring Flask-CORS, enabling successful frontend-backend API communication.",
      "Executed a PostgreSQL-to-MySQL migration workflow on test tables and verified results via terminal, gaining hands-on exposure to API integration, debugging, and end-to-end testing."
    ]
  },
  {
    id: "exp-nexoent",
    role: "Python for Data Science Intern",
    company: "Neovent Innovation",
    date: "June 2025 — 2 weeks",
    points: [
      "Performed exploratory data analysis on structured datasets using Python and Jupyter Notebook.",
      "Created data visualizations to identify trends and patterns within datasets using Matplotlib and Pandas.",
      "Applied core data science workflows including data cleaning, transformation, and summarization."
    ]
  }
];
