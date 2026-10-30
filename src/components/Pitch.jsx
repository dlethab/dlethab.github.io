import { motion, useReducedMotion } from "framer-motion";
import Crest from "./Crest";
import ballImg from "../assets/ball.png";
import { profile } from "../data/content";

function FieldMarkings() {
  return (
    <svg viewBox="0 0 100 150" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
      <g fill="none" stroke="white" strokeWidth="0.8">
        <rect x="3" y="3" width="94" height="144" rx="4" />
        <line x1="3" y1="75" x2="97" y2="75" />
        <circle cx="50" cy="75" r="13" />
        {/* top box */}
        <rect x="20.5" y="3" width="59" height="23.6" />
        <rect x="36.5" y="3" width="27" height="7.9" />
        <path d="M39.05 26.6 A13.5 13.5 0 0 0 60.95 26.6" />
        {/* bottom box */}
        <rect x="20.5" y="123.4" width="59" height="23.6" />
        <rect x="36.5" y="139.1" width="27" height="7.9" />
        <path d="M39.05 123.4 A13.5 13.5 0 0 1 60.95 123.4" />
      </g>
      <circle cx="50" cy="18.7" r="0.8" fill="white" />
      <circle cx="50" cy="131.3" r="0.8" fill="white" />
    </svg>
  );
}

function PlayerDot({ player, selected, onSelect, delay, animate }) {
  return (
    <div
      className={`absolute -translate-x-1/2 -translate-y-1/2 ${selected ? "z-20" : "z-10"}`}
      style={{ left: `${player.x}%`, top: `${player.y}%` }}
    >
      <motion.button
        type="button"
        onClick={() => onSelect(player.id)}
        aria-label={`${player.pos}: ${player.name}`}
        aria-pressed={selected}
        title={player.name}
        className="group relative block rounded-full"
        initial={animate ? { opacity: 0, scale: 0.5 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, type: "spring", stiffness: 400, damping: 24 }}
      >
        {selected && <span className="absolute inset-0 animate-pulseRing rounded-full bg-yellow-400/50 motion-reduce:hidden" />}
        <span
          className={`relative block rounded-full transition-transform duration-150 ${
            selected ? "scale-[1.12] shadow-[0_0_0_3px_rgba(250,204,21,0.9)]" : "shadow-lg group-hover:scale-110"
          }`}
        >
          <Crest player={player} className="h-10 w-10 sm:h-11 sm:w-11" />
        </span>
        <span
          className={`absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-1.5 py-0.5 text-[10px] ${
            selected ? "bg-yellow-500 text-black" : "bg-black/60 text-white"
          }`}
        >
          {player.pos}
        </span>
        {player.captain && (
          <span className="absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-yellow-400 text-[9px] font-bold text-black ring-1 ring-white">
            C
          </span>
        )}
      </motion.button>
    </div>
  );
}

export default function Pitch({ players, selectedId, onSelect, onManager, onBall, revealed }) {
  const reduce = useReducedMotion();
  const animate = revealed && !reduce;
  const managerActive = selectedId === profile.id;

  return (
    <section className="overflow-hidden rounded-3xl bg-zinc-800/40 shadow-xl ring-1 ring-white/10 backdrop-blur">
      <div className="relative aspect-[2/3] select-none">
        {/* grass stripes */}
        <div className="absolute inset-0 bg-green-700" />
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={`absolute inset-y-0 w-[8.5%] ${i % 2 === 0 ? "bg-green-600/50" : ""}`}
            style={{ left: `${i * 8.5}%` }}
          />
        ))}
        <FieldMarkings />

        {/* manager chip */}
        <button
          type="button"
          onClick={onManager}
          className={`absolute right-[5%] top-[4%] z-10 flex h-7 items-center gap-1 rounded-full bg-slate-800 px-2 text-xs text-white shadow-lg ring-2 ring-white transition ${
            managerActive ? "ring-4 ring-yellow-400/80" : "hover:scale-105"
          }`}
        >
          <span aria-hidden>🧑‍💼</span>
          <span>MANAGER</span>
        </button>

        {/* centre-spot ball opens the penalty game */}
        <div className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2">
          <motion.button
            type="button"
            onClick={onBall}
            aria-label="Take a penalty"
            title="Take a penalty"
            className="group block rounded-full"
            initial={animate ? { opacity: 0, y: -40 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: animate ? 0.8 : 0, type: "spring", stiffness: 300, damping: 14 }}
          >
            <img
              src={ballImg}
              alt=""
              draggable={false}
              className="h-6 w-6 drop-shadow transition-transform duration-500 group-hover:rotate-[200deg] group-hover:scale-125"
            />
          </motion.button>
        </div>

        {players.map((p, i) => (
          <PlayerDot
            key={p.id}
            player={p}
            selected={p.id === selectedId}
            onSelect={onSelect}
            animate={animate}
            delay={animate ? 0.1 + i * 0.05 : 0}
          />
        ))}

        {/* helper bubble */}
        <div className="pointer-events-none absolute left-[5%] top-[4%] whitespace-nowrap rounded-full bg-black/40 px-3 py-1 text-xs text-white backdrop-blur-md">
          Click a player to see details
        </div>
      </div>
    </section>
  );
}
