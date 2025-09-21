import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import {
  formation433,
  formation442,
  formation4231,
  manager,
  bench,
} from "../team/teamData";
import PlayerDot from "./PlayerDot";
import siteLogo from "../assets/logos/dialinlogo.png";
import resume from "../assets/logos/resumepic.png";
import rightarrow from "../assets/logos/arrowright.png";
import leftarrow from "../assets/logos/leftarrow.png";

/**
 * Desktop layout: Football Manager style
 * - 3-column grid: Field | Selected Player | Depth Chart
 * - Hover/select highlights on field + depth chart
 */
export default function SoccerFieldProfile({ title = "My Lineup" }) {
  const [currentFormation, setCurrentFormation] = useState("4-3-3");
  const [positions, setPositions] = useState(formation433.map((p) => ({ ...p })));
  const [selectedId, setSelectedId] = useState(manager.id);
  const [hoveredId, setHoveredId] = useState(null);

  const FORMATIONS = ["4-3-3", "4-2-3-1", "4-4-2"];
  const isDesktop = useIsDesktop();

  const isEmphasized = (id) => id === selectedId || id === hoveredId;

  function loadFormation(name) {
    let preset = formation433;
    if (name === "4-4-2") preset = formation442;
    if (name === "4-2-3-1") preset = formation4231;
    setCurrentFormation(name);
    setPositions(preset.map((p) => ({ ...p })));
    setSelectedId(manager.id);
  }
  
  

const DesktopLayout = () => {
  const [currentFormation, setCurrentFormation] = useState("4-3-3");
  const [positions, setPositions] = useState(formation433.map((p) => ({ ...p })));
  const [selectedId, setSelectedId] = useState(manager.id);
  const [hoveredId, setHoveredId] = useState(null);
  /* eslint-disable no-unused-vars */
  const [activeId, setActiveId] = useState(null);
  /* eslint-enable no-unused-vars */

  const fieldRef = useRef(null);
  const dragStartRef = useRef({}); // { [id]: { x, y } }
  const FORMATIONS = ["4-3-3", "4-2-3-1", "4-4-2"];
  


  // DnD sensors — tiny delay & tolerance reduce accidental drags
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 2 } })
    //useSensor(PointerSensor, { activationConstraint: { delay: 120, tolerance: 6 } })
  );

  const isEmphasized = (id) => id === selectedId || id === hoveredId;

  const selected = useMemo(() => {
    if (!selectedId) return null;
    return (
      positions.find((p) => p.id === selectedId) ||
      bench.find((b) => b.id === selectedId) ||
      (manager.id === selectedId ? manager : null)  // Return manager if selected
    );
  }, [positions, selectedId]);

  function loadFormation(name) {
    let preset = formation433;
    if (name === "4-4-2") preset = formation442;
    if (name === "4-2-3-1") preset = formation4231;
    setCurrentFormation(name);
    setPositions(preset.map((p) => ({ ...p })));
    //setSelectedId(null);
  }

  // DnD handlers — commit using delta in field space
  function handleDragStart(event) {
    const id = event.active.id;
    setActiveId(id);
    const p = positions.find((pp) => pp.id === id);
    if (p) dragStartRef.current[id] = { x: p.x, y: p.y };
  }

  function handleDragEnd(event) {
    const { active, delta } = event;
    if (!active?.id) return;
    const box = fieldRef.current?.getBoundingClientRect();
    if (!box) return;

    const dxPct = (delta.x / box.width) * 100;
    const dyPct = (delta.y / box.height) * 100;
    const start = dragStartRef.current[active.id] || { x: 50, y: 50 };

    let x = start.x + dxPct;
    let y = start.y + dyPct;

    const clamp = (v) => Math.max(2, Math.min(98, v));
    x = clamp(x);
    y = clamp(y);

    setPositions((prev) => prev.map((p) => (p.id === active.id ? { ...p, x, y } : p)));
    setActiveId(null);
    delete dragStartRef.current[active.id];
  }

  // Depth chart groups (uses new IDs)
  const depth = useMemo(() => {
     const all = new Map();
      [...formation433, ...bench].forEach((p) => all.set(p.id, p));

      const EXPERIENCE_IDS = new Set([
        "lw-ericsson",
        "st-chartbeat",
        "rw-thermofisher",
        "sub-davaco",
      ]);

      const PROJECT_IDS = new Set([
        "lcm-dialin",
        "rcm-utdnsbe",
        "cdm-soccer-site",
        "rm-ios-theme",
      ]);

      const ORG_IDS = new Set([
        "lb-nsbe-finance",
        "lcb-hackny",
        "rcb-nsbe-senator",
        "rb-nsbe-mentor",
        "gk-temp-award",
      ]);

    const forwards = [];
    const mids = [];
    const defs = [];

    for (const p of all.values()) {
      if (EXPERIENCE_IDS.has(p.id)) forwards.push(p);
      else if (PROJECT_IDS.has(p.id)) mids.push(p);
      else if (ORG_IDS.has(p.id)) defs.push(p);
    }

    const tempLast = (a, b) =>
      (/Temporary/i.test(a.label) ? 1 : 0) - (/Temporary/i.test(b.label) ? 1 : 0);

    return {
      forwards: forwards.sort(tempLast),
      midfielders: mids.sort(tempLast),
      defenders: defs.sort(tempLast),
      manager: [manager],
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-zinc-900 text-zinc-100">
      <div className="max-w-7xl mx-auto p-4 lg:p-6 grid gap-6 lg:grid-cols-[1.7fr_1fr_1fr]">
        {/* Field Column */}
        {/* LEFT COLUMN wrapper (replace your single field <section> with this) */}
        <div className="flex flex-col gap-4">

        <section className="rounded-3xl border border-white/10 bg-zinc-800/40 backdrop-blur px-4 py-3 md:py-1">
          {/* Mobile: logo | controls. Desktop: slim single row */}
          <div className="grid grid-cols-[90px_1fr] items-stretch gap-3 md:flex md:items-center md:justify-between">
            {/* LEFT: circular logo (mobile-only) */}
            <div className="md:hidden self-stretch flex items-center justify-center">
              <div className="h-full max-h-16 aspect-square rounded-full bg-blue-600 ring-2 ring-white/20 p-2 grid place-items-center shrink-0">
                <img
                  src={siteLogo}
                  alt="Site logo"
                  className="h-full w-full object-contain rounded-full no-native-dnd"
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                />
              </div>
            </div>

            {/* RIGHT: buttons */}
            {/* Mobile: horizontal buttons + full-width Reset below */}
            <div className="md:hidden flex flex-col gap-2">
              <div className="flex gap-2 flex-wrap w-full justify-between">
                {FORMATIONS.map((f) => {
                  const active = currentFormation === f;
                  return (
                    <button
                      key={f}
                      onClick={() => loadFormation(f)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition ${
                        active ? "bg-white/10 ring-1 ring-yellow-400" : "bg-white/5 hover:bg-white/10"
                      }`}
                      aria-pressed={active}
                    >
                      {f}
                    </button>
                  );
                })}
                <button
                  onClick={() => {loadFormation(currentFormation); setSelectedId(manager.id);}}
                  className="w-full h-9 rounded-lg text-sm bg-zinc-700 hover:bg-zinc-600"
                  title="Reset players to the current formation's default positions"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Desktop Vertical: one slim row with 4 equal columns (3 formations + Reset) */}
            <div className="hidden md:grid md:grid-cols-4 md:gap-2 md:w-full">
              {FORMATIONS.map((f) => {
                const active = currentFormation === f;
                return (
                  <button
                    key={f}
                    onClick={() => loadFormation(f)}
                    className={`w-full h-9 rounded-lg text-sm transition ${
                      active ? "bg-white/10 ring-1 ring-yellow-400" : "bg-white/5 hover:bg-white/10"
                    }`}
                    aria-pressed={active}
                  >
                    {f}
                  </button>
                );
              })}
              <button
                onClick={() => {loadFormation(currentFormation); setSelectedId(manager.id);}}
                className="w-full h-9 rounded-lg text-sm bg-zinc-700 hover:bg-zinc-600"
                title="Reset players to the current formation's default positions"
              >
                Reset
              </button>
            </div>
          </div>
        </section>
        {/* Field (your original section) */}
        <section className="rounded-3xl overflow-hidden shadow-xl ring-1 ring-white/10 bg-zinc-800/40 backdrop-blur">
            <div
            ref={fieldRef}
            className="relative select-none touch-none"
            style={{ willChange: "transform", aspectRatio: "2 / 3" }}
            onMouseMove={(e) => {
                const el = e.target.closest("[data-id]");
                setHoveredId(el?.dataset?.id || null);
            }}
            onMouseLeave={() => setHoveredId(null)}
            >
            {/* Grass stripes */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-green-700" />
                {[...Array(12)].map((_, i) => (
                <div
                    key={i}
                    className={`absolute inset-y-0 w-[8.5%] ${
                    i % 2 === 0 ? "bg-green-600/50" : "bg-transparent"
                    }`}
                    style={{ left: `${i * 8.5}%` }}
                />
                ))}
            </div>

            <FieldMarkings />

            {/* (Remove the old in-field Controls block to avoid duplicates) */}

            {/* Manager chip with emphasis */}
            <button
                className={`absolute -translate-x-1/2 -translate-y-1/2 transition ${
                isEmphasized("manager") ? "ring-4 ring-yellow-400/80 rounded-full" : ""
                }`}
                style={{ left: `${manager.x}%`, top: `${manager.y}%` }}
                data-id="manager"
                onClick={() => setSelectedId(manager.id)}
                onMouseEnter={() => setHoveredId("manager")}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId("manager")}
                onBlur={() => setHoveredId(null)}
                title={manager.label}
                aria-label={manager.label}
            >
                <div className="relative">
                <div
                    className={`h-7 px-2 ${manager.color} rounded-full ring-2 ring-white shadow-lg text-xs text-white flex items-center gap-1`}
                >
                    <span>{manager.icon}</span>
                    <span>{manager.badge}</span>
                </div>
                </div>
            </button>

            {/* DnD area */}
            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToParentElement]}
            >
                {positions.map((p) => (
                <PlayerDot
                    key={p.id}
                    id={p.id}
                    xPct={p.x}
                    yPct={p.y}
                    label={p.label}
                    badge={p.badge}
                    icon={p.icon}
                    logo={p.logo}
                    color={p.color}
                    emphasized={isEmphasized(p.id)}
                    onClick={() => setSelectedId(p.id)}
                />
                ))}

            </DndContext>

            {/* Helper bubble */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/40 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md">
                Drag a dot to reposition
            </div>
            </div>
        </section>
        </div>


{/* Selected Player — single card with 2/3 : 1/3 split */}
<section className="rounded-3xl border border-white/10 bg-zinc-800/40 backdrop-blur p-0 overflow-hidden grid min-h-[34rem] grid-rows-[1fr_2fr]">
  {/* Logo (bottom 1/3) */}
  <div className="p-4 border-t border-white/10 pb-0">
    {selected ? (
      selected.logo ? (
        <div className="h-full w-full bg-gray p-1 rounded-lg flex items-center justify-center">
          <img
            src={selected.logo}
            alt={`${selected.label} logo`}
            className="w-64 h-60 object-contain rounded-2xl ring-1 ring-white/20 bg-white/5 p-3 no-native-dnd"
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            onError={(e) => { e.currentTarget.src = "/logos/fallback.png"; }}
          />
        </div>
      ) : (
        <div className="h-full w-full flex flex-col items-center justify-center">
          <div
            className={`h-[70%] aspect-square ${selected.color ?? "bg-indigo-500"} rounded-full ring-2 ring-white grid place-items-center text-4xl text-white shadow-lg`}
            aria-hidden
          >
            {selected.icon || "•"}
          </div>
          {selected.badge && (
            <div className="mt-2 text-xs px-2 py-0.5 rounded-full bg-black/50 text-white">
              {selected.badge}
            </div>
          )}
        </div>
      )
    ) : (
      <div className="h-full w-full flex items-center justify-center text-sm text-zinc-400">
        Pick a player to see their logo here.
      </div>
    )}
  </div>

  {/* Info (top 2/3) */}
  <div className="p-4 min-h-0 overflow-auto flex flex-col gap-3 pt-0"> {/* pt-0 removes top padding for manager */}
    <h2 className="text-sm font-semibold tracking-wide uppercase text-zinc-300">
      {selected && selected.id === "manager" ? "Manager" : "Selected Player"}
    </h2>


    {selected ? (
      selected.id === "manager" ? (
        // Custom layout for manager intro
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-white">{selected.label}</h3>
          <p className="text-sm text-zinc-200">{selected.details}</p>
          <div className="text-sm text-zinc-300">
            <p>{selected.description}</p>
            <p className="mt-2">School: <span className="text-[#006747]">{selected.school}</span></p>
            <p className="mt-1">Graduation Date: <span className="text-[#FF5F00]">{selected.gradDate}</span></p>
          </div>

          {/* Resume Image */}
          <div className="mt-6">
            <p className="text-zinc-200">Click below to view my resume:</p>
            <a href={selected.resumeFile} target="_blank" rel="noopener noreferrer">
              <div className="mt-2 flex justify-center">
                <img
                  src={resume}
                  alt="Resume"
                  className="w-40 h-55 cursor-pointer rounded-lg shadow-lg bg-white p-2"
                />
              </div>
            </a>
          </div>
        </div>
      ) : (
        // Default layout for other players
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${selected.color ?? "bg-indigo-500"}`} />
            <span className="text-lg font-medium">{selected.formal}</span>
          </div>

          <div className="text-sm text-zinc-200 whitespace-pre-wrap">
            {selected.details}
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div>
              <dt className="text-zinc-400">Dates</dt>
              <dd className="text-zinc-100">{selected.dates || "Add dates in teamData.js"}</dd>
            </div>
            <div>
              <dt className="text-zinc-400">Tools</dt>
              <dd className="text-zinc-100">{selected.tools || "Add tools in teamData.js"}</dd>
            </div>
          </dl>

          {"href" in selected && selected.href && (
            <a
              href={selected.href}
              className="inline-flex items-center gap-2 text-indigo-300 hover:text-indigo-200 underline"
            >
              Learn more ↗
            </a>
          )}
        </div>
      )
    ) : (
      <div className="text-sm text-zinc-400">
        Select a dot on the field to see full details, dates, and tools.
      </div>
    )}
  </div>

</section>




        

        {/* Depth Chart */}
        <section className="rounded-3xl border border-white/10 bg-zinc-800/40 backdrop-blur p-4 flex flex-col gap-4">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-zinc-300">Depth Chart</h2>
          <DepthGroup
            title="Manager"
            items={depth.manager}
            onSelect={setSelectedId}
            onHover={setHoveredId}
            selectedId={selectedId}
            hoveredId={hoveredId}
          />
          <DepthGroup
            title="Forwards — Work Experience"
            items={depth.forwards}
            onSelect={setSelectedId}
            onHover={setHoveredId}
            selectedId={selectedId}
            hoveredId={hoveredId}
          />
          <DepthGroup
            title="Midfielders — Projects"
            items={depth.midfielders}
            onSelect={setSelectedId}
            onHover={setHoveredId}
            selectedId={selectedId}
            hoveredId={hoveredId}
          />
          <DepthGroup
            title="Defenders/GK — Orgs & Awards"
            items={depth.defenders}
            onSelect={setSelectedId}
            onHover={setHoveredId}
            selectedId={selectedId}
            hoveredId={hoveredId}
          />
        </section>
      </div>
    </div>
  );
}

  const MobileLayout = () => {
      // Shared props for the reusable SoccerField
      const fieldProps = {
        positions,
        setPositions,
        selectedId,
        setSelectedId,
        hoveredId,
        setHoveredId,
        manager,
        isEmphasized,
      };

    const [showDepthChart, setShowDepthChart] = useState(false);
    const [showInfoPage, setShowInfoPage] = useState(false);
    //const [selectedId, setSelectedId] = useState(manager.id);

      const selected = useMemo(() => {
        if (!selectedId) return null;
        return (
          positions.find((p) => p.id === selectedId) ||
          bench.find((b) => b.id === selectedId) ||
          (manager.id === selectedId ? manager : null)
          
        );
      }, []);

    const mDepth = useMemo(() => {
      const all = new Map();
      [...formation433, ...bench].forEach((p) => all.set(p.id, p));

      const EXPERIENCE_IDS = new Set([
        "lw-ericsson",
        "st-chartbeat",
        "rw-thermofisher",
        "sub-davaco",
      ]);

      const PROJECT_IDS = new Set([
        "lcm-dialin",
        "rcm-utdnsbe",
        "cdm-soccer-site",
        "rm-ios-theme",
      ]);

      const ORG_IDS = new Set([
        "lb-nsbe-finance",
        "lcb-hackny",
        "rcb-nsbe-senator",
        "rb-nsbe-mentor",
        "gk-temp-award",
      ]);

      const forwards = [];
      const mids = [];
      const defs = [];

      for (const p of all.values()) {
        if (EXPERIENCE_IDS.has(p.id)) forwards.push(p);
        else if (PROJECT_IDS.has(p.id)) mids.push(p);
        else if (ORG_IDS.has(p.id)) defs.push(p);
      }

      return {
        forwards,
        midfielders: mids,
        defenders: defs,
        manager: [manager],
      };
    }, []);

    return (
      <div className="relative w-full h-screen bg-zinc-900 text-zinc-100">
        <div
          className={`
            w-[90%] flex justify-center items-center gap-3 py-1
            [@media(min-height:800px)]:gap-15
            [@media(min-height:800px)]:py-3
          `}
        >
          <img
            src="/ball.png"
            alt="Ball"
            className="w-10 h-10 object-contain [@media(min-height:800px)]:w-12 [@media(min-height:800px)]:h-12"
          />
          <h1
            className="text-xl font-bold tracking-wide
                      [@media(min-height:800px)]:text-2xl"
          >
            Welcome to Dlet FC
          </h1>
          <img
            src="/ball.png"
            alt="Ball"
            className="w-10 h-10 object-contain [@media(min-height:800px)]:w-12 [@media(min-height:800px)]:h-12"
          />
        </div>





        {/* Field (reusable) */}
        <div className="w-[90%] p-2 rounded-[20px] relative">
          <SoccerField {...fieldProps} />
        </div>

        <div
          className={`
            w-[90%] p-3
            [@media(min-height:800px)]:p-3
          `}
          style={{ zIndex: 1000 }}
        >
          <div
            className={`
              flex flex-wrap justify-between gap-2
              [@media(min-height:800px)]:gap-4
            `}
          >
            {FORMATIONS.map((f) => {
              const active = currentFormation === f;
              return (
                <button
                  key={f}
                  onClick={() => loadFormation(f)}
                  className={`
                    px-3 py-1.5 rounded-lg text-sm transition
                    ${active ? "bg-white/10 ring-1 ring-yellow-400" : "bg-white/5 hover:bg-white/10"}
                    [@media(min-height:800px)]:px-5
                    [@media(min-height:800px)]:py-2
                    [@media(min-height:800px)]:text-base
                  `}
                  aria-pressed={active}
                >
                  {f}
                </button>
              );
            })}

            {/* Reset button */}
            <button
              onClick={() => loadFormation(currentFormation)}
              title="Reset players to the current formation's default positions"
              className={`
                order-last
                w-auto h-auto px-3 py-1.5 rounded-lg text-sm bg-zinc-700 hover:bg-zinc-600
                [@media(min-height:800px)]:w-full
                [@media(min-height:800px)]:h-10
                [@media(min-height:800px)]:px-0
                [@media(min-height:800px)]:py-0
                [@media(min-height:800px)]:text-base
              `}
            >
              Reset
            </button>
          </div>
        </div>




        {/* Info Drawer */}
        <div
          className={`
            absolute top-0 right-0
            h-[90%] bg-zinc-800/95 p-4 transition-all duration-300 ease-in-out
            overflow-y-auto border-t-2 border-zinc-800
            ${showInfoPage ? "w-[80%] translate-x-0" : "w-[10%] translate-x-0"}
            [@media(min-height:800px)]:h-[85%]
          `}
          style={{ zIndex: 999 }}
          onClick={() => setShowInfoPage((s) => !s)}
        >
          <h2
            className="flex items-center gap-2 text-xl transform rotate-90 origin-left absolute left-4 top-[20%] -translate-y-1/2 whitespace-nowrap"
          >
            Selected Player
            <img
              src={showInfoPage ? rightarrow : leftarrow}
              alt="arrow"
              className="inline-block w-9 h-9 invert"
            />
            {selected?.label ?? ""}
          </h2>



          {showInfoPage && (
              <div className="w-[95%] overflow-y-auto ml-auto">
                {selected ? (
                  selected.logo ? (
                    <div className="h-full w-full bg-gray p-1 rounded-lg items-center justify-center">
                      <img
                        src={selected.logo}
                        alt={`${selected.label} logo`}
                        className="w-64 h-60 object-contain rounded-2xl ring-1 ring-white/20 bg-white/5 p-3 no-native-dnd"
                        draggable={false}
                        onDragStart={(e) => e.preventDefault()}
                        onError={(e) => { e.currentTarget.src = "/logos/fallback.png"; }}
                      />
                    </div>
                  ) : (
                    <div className="h-full w-full items-center justify-center p-2">
                      <div
                          className={`size-56 ${selected.color ?? "bg-indigo-500"} rounded-full ring-2 ring-white 
                                      grid place-items-center text-4xl text-white shadow-lg object-contain mx-auto`}
                        aria-hidden
                      >
                        {selected.icon || "•"}
                      </div>
                    </div>
                  )
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-sm text-zinc-400">
                    Pick a player to see their logo here.
                  </div>
                )}
                  {/* Info (top 2/3) */}
                <div className="p-4 min-h-0 overflow-auto flex flex-col gap-3 pt-0"> {/* pt-0 removes top padding for manager */}
                  <h2 className="text-sm font-semibold tracking-wide uppercase text-zinc-300">
                    {selected && selected.id === "manager" ? "Manager" : "Selected Player"}
                  </h2>


                  {selected ? (
                    selected.id === "manager" ? (
                      // Custom layout for manager intro
                      <div className="space-y-3">
                        <h3 className="text-xl font-semibold text-white">{selected.label}</h3>
                        <p className="text-sm text-zinc-200">{selected.details}</p>
                        <div className="text-sm text-zinc-300">
                          <p>{selected.description}</p>
                          <p className="mt-2">School: <span className="text-[#006747]">{selected.school}</span></p>
                          <p className="mt-1">Graduation Date: <span className="text-[#FF5F00]">{selected.gradDate}</span></p>
                        </div>

                        {/* Resume Image */}
                        <div className="mt-6">
                          <p className="text-zinc-200">Click below to view my resume:</p>
                          <a href={selected.resumeFile} target="_blank" rel="noopener noreferrer">
                            <div className="mt-2 flex justify-center">
                              <img
                                src={resume}
                                alt="Resume"
                                className="w-40 h-55 cursor-pointer rounded-lg shadow-lg bg-white p-2"
                              />
                            </div>
                          </a>
                        </div>
                      </div>
                    ) : (
                      // Default layout for other players
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className={`h-2.5 w-2.5 rounded-full ${selected.color ?? "bg-indigo-500"}`} />
                          <span className="text-lg font-medium">{selected.formal}</span>
                        </div>

                        <div className="text-sm text-zinc-200 whitespace-pre-wrap">
                          {selected.details}
                        </div>

                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div>
                            <dt className="text-zinc-400">Dates</dt>
                            <dd className="text-zinc-100">{selected.dates || "Add dates in teamData.js"}</dd>
                          </div>
                          <div>
                            <dt className="text-zinc-400">Tools</dt>
                            <dd className="text-zinc-100">{selected.tools || "Add tools in teamData.js"}</dd>
                          </div>
                        </dl>

                        {"href" in selected && selected.href && (
                          <a
                            href={selected.href}
                            className="inline-flex items-center gap-2 text-indigo-300 hover:text-indigo-200 underline"
                          >
                            Learn more ↗
                          </a>
                        )}
                      </div>
                    )
                  ) : (
                    <div className="text-sm text-zinc-400">
                      Select a dot on the field to see full details, dates, and tools.
                    </div>
                  )}
                </div>
              </div>
              
          )}
        </div>

        {/* Depth Chart Section */}
        <div
          className={`absolute bottom-0 left-0 w-full bg-zinc-800/95 p-4 transition-all duration-300 ease-in-out overflow-y-auto border-t-2 border-zinc-800 ${
            showDepthChart
              ? "h-[75svh] translate-y-0"
              : "h-[10svh] [@media(min-height:800px)]:h-[15%] translate-y-0"
          }`}
          onClick={() => setShowDepthChart(s => !s)}
          style={{ zIndex: 999 }}
        >
          <h2
            className={`
              text-white font-semibold uppercase cursor-pointer
              text-xl
              [@media(min-height:800px)]:text-4xl
            `}
          >
            Depth Chart
          </h2>


          {showDepthChart && (
            <div className="mt-2">
              <DepthGroup
                title="Manager - Dlet Habtemariam"
                items={mDepth.manager}
                onSelect={setSelectedId}
                onHover={setHoveredId}
                selectedId={selectedId}
                hoveredId={hoveredId}
              />
              <DepthGroup
                title="Forwards — Work Experience"
                items={mDepth.forwards}
                onSelect={setSelectedId}
                onHover={setHoveredId}
                selectedId={selectedId}
                hoveredId={hoveredId}
              />
              <DepthGroup
                title="Midfielders — Projects"
                items={mDepth.midfielders}
                onSelect={setSelectedId}
                onHover={setHoveredId}
                selectedId={selectedId}
                hoveredId={hoveredId}
              />
              <DepthGroup
                title="Defenders/GK — Orgs & Awards"
                items={mDepth.defenders}
                onSelect={setSelectedId}
                onHover={setHoveredId}
                selectedId={selectedId}
                hoveredId={hoveredId}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative h-screen w-full bg-zinc-900 text-zinc-100">
      <div className="relative w-full h-screen bg-zinc-900">
        {isDesktop ? <DesktopLayout /> : <MobileLayout />}
      </div>
    </div>
  );
}

function DepthGroup({ title, items, onSelect, onHover, selectedId, hoveredId }) {
  return (
    <div>
      <div className="text-xs text-zinc-400 mb-2 uppercase tracking-wide">{title}</div>
      {items.length ? (
        <ul className="space-y-1.5">
          {items.map((p) => {
            const active = p.id === selectedId || p.id === hoveredId;
            return (
              <li key={p.id}>
                <button
                  className={`w-full text-left px-2 py-1 rounded-lg flex items-center gap-2 transition ${
                    active ? "bg-white/10 ring-1 ring-yellow-400" : "hover:bg-white/5"
                  }`}
                  onClick={() => onSelect(p.id)}
                  onMouseEnter={() => onHover?.(p.id)}
                  onMouseLeave={() => onHover?.(null)}
                  title={p.details}
                >
                  {p.logo ? (
                    <img
                      src={p.logo}
                      alt=""
                      className="h-4 w-4 object-contain rounded-sm ring-1 ring-white/20 no-native-dnd"
                      draggable={false}
                      onDragStart={(e) => e.preventDefault()}
                    />
                  ) : (
                    <span className={`h-2 w-2 rounded-full ${p.color ?? "bg-indigo-500"}`} />
                  )}
                  <span className="text-sm text-zinc-100 truncate">{p.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="text-zinc-500 text-sm">No items yet.</div>
      )}
    </div>
  );
}

function FieldMarkings() {
  return (
    <svg
      viewBox="0 0 100 150"
      className="absolute rounded-[20px] ring-2 ring-white/90"
      preserveAspectRatio="none"
    >
      <rect x="0" y="0" width="100" height="150" rx="8" ry="8" fill="none" stroke="white" strokeWidth="1.5" />
      <line x1="0" y1="75" x2="100" y2="75" stroke="white" strokeWidth="1.5" />
      <circle cx="50" cy="75" r="9" fill="none" stroke="white" strokeWidth="1.5" />
      <circle cx="50" cy="75" r="0.8" fill="white" />
      {/* Bottom box */}
      <rect x="18" y="120" width="64" height="20" fill="none" stroke="white" strokeWidth="1.5" />
      <rect x="32" y="132" width="36" height="8" fill="none" stroke="white" strokeWidth="1.5" />
      <circle cx="50" cy="130" r="0.8" fill="white" />
      {/* Top box */}
      <rect x="18" y="10" width="64" height="20" fill="none" stroke="white" strokeWidth="1.5" />
      <rect x="32" y="10" width="36" height="8" fill="none" stroke="white" strokeWidth="1.5" />
      <circle cx="50" cy="20" r="0.8" fill="white" />
      {/* D arcs */}
      <path d="M38,120 A12,12 0 0,0 62,120" fill="none" stroke="white" strokeWidth="1.5" />
      <path d="M38,30 A12,12 0 0,1 62,30" fill="none" stroke="white" strokeWidth="1.5" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Reusable SoccerField component (desktop now uses this)
// Owns ref, sensors, drag math; parent owns data/state.
// ─────────────────────────────────────────────────────────────────────────────
function SoccerField({
  positions,
  setPositions,
  selectedId,
  setSelectedId,
  hoveredId,
  setHoveredId,
  manager,
  isEmphasized, // optional
  onDragStart,  // optional
  onDragEnd,    // optional
}) {
  const fieldRef = React.useRef(null);
  const dragStartRef = React.useRef({}); // { [id]: { x, y } }

  // dnd-kit sensors: small threshold to avoid accidental drags
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const emphasize = isEmphasized || ((id) => id === selectedId || id === hoveredId);

  function handleDragStartInternal(event) {
    const id = event.active?.id;
    if (!id) return;
    const p = positions.find((pp) => pp.id === id);
    if (p) dragStartRef.current[id] = { x: p.x, y: p.y };
    onDragStart?.(event);
  }

  function handleDragEndInternal(event) {
    const { active, delta } = event;
    if (!active?.id) return;
    const box = fieldRef.current?.getBoundingClientRect();
    if (!box || box.width <= 0 || box.height <= 0) return; // safety for hidden/zero-size

    const start = dragStartRef.current[active.id] || { x: 50, y: 50 };
    const dxPct = (delta.x / box.width) * 100;
    const dyPct = (delta.y / box.height) * 100;

    const clamp = (v) => Math.max(2, Math.min(98, v));
    const x = clamp(start.x + dxPct);
    const y = clamp(start.y + dyPct);

    setPositions((prev) => prev.map((p) => (p.id === active.id ? { ...p, x, y } : p)));

    delete dragStartRef.current[active.id];
    onDragEnd?.(event);
  }

  return (
    <section className="rounded-3xl overflow-hidden shadow-xl ring-1 ring-white/10 bg-zinc-800/40 backdrop-blur">
      <div
        ref={fieldRef}
        className="relative select-none touch-none w-full"
        style={{ willChange: "transform", aspectRatio: "2 / 3" }}
        onMouseMove={(e) => {
          const el = e.target.closest?.("[data-id]");
          setHoveredId?.(el?.dataset?.id || null);
        }}
        onMouseLeave={() => setHoveredId?.(null)}
      >
        {/* Grass */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-green-700" />
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`absolute inset-y-0 w-[8.5%] ${i % 2 === 0 ? "bg-green-600/50" : "bg-transparent"}`}
              style={{ left: `${i * 8.5}%` }}
            />
          ))}
        </div>

        {/* Lines */}
        <FieldMarkings />

        {/* Manager chip */}
        <button
          className={`absolute -translate-x-1/2 -translate-y-1/2 transition ${
            emphasize(manager.id) ? "ring-4 ring-yellow-400/80 rounded-full" : ""
          }`}
          style={{ left: `${manager.x}%`, top: `${manager.y}%` }}
          data-id={manager.id}
          onClick={() => {setSelectedId(manager.id)}}
          onMouseEnter={() => setHoveredId?.(manager.id)}
          onMouseLeave={() => setHoveredId?.(null)}
          title={manager.label}
          aria-label={manager.label}
        >
          <div className="relative">
            <div className={`h-7 px-2 ${manager.color} rounded-full ring-2 ring-white shadow-lg text-xs text-white flex items-center gap-1`}>
              <span>{manager.icon}</span>
              <span>{manager.badge}</span>
            </div>
          </div>
        </button>

        {/* DnD */}
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStartInternal}
          onDragEnd={handleDragEndInternal}
          modifiers={[restrictToParentElement]}
        >
          {positions.map((p) => (
            <PlayerDot
              key={p.id}
              id={p.id}
              xPct={p.x}
              yPct={p.y}
              label={p.label}
              badge={p.badge}
              icon={p.icon}
              logo={p.logo}
              color={p.color}
              emphasized={emphasize(p.id)}
              onClick={() => {setSelectedId(p.id)}}
            />
          ))}
        </DndContext>

        {/* Helper */}
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/40 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md">
          Drag a dot to reposition
        </div>
      </div>
    </section>
  );
}



  function useIsDesktop() {
    const [isDesktop, setIsDesktop] = useState(() =>
      typeof window !== "undefined"
        ? window.matchMedia("(min-width: 768px)").matches
        : false
    );
    useEffect(() => {
      const mql = window.matchMedia("(min-width: 768px)");
      const onChange = (e) => setIsDesktop(e.matches);
      // Safari support
      if (mql.addEventListener) mql.addEventListener("change", onChange);
      else mql.addListener(onChange);
      return () => {
        if (mql.removeEventListener) mql.removeEventListener("change", onChange);
        else mql.removeListener(onChange);
      };
    }, []);
    return isDesktop;
  }