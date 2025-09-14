import React, { useMemo, useRef, useState } from "react";
import {
  DndContext,
  //DragOverlay,
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

/**
 * Desktop layout: Football Manager style
 * - 3-column grid: Field | Selected Player | Depth Chart
 * - Hover/select highlights on field + depth chart
 */
export default function SoccerFieldProfile({ title = "My Lineup" }) {
  const [currentFormation, setCurrentFormation] = useState("4-3-3");
  const [positions, setPositions] = useState(formation433.map((p) => ({ ...p })));
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [activeId, setActiveId] = useState(null);

  const fieldRef = useRef(null);
  const dragStartRef = useRef({}); // { [id]: { x, y } }

  // DnD sensors — tiny delay & tolerance reduce accidental drags
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 2 } })
    //useSensor(PointerSensor, { activationConstraint: { delay: 120, tolerance: 6 } })
  );

  const isEmphasized = (id) => id === selectedId || id === hoveredId;

  // Selected (or manager if selected)
  const selected = useMemo(() => {
    const hit = positions.find((p) => p.id === selectedId);
    if (hit) return hit;
    if (manager.id === selectedId) return manager;
    return null;
  }, [positions, selectedId]);

  /* was used in old broken dragging system
  const activeItem = useMemo(
    () => positions.find((p) => p.id === activeId) || null,
    [positions, activeId]
  );
  */

  function loadFormation(name) {
    let preset = formation433;
    if (name === "4-4-2") preset = formation442;
    if (name === "4-2-3-1") preset = formation4231;
    setCurrentFormation(name);
    setPositions(preset.map((p) => ({ ...p })));
    setSelectedId(null);
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
      "lb-nsbe-leadership",
      "lcb-hackny",
      "rcb-temp-org",
      "rb-temp-org",
      "gk-temp-award",
      "bench-observability",
      "bench-web",
      "bench-cloud",
      "bench-temp-1",
      "bench-temp-2",
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
        {/* Formation Selector */}
        <section className="rounded-3xl border border-white/10 bg-zinc-800/40 backdrop-blur px-4 py-3">
            <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold tracking-wide uppercase text-zinc-300">
                Formation
            </h2>
            <div className="flex items-center gap-2">
                {["4-3-3", "4-2-3-1", "4-4-2"].map((f) => {
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
                <span className="mx-1 text-zinc-500">·</span>
                <button
                onClick={() => loadFormation(currentFormation)}
                className="px-2 py-1.5 rounded-md text-sm bg-zinc-700 hover:bg-zinc-600"
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
                    color={p.color}
                    emphasized={isEmphasized(p.id)}
                    onClick={() => setSelectedId(p.id)}
                />
                ))}

            </DndContext>

            {/* Helper bubble */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/40 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md">
                Drag a dot to reposition →
            </div>
            </div>
        </section>
        </div>


        {/* Selected Player Deep Info */}
        <section className="rounded-3xl border border-white/10 bg-zinc-800/40 backdrop-blur p-4 flex flex-col gap-3">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-zinc-300">Selected Player</h2>
          {selected ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${selected.color ?? "bg-indigo-500"}`} />
                <span className="text-lg font-medium">{selected.label}</span>
              </div>
              <div className="text-sm text-zinc-200 whitespace-pre-wrap">{selected.details}</div>
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
                <a href={selected.href} className="inline-flex items-center gap-2 text-indigo-300 hover:text-indigo-200 underline">
                  Learn more ↗
                </a>
              )}
            </div>
          ) : (
            <div className="text-sm text-zinc-400">Select a dot on the field to see full details, dates, and tools.</div>
          )}
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
                  className={`w-full text-left px-2 py-1 rounded-lg flex items-center gap-2 transition
                    ${active ? "bg-white/10 ring-1 ring-yellow-400" : "hover:bg-white/5"}`}
                  onClick={() => onSelect(p.id)}
                  onMouseEnter={() => onHover(p.id)}
                  onMouseLeave={() => onHover(null)}
                  onFocus={() => onHover(p.id)}
                  onBlur={() => onHover(null)}
                  title={p.details}
                  aria-current={active ? "true" : "false"}
                >
                  <span className={`h-2 w-2 rounded-full ${p.color ?? "bg-indigo-500"}`} />
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
      className="absolute inset-3 rounded-[20px] ring-2 ring-white/90"
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
