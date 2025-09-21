// Team data for the SoccerFieldProfile (desktop-first 4-3-3)
// Coordinates are percentages in a 100(w) x 150(h) field (0,0 top-left)
// Badge = short position label used above each dot

import ericssonLogo from "../assets/logos/ericsson.png";
import chartbeatLogo from "../assets/logos/chartbeat.png";
import thermoLogo from "../assets/logos/thermofisher.png";
import dlet from "../assets/logos/dlet.png";

import resume from "../Dlet Habtemariam - Resume.pdf"
import { label } from "framer-motion/client";

export const manager = {
  id: "manager",
  label: "Dlet Habtemariam",
  formal: label,
  details:
    "Hello! Welcome to my interactive portfolio! Click on the player dots to explore different sections, and use the depth chart to see detailed information about my projects, skills, and resume.",
  description: " A little about me: I love building cool projects, coding, drawing and playing soccer!",
  school: "University of Texas at Dallas",
  gradDate: "December 2025",
  resumeImage: resume,
  resumeFile: resume,
  color: "bg-slate-800",
  icon: "🧑‍💼",
  logo: dlet,
  x: 85,
  y: 10,
  badge: "MANAGER",
};


/* =========================
   XI — formation 4-3-3
   ========================= */

// Forwards = work experiences (LW/ST/RW)
const FWD_LW_ERICSSON = {
  id: "lw-ericsson",
  label: "LW — Ericsson (SWE Intern)",
  formal: "Ericsson (SWE Intern)",
  details: "• Automated QA testing framework and deployed onto CI/CD pipeline using Gitlab, Docker and Kubernetes to save developers ~2 hours a week in QA, displayed testing results to Allure dashboard\n\n• Wrote documentation & reintegration guide for other development teams to easily adopt",
  dates: "May 2023 - Dec 2023",
  tools: "GitLab, Docker, Kubernetes, Helm, Allure, YAML",
  x: 28,
  y: 26,
  badge: "LW",
  color: "bg-rose-500",
  icon: "🏢",
  logo: ericssonLogo,
};


const FWD_ST_CHARTBEAT = {
  id: "st-chartbeat",
  label: "ST — Chartbeat (SWE Intern)",
  formal: "Chartbeat (SWE Intern)",
  details:
  "• Built internal monitoring and observability system for Generative AI tool, providing insights into system performance, and reducing issue detection time by 80% using Kafka, time-series data, Nagios alerts, and a Grafana dashboard\n\n• Designed data scraping solution to detect and bypass login-gated pages using Python and PostgreSQL to reduce data scraping failures by 70%",
  x: 50,
  y: 20,
  badge: "ST",
  color: "bg-indigo-500",
  icon: "⚽",
  logo: chartbeatLogo,
  dates: "Summer 2024",
  tools: "Python, Kafka, Grafana, Nagios, PostgreSQL",
};

const FWD_RW_THERMO = {
  id: "rw-thermofisher",
  label: "RW — Thermo Fisher Scientific (SWE Intern)",
  formal: "Thermo Fisher Scientific (SWE Intern)",
  details:
    "• Led automation efforts for critical financial processes by designing Celonis Process Mining graphs to track and visualize bottlenecks and inefficiencies\n\n• Developed Python and SQL solutions to reduce data workflow errors, delivering 15% improvements on data quality",
  x: 72,
  y: 26,
  badge: "RW",
  color: "bg-emerald-500",
  icon: "🧪",
  logo: thermoLogo,
  dates: "Summer 2022",
  tools: "Celonis, Python, SQL",
};

// Midfielders = projects (pick 3 for 4-3-3; the 4th shows in other formations)
const MID_LCM_DIALIN = {
  id: "lcm-dialin",
  label: "LCM — Dial In (Project)",
  formal: "Dial In",
  details:
    "• Creator and developer; Cryptic number-decoding game with hundreds of plays and 80% user retention rate\n\n• Researched and developed precise length control solution for LLM to generate multi word phrases of length 10",
  x: 35,
  y: 48,
  badge: "LCM",
  color: "bg-amber-500",
  icon: "🎮",
  dates: "April 2024",
  tools: "React, Node, OpenAI API, Python",
};

const MID_CDM_SOCCER_SITE = {
  id: "cdm-soccer-site",
  label: "CDM — Soccer Personal Site (Project)",
  formal: "Soccer Personal Site",
  details:
    "This interactive soccer-formation resume site; Tailwind, dnd-kit, React; formation presets & drag.",
  x: 50,
  y: 58,
  badge: "CDM",
  color: "bg-fuchsia-500",
  icon: "⚙️",
  dates: "September 2025",
  tools: "React, TailwindCSS, @dnd-kit, Git",
};

const MID_RCM_UTDNSBE = {
  id: "rcm-utdnsbe",
  label: "RCM — UTD NSBE Website (Project)",
  formal: "UTD NSBE Website",
  details:
    "Chapter website to engage 100+ members with events/resources; simple CMS and responsive UI.",
  x: 65,
  y: 48,
  badge: "RCM",
  color: "bg-cyan-500",
  icon: "🌐",
  dates: "2023",
  tools: "Node, JS/TS, Bootstrap/Tailwind",
};

// 4th midfielder (projects pool)
const MID_RM_IOS_THEME = {
  id: "rm-ios-theme",
  label: "RM — iOS Messages Music Theme (Project)",
  details:
    "• Designed and developed iMessage extension that sets UI theme to artist’s Live Art from Spotify & Apple Music\n\n• Runs theme change protocol when shared music is played in Messages app",
  x: 78, // used in 4-4-2 / 4-2-3-1 (not in 4-3-3 XI)
  y: 44,
  badge: "RM",
  color: "bg-sky-500",
  icon: "🎵",
  dates: "September 2025",
  tools: "SwiftUI, MusicKit, Spotify Web API, Figma",
};

// Defenders/GK = orgs & awards
const DEF_LB_NSBE_FINANCE = {
  id: "lb-nsbe-finance",
  label: "LB — UTD NSBE Finance Chair",
  formal: "UTD NSBE Finance Chair",
  details:
    "• Raised over $6,000 in chapter funds through corporate outreach, local fundraising, and scholarships\n\n• Led a STEM focused Lego Robotics camp for low-income middle school students in Dallas; taught functional programming skills and basic robotic hardware using Lego Spike Prime kits",
  x: 20,
  y: 65,
  badge: "LB",
  color: "bg-teal-500",
  icon: "$",
  dates: "2024 - 2025",
};

const DEF_LCB_HACKNY = {
  id: "lcb-hackny",
  label: "LCB — HackNY Fellow",
  formal: "HackNY Fellow",
  details: "• Selected as 1 of 20 fellows for a prestigious NYC based tech fellowship with less than a 3% acceptance rate\n\n• Engaged with tech founders, CEOs, CTOs, civic leaders, and engineers from the NYC startup ecosystem",
  x: 38,
  y: 70,
  badge: "LCB",
  color: "bg-violet-600",
  icon: "🎖️",
  dates: "Summer 2024",
};

const DEF_RCB_NSBE_SENATOR = {
  id: "rcb-nsbe-senator",
  label: "RCB — UTD NSBE Senator",
  formal: "UTD NSBE Senator",
  details: "Represented UTD NSBE chapter at regional and national conferences; voted on key organizational policies and initiatives.\n\nActed as a liaison between with Student Government Association to advocate for STEM students on campus.",
  x: 62,
  y: 70,
  badge: "RCB",
  color: "bg-orange-600",
  icon: "🤝",
  dates: "2023 - 2024",
};

const DEF_RB_TEMP = {
  id: "rb-nsbe-mentor",
  label: "RB — UTD NSBE Mentor",
  formal: "UTD NSBE Mentor",
  details: "Currently mentoring underclassmen. Guiding them through course selection, tutoring, project help, internships, and career advice.",
  x: 80,
  y: 65,
  badge: "RB",
  color: "bg-blue-600",
  icon: "👨🏾‍🏫",
  dates: "2025 - Present",
};

const GK_TEMP = {
  id: "gk-temp-award",
  label: "GK — Temporary (Award)",
  formal: "Temporary (Award)",
  details: "Placeholder for award/honor.",
  x: 50,
  y: 90,
  badge: "GK",
  color: "bg-slate-700",
  icon: "🧤",
};

export const formation433 = [
  // Forwards (work)
  FWD_LW_ERICSSON,
  FWD_ST_CHARTBEAT,
  FWD_RW_THERMO,

  // Midfield (3 of 4 projects)
  MID_LCM_DIALIN,
  MID_CDM_SOCCER_SITE,
  MID_RCM_UTDNSBE,

  // Defense/GK (orgs/awards)
  DEF_LB_NSBE_FINANCE,
  DEF_LCB_HACKNY,
  DEF_RCB_NSBE_SENATOR,
  DEF_RB_TEMP,
  GK_TEMP,
];

/* =========================
   Bench — subs + extra items
   ========================= */

export const bench = [
  {
    id: "sub-davaco",
    label: "Sub — Davaco (SWE Intern)",
    details:
      "• Built SQL Server data warehouse to aggregate business transactions across 4,000+ employees; built automated ETL workflow to integrate Oracle data\n\n• Led SQL reporting infrastructure transformation from SSRS to Power BI, cutting time for analysts to make key insights",
    badge: "SUB",
    color: "bg-zinc-700",
    icon: "🧱",
    tools: "SQL, ETL, Power BI",
    dates: "February 2021 - May 2022",
  },
  // keep the 4th midfielder handy on the bench for 4-3-3,
  // but it appears on the field in 4-4-2 / 4-2-3-1 presets:
  MID_RM_IOS_THEME,
  FWD_RW_THERMO,

  // keep a few general skill/infra placeholders if you like:

  //{ id: "bench-temp-1", label: "Sub — Temporary Player", details: "Placeholder for future entry.", badge: "SUB", color: "bg-zinc-700", icon: "⌛" },
  //{ id: "bench-temp-2", label: "Sub — Temporary Player", details: "Placeholder for future entry.", badge: "SUB", color: "bg-zinc-700", icon: "⌛" },
];

/* =========================
   Alternate Formations
   ========================= */

// 4-4-2 (LM/LCM/RCM/RM + 2 ST/SS)
export const formation442 = [
  // Forwards
  { ...FWD_ST_CHARTBEAT, x: 38, y: 22, badge: "ST" },
  { ...FWD_LW_ERICSSON, label: "ST — Ericsson", x: 62, y: 22, badge: "ST" },

  // Midfield 4 (all projects get on the field here)
  { ...MID_LCM_DIALIN, x: 20, y: 46, badge: "LM" },
  { ...MID_CDM_SOCCER_SITE, x: 38, y: 48, badge: "LCM" },
  { ...MID_RCM_UTDNSBE, x: 62, y: 48, badge: "RCM" },
  { ...MID_RM_IOS_THEME, x: 80, y: 46, badge: "RM" },

  // Back 4 (orgs/awards)
  DEF_LB_NSBE_FINANCE,
  DEF_LCB_HACKNY,
  DEF_RCB_NSBE_SENATOR,
  DEF_RB_TEMP,

  // GK
  GK_TEMP,
];

// 4-2-3-1 (two CDMs, three AMs LW/CAM/RW, one ST)
export const formation4231 = [
  // ST
  { ...FWD_ST_CHARTBEAT, x: 50, y: 18, badge: "ST" },

  // AM line — keep work experiences wide if you like
  { ...FWD_LW_ERICSSON, x: 28, y: 30, badge: "LW" },
  { ...MID_CDM_SOCCER_SITE, label: "CAM — Soccer Personal Site", x: 50, y: 32, badge: "CAM" },
  { ...FWD_RW_THERMO, x: 72, y: 30, badge: "RW" },

  // Double pivot — project mids
  { ...MID_LCM_DIALIN, x: 40, y: 48, badge: "LCDM" },
  { ...MID_RCM_UTDNSBE, x: 60, y: 48, badge: "RCDM" },

  // Back 4 (orgs/awards)
  DEF_LB_NSBE_FINANCE,
  DEF_LCB_HACKNY,
  DEF_RCB_NSBE_SENATOR,
  DEF_RB_TEMP,

  // GK
  GK_TEMP,
];
