// Everything shown on the site lives here.
// Lines: fwd = experience, mid = projects, def = leadership, gk = skills & contact.
// x / y are percentages on a vertical pitch (0,0 = top-left, attacking upward).

import photo from "../assets/profile.jpg";
import ericsson from "../assets/logos/ericsson.png";
import chartbeat from "../assets/logos/chartbeat.png";
import thermo from "../assets/logos/thermofisher.png";
import hackny from "../assets/logos/hackny.png";
import dialin from "../assets/logos/dialin.png";
import ball from "../assets/ball.png";

export const profile = {
  id: "manager",
  name: "Dlet Habtemariam",
  shortName: "Dlet",
  title: "Customer Success Engineer",
  org: "IBM",
  photo,
  bio: "Currently helping enterprise teams roll out HashiCorp and IBM Verify at IBM. UT Dallas grad. Outside of work I like to play soccer.",
  hint: "Tap a player to scout my career, or step up and take a penalty.",
  school: "University of Texas at Dallas",
  links: {
    github: "https://github.com/dlethab",
    linkedin: "https://www.linkedin.com/in/dlet-habtemariam/",
    email: "mailto:dlethab@icloud.com",
    resume: "/resume.pdf",
  },
};

export const LINES = {
  fwd: "Attack · Experience",
  mid: "Midfield · Projects",
  def: "Defence · Leadership",
  gk: "Keeper · Skills",
};

export const squad = [
  /* ---------- Attack: experience ---------- */
  {
    id: "ibm",
    color: "#0f62fe",
    line: "fwd",
    pos: "ST",
    number: 9,
    captain: true,
    x: 50,
    y: 14,
    name: "IBM",
    role: "Customer Success Engineer",
    dates: "Mar 2026 – Present",
    mark: "IBM",
    summary: "Supporting 160+ clients with HashiCorp and IBM Verify deployments.",
    bullets: [
      "Own technical success for enterprise accounts across HashiCorp Terraform, Vault, and Consul, from onboarding through renewal, growing product adoption and account health.",
      "Lead IBM Verify identity and access management deployments: SSO, MFA, and adaptive access policies over SAML and OIDC, getting customers to value faster.",
      "Build reusable Terraform modules, Vault secrets-management patterns, and hands-on workshops that help customer platform teams self-serve.",
      "Lead recovery of escalated accounts alongside support and engineering, and feed customer requirements into the product roadmap.",
    ],
    tools: ["Terraform", "Vault", "Consul", "IBM Verify", "SAML", "OIDC"],
  },
  {
    id: "chartbeat",
    color: "rgb(20,50,79)",
    line: "fwd",
    pos: "LW",
    number: 11,
    x: 19,
    y: 22,
    name: "Chartbeat",
    role: "Software Engineering Intern",
    dates: "Summer 2024",
    logo: chartbeat,
    bullets: [
      "Built an internal monitoring and observability system for a generative AI tool, cutting issue detection time by 80% with Kafka, time-series data, Nagios alerts, and a Grafana dashboard.",
      "Designed a scraping solution that detects and bypasses login-gated pages using Python and PostgreSQL, reducing scraping failures by 70%.",
    ],
    tools: ["Python", "Kafka", "Grafana", "Nagios", "PostgreSQL"],
  },
  {
    id: "ericsson",
    color: "rgb(0,85,164)",
    line: "fwd",
    pos: "RW",
    number: 7,
    x: 81,
    y: 22,
    name: "Ericsson",
    role: "Software Engineering Intern",
    dates: "May 2023 – Dec 2023",
    logo: ericsson,
    bullets: [
      "Automated a QA testing framework and shipped it onto the CI/CD pipeline with GitLab, Docker, and Kubernetes, saving developers ~2 hours a week, with results in an Allure dashboard.",
      "Wrote documentation and a reintegration guide so other development teams could adopt it easily.",
    ],
    tools: ["GitLab CI", "Docker", "Kubernetes", "Helm", "Allure", "YAML"],
  },

  /* ---------- Midfield: projects ---------- */
  {
    id: "dialin",
    color: "#ffffff",
    line: "mid",
    pos: "LCM",
    number: 8,
    x: 26,
    y: 40,
    name: "Dial In",
    role: "Creator & Developer",
    dates: "Apr 2024",
    logo: dialin,
    logoFit: "contain",
    bullets: [
      "A cryptic number-decoding word game with hundreds of plays and an 80% user retention rate.",
      "Researched and built precise length control for an LLM to generate multi-word phrases of length 10.",
    ],
    tools: ["React", "Node", "OpenAI API", "Python"],
    links: { demo: "https://dialin.fun", code: "https://github.com/dlethab/dial-in" },
  },
  {
    id: "ios-theme",
    color: "#0ea5e9",
    line: "mid",
    pos: "RCM",
    number: 10,
    x: 74,
    y: 40,
    name: "Live Art Themes",
    role: "iMessage Extension",
    dates: "Sep 2025",
    mark: "🎵",
    bullets: [
      "An iMessage extension that themes the conversation UI with an artist's Live Art from Spotify and Apple Music.",
      "Triggers the theme change when shared music is played inside the Messages app.",
    ],
    tools: ["SwiftUI", "MusicKit", "Spotify Web API", "Figma"],
  },
  {
    id: "this-site",
    color: "#d946ef",
    line: "mid",
    pos: "CDM",
    number: 6,
    x: 50,
    y: 60,
    name: "This Site",
    role: "Matchday Portfolio",
    dates: "Sep 2025 · rebuilt Oct 2026",
    logo: ball,
    logoFit: "contain",
    bullets: [
      "A portfolio laid out as a 4-3-3: experience up front, projects in midfield, leadership at the back.",
      "Keyboard navigable, mobile-first, with a penalty shootout hidden in the centre circle.",
    ],
    tools: ["React", "Vite", "Tailwind", "Framer Motion"],
    links: { code: "https://github.com/dlethab/dlethab.github.io" },
  },

  /* ---------- Defence: leadership ---------- */
  {
    id: "nsbe-finance",
    color: "#14b8a6",
    line: "def",
    pos: "LB",
    number: 3,
    x: 14,
    y: 70,
    name: "NSBE Finance Chair",
    role: "UT Dallas NSBE",
    dates: "2024 – 2025",
    mark: "$",
    bullets: [
      "Raised over $6,000 in chapter funds through corporate outreach, local fundraising, and scholarships.",
      "Led a STEM-focused Lego Robotics camp for low-income middle schoolers in Dallas, teaching programming fundamentals and robotics hardware with Lego Spike Prime.",
    ],
  },
  {
    id: "hackny",
    color: "#dc2626",
    line: "def",
    pos: "LCB",
    number: 5,
    x: 36,
    y: 75,
    name: "HackNY Fellow",
    role: "HackNY Fellowship",
    dates: "Summer 2024",
    logo: hackny,
    bullets: [
      "Selected as 1 of 20 fellows for a NYC tech fellowship with an acceptance rate under 3%.",
      "Engaged with founders, CTOs, civic leaders, and engineers across the NYC startup ecosystem.",
    ],
  },
  {
    id: "nsbe-senator",
    color: "#ea580c",
    line: "def",
    pos: "RCB",
    number: 4,
    x: 64,
    y: 75,
    name: "NSBE Senator",
    role: "UT Dallas NSBE",
    dates: "2023 – 2024",
    mark: "🤝",
    bullets: [
      "Represented the chapter at regional and national conferences and voted on organizational policies and initiatives.",
      "Served as liaison to the Student Government Association, advocating for STEM students on campus.",
    ],
  },
  {
    id: "nsbe-mentor",
    color: "#2563eb",
    line: "def",
    pos: "RB",
    number: 2,
    x: 86,
    y: 70,
    name: "NSBE Mentor",
    role: "UT Dallas NSBE",
    dates: "2025",
    mark: "👨🏾‍🏫",
    bullets: [
      "Mentored underclassmen through course selection, tutoring, project help, internships, and career advice.",
    ],
  },

  /* ---------- Keeper: skills & contact ---------- */
  {
    id: "skills",
    color: "#334155",
    line: "gk",
    pos: "GK",
    number: 1,
    x: 50,
    y: 91,
    name: "Skills & Contact",
    role: "The last line of defence",
    mark: "🧤",
    skills: {
      "Infra & Cloud": ["Terraform", "Vault", "Consul", "Docker", "Kubernetes", "Helm", "GitLab CI"],
      Identity: ["IBM Verify", "SSO", "MFA", "SAML", "OIDC"],
      Languages: ["Python", "SQL", "JavaScript", "TypeScript", "Swift"],
      "Data & Observability": ["Kafka", "PostgreSQL", "Grafana", "Nagios", "Power BI"],
      Frontend: ["React", "Node", "Tailwind", "SwiftUI"],
    },
  },
];

/* Former squad members: not on the pitch, still worth a look. */
export const archive = [
  {
    id: "thermo",
    color: "#ffffff",
    line: "fwd",
    pos: "SUB",
    name: "Thermo Fisher Scientific",
    role: "Software Engineering Intern",
    dates: "Summer 2022",
    logo: thermo,
    logoFit: "contain",
    bullets: [
      "Led automation of critical financial processes, designing Celonis process-mining graphs to surface bottlenecks and inefficiencies.",
      "Built Python and SQL solutions that reduced data workflow errors, improving data quality by 15%.",
    ],
    tools: ["Celonis", "Python", "SQL"],
  },
  {
    id: "davaco",
    color: "#3f3f46",
    line: "fwd",
    pos: "SUB",
    name: "Davaco",
    role: "Software Engineering Intern",
    dates: "Feb 2021 – May 2022",
    mark: "🧱",
    bullets: [
      "Built a SQL Server data warehouse aggregating business transactions across 4,000+ employees, with an automated ETL workflow integrating Oracle data.",
      "Led the reporting move from SSRS to Power BI, cutting the time analysts needed to reach key insights.",
    ],
    tools: ["SQL Server", "ETL", "Oracle", "Power BI"],
  },
  {
    id: "nsbe-site",
    color: "#06b6d4",
    line: "mid",
    pos: "SUB",
    name: "UTD NSBE Website",
    role: "Chapter Website",
    dates: "2023",
    mark: "🌐",
    bullets: [
      "Chapter website engaging 100+ members with events and resources, with a simple CMS and responsive UI.",
    ],
    tools: ["Node", "JavaScript", "Tailwind"],
    links: { demo: "https://utdnsbe.vercel.app/", code: "https://github.com/DemarcusI/Website" },
  },
];

export const allPlayers = [...squad, ...archive];

