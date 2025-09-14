// Team data for the SoccerFieldProfile (desktop-first 4-3-3)
// Coordinates are percentages in a 100(w) x 150(h) field (0,0 top-left)
// Badge = short position label used above each dot

export const manager = {
  id: "manager",
  label: "Manager — Dlet Habtemariam",
  details:
    "Software engineer. Experiences: Chartbeat, Ericsson, Thermo Fisher. Projects: Dial In, Soccer Site, UTD NSBE site, iOS Music Theme. Leadership: NSBE. HackNY Fellow.",
  x: 92,
  y: 6,
  badge: "MGR",
  color: "bg-slate-800",
  icon: "🧑‍💼",
  // dates: "", // optional
  // tools: "", // optional
};

/* =========================
   XI — formation 4-3-3
   ========================= */

// Forwards = work experiences (LW/ST/RW)
const FWD_LW_ERICSSON = {
  id: "lw-ericsson",
  label: "LW — Ericsson (SWE Intern)",
  details:
    "CI/CD (GitLab, Docker, K8s), QA frameworks (Helm/Allure), services with Kafka + Postgres.",
  x: 28,
  y: 26,
  badge: "LW",
  color: "bg-rose-500",
  icon: "🏢",
  // dates: "",
  // tools: "GitLab CI, Docker, K8s, Helm, Kafka, Postgres, Allure",
};

const FWD_ST_CHARTBEAT = {
  id: "st-chartbeat",
  label: "ST — Chartbeat (SWE Intern)",
  details:
    "Scaled scraping/content pipelines (Kafka + Python), reduced failures, added alerting & dashboards.",
  x: 50,
  y: 20,
  badge: "ST",
  color: "bg-indigo-500",
  icon: "⚽",
  // dates: "",
  // tools: "Python, Kafka, Grafana, Prometheus",
};

const FWD_RW_THERMO = {
  id: "rw-thermofisher",
  label: "RW — Thermo Fisher Scientific (SWE Intern)",
  details:
    "Process mining dashboards (Celonis) to uncover bottlenecks; Python + SQL automation for reporting.",
  x: 72,
  y: 26,
  badge: "RW",
  color: "bg-emerald-500",
  icon: "🧪",
  // dates: "",
  // tools: "Celonis, Python, SQL",
};

// Midfielders = projects (pick 3 for 4-3-3; the 4th shows in other formations)
const MID_LCM_DIALIN = {
  id: "lcm-dialin",
  label: "LCM — Dial In (Project)",
  details:
    "Word/pattern game with custom logic, daily mode, share cards; lightweight backend + front-end UX.",
  x: 35,
  y: 48,
  badge: "LCM",
  color: "bg-amber-500",
  icon: "🎮",
  // dates: "",
  // tools: "React, Node/Express (optional), Vercel/Netlify",
};

const MID_CDM_SOCCER_SITE = {
  id: "cdm-soccer-site",
  label: "CDM — Soccer Personal Site (Project)",
  details:
    "This interactive soccer-formation resume site; Tailwind, dnd-kit, React; formation presets & drag.",
  x: 50,
  y: 58,
  badge: "CDM",
  color: "bg-fuchsia-500",
  icon: "⚙️",
  // dates: "",
  // tools: "React, TailwindCSS, @dnd-kit, Vite/CRA",
};

const MID_RCM_UTDNSBE = {
  id: "rcm-utdnsbe",
  label: "RCM — UTD NSBE Website (Project)",
  details:
    "Chapter website to engage 100+ members with events/resources; simple CMS and responsive UI.",
  x: 65,
  y: 48,
  badge: "RCM",
  color: "bg-cyan-500",
  icon: "🌐",
  // dates: "",
  // tools: "Node, JS/TS, Bootstrap/Tailwind",
};

// 4th midfielder (projects pool)
const MID_RM_IOS_THEME = {
  id: "rm-ios-theme",
  label: "RM — iOS Messages Music Theme (Project)",
  details:
    "iOS/UX concept for music-themed Messages; theming, animation, design system exploration.",
  x: 78, // used in 4-4-2 / 4-2-3-1 (not in 4-3-3 XI)
  y: 44,
  badge: "RM",
  color: "bg-sky-500",
  icon: "🎵",
  // dates: "",
  // tools: "SwiftUI (concept), Figma",
};

// Defenders/GK = orgs & awards
const DEF_LB_NSBE = {
  id: "lb-nsbe-leadership",
  label: "LB — NSBE Leadership",
  details:
    "Sponsorships, mentorship nights, workshops; member engagement & study nights programming.",
  x: 20,
  y: 70,
  badge: "LB",
  color: "bg-teal-500",
  icon: "🤝",
};

const DEF_LCB_HACKNY = {
  id: "lcb-hackny",
  label: "LCB — HackNY Fellow",
  details: "HackNY Fellow: founder/CTO talks, NYC tech network.",
  x: 38,
  y: 70,
  badge: "LCB",
  color: "bg-violet-600",
  icon: "🎖️",
};

const DEF_RCB_TEMP = {
  id: "rcb-temp-org",
  label: "RCB — Temporary (Org/Award)",
  details: "Placeholder for additional org/award.",
  x: 62,
  y: 70,
  badge: "RCB",
  color: "bg-zinc-600",
  icon: "🏅",
};

const DEF_RB_TEMP = {
  id: "rb-temp-org",
  label: "RB — Temporary (Org/Award)",
  details: "Placeholder for additional org/award.",
  x: 80,
  y: 70,
  badge: "RB",
  color: "bg-zinc-600",
  icon: "🏅",
};

const GK_TEMP = {
  id: "gk-temp-award",
  label: "GK — Temporary (Award)",
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
  DEF_LB_NSBE,
  DEF_LCB_HACKNY,
  DEF_RCB_TEMP,
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
      "SQL Server data warehouse across thousands of employees; ETL automation; SSRS → Power BI.",
    badge: "SUB",
    color: "bg-zinc-700",
    icon: "🧱",
    // tools: "SQL Server, SSIS/ETL, Power BI",
  },
  // keep the 4th midfielder handy on the bench for 4-3-3,
  // but it appears on the field in 4-4-2 / 4-2-3-1 presets:
  MID_RM_IOS_THEME,

  // keep a few general skill/infra placeholders if you like:

  { id: "bench-temp-1",        label: "Sub — Temporary Player", details: "Placeholder for future entry.",                      badge: "SUB", color: "bg-zinc-700", icon: "⌛" },
  { id: "bench-temp-2",        label: "Sub — Temporary Player", details: "Placeholder for future entry.",                      badge: "SUB", color: "bg-zinc-700", icon: "⌛" },
];

/* =========================
   Alternate Formations
   ========================= */

// 4-4-2 (LM/LCM/RCM/RM + 2 ST/SS)
export const formation442 = [
  // Forwards
  { ...FWD_ST_CHARTBEAT, x: 46, y: 22, badge: "ST" },
  { ...FWD_LW_ERICSSON, id: "ss-ericsson", label: "ST — Ericsson", x: 54, y: 22, badge: "ST" },

  // Midfield 4 (all projects get on the field here)
  { ...MID_LCM_DIALIN, x: 30, y: 46, badge: "LM" },
  { ...MID_CDM_SOCCER_SITE, id: "lcm-soccer-site-442", x: 44, y: 48, badge: "LCM" },
  { ...MID_RCM_UTDNSBE, id: "rcm-utdnsbe-442", x: 56, y: 48, badge: "RCM" },
  { ...MID_RM_IOS_THEME, x: 70, y: 46, badge: "RM" },

  // Back 4 (orgs/awards)
  DEF_LB_NSBE,
  DEF_LCB_HACKNY,
  DEF_RCB_TEMP,
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
  { ...MID_CDM_SOCCER_SITE, id: "cam-soccer-site", label: "CAM — Soccer Personal Site", x: 50, y: 32, badge: "CAM" },
  { ...FWD_RW_THERMO, x: 72, y: 30, badge: "RW" },

  // Double pivot — project mids
  { ...MID_LCM_DIALIN, x: 40, y: 48, badge: "LCDM" },
  { ...MID_RCM_UTDNSBE, x: 60, y: 48, badge: "RCDM" },

  // Back 4 (orgs/awards)
  DEF_LB_NSBE,
  DEF_LCB_HACKNY,
  DEF_RCB_TEMP,
  DEF_RB_TEMP,

  // GK
  GK_TEMP,
];
