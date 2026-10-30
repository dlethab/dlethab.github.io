import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ballImg from "../assets/ball.png";
import { play } from "../lib/sound";
import { CloseIcon } from "./Icons";
import { getBest, saveBest } from "../lib/score";

/*
  Penalty shootout. Everything is laid out in an 800 x 500 "stage" coordinate
  space and converted to percentages, so it scales with the container.

  1. Aim: move / tap / arrow keys to place the crosshair.
  2. Power: stop the swinging meter. The yellow zone is accurate; too soft and
     the keeper reaches it, too hard and it flies off target.
  3. The keeper dives — and learns which side you like.
*/

const SHOTS = 5;
const GOAL = { left: 160, right: 640, top: 110, bottom: 270 };
const SPOT = { x: 400, y: 450 };
const KEEPER_HOME = { x: 400, y: 205, r: 0 };
const SWEET = [0.58, 0.78];

const pct = (x, y) => ({ left: `${x / 8}%`, top: `${y / 5}%` });
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function pickWeighted(weights) {
  const entries = Object.entries(weights).map(([k, w]) => [k, Math.pow(w, 1.5)]);
  let r = Math.random() * entries.reduce((s, [, w]) => s + w, 0);
  for (const [k, w] of entries) if ((r -= w) <= 0) return k;
  return entries[0][0];
}

function keeperDive(side, height) {
  const high = height === "high";
  if (side === "L") return { x: 262, y: high ? 160 : 232, r: high ? -62 : -84 };
  if (side === "R") return { x: 538, y: high ? 160 : 232, r: high ? 62 : 84 };
  return { x: 400, y: high ? 172 : 212, r: 0 };
}

function isSaved(ball, k, side, weak) {
  const [a, b] = side === "C" ? [62, 95] : [100, 58];
  const m = weak ? 1.45 : 1;
  const dx = (ball.x - k.x) / (a * m);
  const dy = (ball.y - k.y) / (b * m);
  return dx * dx + dy * dy <= 1;
}

function Keeper({ pos, idle }) {
  return (
    <div
      className="absolute h-[26%] w-[9%] transition-all duration-[380ms] ease-[cubic-bezier(.2,.8,.3,1)]"
      style={{ ...pct(pos.x, pos.y), transform: `translate(-50%, -50%) rotate(${pos.r}deg)` }}
    >
      <svg viewBox="0 0 72 130" className={`h-full w-full ${idle ? "animate-sway" : ""}`} aria-hidden>
        <line x1="28" y1="88" x2="22" y2="124" stroke="#27272a" strokeWidth="9" strokeLinecap="round" />
        <line x1="44" y1="88" x2="50" y2="124" stroke="#27272a" strokeWidth="9" strokeLinecap="round" />
        <line x1="22" y1="38" x2="6" y2="60" stroke="#facc15" strokeWidth="8" strokeLinecap="round" />
        <line x1="50" y1="38" x2="66" y2="60" stroke="#facc15" strokeWidth="8" strokeLinecap="round" />
        <circle cx="6" cy="62" r="6" fill="#ffffff" />
        <circle cx="66" cy="62" r="6" fill="#ffffff" />
        <rect x="19" y="29" width="34" height="48" rx="10" fill="#facc15" />
        <text x="36" y="62" textAnchor="middle" fontSize="18" fontWeight="700" fill="#1a1400" fontFamily="system-ui, sans-serif">
          1
        </text>
        <rect x="22" y="72" width="28" height="18" rx="5" fill="#18181b" />
        <circle cx="36" cy="16" r="11" fill="#ffffff" />
      </svg>
    </div>
  );
}

function Stage() {
  // static backdrop: stand, striped grass, goal frame and net
  return (
    <svg viewBox="0 0 800 500" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="pg-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#18181b" />
          <stop offset="1" stopColor="#27272a" />
        </linearGradient>
        <pattern id="pg-net" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M0 0 L16 16 M16 0 L0 16" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="800" height="270" fill="url(#pg-sky)" />
      {/* crowd */}
      {Array.from({ length: 4 }).map((_, row) =>
        Array.from({ length: 40 }).map((_, i) => (
          <circle
            key={`${row}-${i}`}
            cx={10 + i * 20 + (row % 2) * 10}
            cy={30 + row * 16}
            r="4"
            fill="#ffffff"
            opacity={0.04 + (((i * 7 + row * 13) % 9) / 9) * 0.08}
          />
        ))
      )}
      {/* grass: same green-700 / green-600 stripes as the field */}
      <rect y="270" width="800" height="230" fill="#15803d" />
      {Array.from({ length: 12 }).map((_, i) =>
        i % 2 === 0 ? <rect key={i} x={i * 68} y="270" width="68" height="230" fill="rgba(22,163,74,0.5)" /> : null
      )}
      <path d="M0 272 H800 M230 272 L190 335 H610 L570 272" stroke="white" strokeWidth="3" fill="none" />
      <ellipse cx={SPOT.x} cy={SPOT.y + 16} rx="9" ry="3" fill="rgba(255,255,255,0.7)" />
      {/* net */}
      <rect x="160" y="110" width="480" height="160" fill="rgba(0,0,0,0.35)" />
      <rect x="160" y="110" width="480" height="160" fill="url(#pg-net)" />
      {/* frame */}
      <path d="M160 272 V110 H640 V272" stroke="#ffffff" strokeWidth="9" fill="none" strokeLinejoin="round" />
    </svg>
  );
}

const VERDICT = {
  goal: { text: "GOAL!", cls: "text-yellow-400" },
  save: { text: "SAVED!", cls: "text-white" },
  post: { text: "OFF THE POST!", cls: "text-white" },
  wide: { text: "WIDE!", cls: "text-zinc-300" },
  over: { text: "OVER THE BAR!", cls: "text-zinc-300" },
};

function endLine(score) {
  if (score === 5) return "Perfect five. Ice in the veins.";
  if (score === 4) return "Clinical. The keeper never stood a chance.";
  if (score === 3) return "Solid shift. Job done.";
  if (score === 2) return "The keeper got in your head.";
  return "Rough day at the office. Run it back?";
}

export default function PenaltyGame({ onClose }) {
  const stageRef = useRef(null);
  const timers = useRef([]);
  const powerRef = useRef(0);
  const resultsRef = useRef([]);
  const history = useRef({ side: { L: 1, C: 1, R: 1 }, height: { high: 1, low: 1 } });

  const [phase, setPhase] = useState("aim"); // aim | power | shot | result | over
  const [aim, setAim] = useState({ x: 400, y: 190 });
  const [power, setPower] = useState(0);
  const [ball, setBall] = useState({ ...SPOT, s: 1, o: 1 });
  const [keeper, setKeeper] = useState(KEEPER_HOME);
  const [results, setResults] = useState([]);
  const [verdict, setVerdict] = useState(null);
  const [best, setBest] = useState(getBest);

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // swinging power meter
  useEffect(() => {
    if (phase !== "power") return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = (now - start) / 1000;
      const p = (1 - Math.cos(t * Math.PI * 1.9)) / 2;
      powerRef.current = p;
      setPower(p);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  const resetShot = useCallback(() => {
    setBall({ ...SPOT, s: 1, o: 1 });
    setKeeper(KEEPER_HOME);
    setVerdict(null);
    setPower(0);
    setPhase("aim");
  }, []);

  const shoot = useCallback(() => {
    const p = powerRef.current;
    setPhase("shot");
    play("kick");

    // accuracy: tight inside the sweet zone, scattered outside it
    const off = p < SWEET[0] ? SWEET[0] - p : p > SWEET[1] ? p - SWEET[1] : 0;
    const err = 6 + off * 150;
    const ang = Math.random() * Math.PI * 2;
    const target = {
      x: aim.x + Math.cos(ang) * err * Math.random(),
      y: aim.y + Math.sin(ang) * err * Math.random() - (p > 0.94 ? 80 : 0),
    };
    const weak = p < 0.35;

    // keeper reads your habits
    const h = history.current;
    const side = pickWeighted(h.side);
    const height = pickWeighted(h.height);
    const userSide = aim.x < 330 ? "L" : aim.x > 470 ? "R" : "C";
    h.side[userSide] += 1;
    h.height[aim.y < 190 ? "high" : "low"] += 1;
    const dive = keeperDive(side, height);

    const inX = target.x > GOAL.left + 5 && target.x < GOAL.right - 5;
    const inY = target.y > GOAL.top + 5 && target.y < GOAL.bottom;
    const nearPost =
      (Math.abs(target.x - GOAL.left) <= 9 || Math.abs(target.x - GOAL.right) <= 9) && target.y > GOAL.top - 9 && target.y < GOAL.bottom;
    const nearBar = Math.abs(target.y - GOAL.top) <= 9 && target.x > GOAL.left - 9 && target.x < GOAL.right + 9;

    let outcome;
    if (nearPost || nearBar) outcome = "post";
    else if (!inX) outcome = "wide";
    else if (!inY) outcome = "over";
    else if (isSaved(target, dive, side, weak)) outcome = "save";
    else outcome = "goal";

    const flight = weak ? 650 : 420;
    setBall({ x: target.x, y: target.y, s: 0.48, o: 1, ms: flight });
    later(() => setKeeper(dive), 60);

    later(() => {
      if (outcome === "save" || outcome === "post") {
        setBall((b) => ({ x: b.x + (b.x < 400 ? -60 : 60), y: 330, s: 0.55, o: 0, ms: 500 }));
      } else if (outcome === "wide" || outcome === "over") {
        setBall((b) => ({ ...b, s: 0.35, o: 0, ms: 400 }));
      }
      setVerdict(outcome);
      play(outcome === "goal" ? "goal" : outcome === "save" ? "save" : "miss");
      setPhase("result");

      const next = [...resultsRef.current, outcome === "goal"];
      resultsRef.current = next;
      setResults(next);
      later(() => {
        if (next.length >= SHOTS) {
          const nb = saveBest(next.filter(Boolean).length);
          setBest(nb);
          setVerdict(null);
          setPhase("over");
        } else {
          resetShot();
        }
      }, 1400);
    }, flight);
  }, [aim, resetShot]);

  const restart = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    resultsRef.current = [];
    setResults([]);
    history.current = { side: { L: 1, C: 1, R: 1 }, height: { high: 1, low: 1 } };
    resetShot();
    play("whistle");
  };

  useEffect(() => play("whistle"), []);

  const toStage = (e) => {
    const r = stageRef.current.getBoundingClientRect();
    return {
      x: clamp(((e.clientX - r.left) / r.width) * 800, 100, 700),
      y: clamp(((e.clientY - r.top) / r.height) * 500, 60, 300),
    };
  };

  const onPointerMove = (e) => {
    if (phase === "aim" && e.pointerType === "mouse") setAim(toStage(e));
  };

  const onPointerDown = (e) => {
    if (phase === "aim") {
      setAim(toStage(e));
      setPhase("power");
    } else if (phase === "power") {
      shoot();
    }
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") return onClose();
      if (phase === "aim") {
        const step = e.shiftKey ? 40 : 18;
        const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
        if (moves[e.key]) {
          e.preventDefault();
          const [dx, dy] = moves[e.key];
          setAim((a) => ({ x: clamp(a.x + dx, 100, 700), y: clamp(a.y + dy, 60, 300) }));
        }
      }
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (phase === "aim") setPhase("power");
        else if (phase === "power") shoot();
        else if (phase === "over") restart();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const score = results.filter(Boolean).length;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 p-4 text-zinc-100 backdrop-blur"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label="Penalty shootout"
    >
      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-zinc-800/60 p-4 backdrop-blur sm:p-5">
        {/* scoreboard */}
        <div className="mb-3 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-300">Penalty Shootout</h2>
            <div className="mt-2 flex items-center gap-1.5">
              {Array.from({ length: SHOTS }).map((_, i) => (
                <span
                  key={i}
                  className={`h-3 w-3 rounded-full ring-1 ${
                    i >= results.length
                      ? "ring-white/20"
                      : results[i]
                        ? "bg-yellow-400 ring-yellow-400"
                        : "bg-white/20 ring-white/30"
                  }`}
                />
              ))}
              <span className="ml-2 text-lg font-semibold text-white">
                {score}
                <span className="text-zinc-500"> / {SHOTS}</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm text-zinc-400">
              Best <span className="font-semibold text-yellow-400">{best}/5</span>
            </p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* stage */}
        <div
          ref={stageRef}
          className={`relative aspect-[8/5] w-full touch-none select-none overflow-hidden rounded-[20px] shadow-xl ring-2 ring-white/90 ${
            phase === "aim" ? "cursor-none" : phase === "power" ? "cursor-pointer" : ""
          }`}
          onPointerMove={onPointerMove}
          onPointerDown={onPointerDown}
        >
          <Stage />
          <Keeper pos={keeper} idle={phase === "aim" || phase === "power"} />

          {(phase === "aim" || phase === "power") && (
            <div className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2" style={pct(aim.x, aim.y)}>
              <div
                className={`h-9 w-9 rounded-full border-2 sm:h-11 sm:w-11 ${
                  phase === "power" ? "border-yellow-400" : "border-yellow-400/80"
                }`}
              >
                <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400" />
              </div>
            </div>
          )}

          <img
            src={ballImg}
            alt=""
            draggable={false}
            className="pointer-events-none absolute w-[5.5%] ease-out"
            style={{
              ...pct(ball.x, ball.y),
              transform: `translate(-50%, -50%) scale(${ball.s}) rotate(${ball.s < 1 ? 540 : 0}deg)`,
              opacity: ball.o,
              transitionProperty: "left, top, transform, opacity",
              transitionDuration: `${ball.ms ?? 0}ms`,
            }}
          />

          {verdict && (
            <motion.p
              key={results.length}
              className={`pointer-events-none absolute inset-x-0 top-[62%] px-2 text-center text-4xl font-extrabold tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] sm:text-6xl ${VERDICT[verdict].cls}`}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 18 }}
            >
              {VERDICT[verdict].text}
            </motion.p>
          )}

          {phase === "over" && (
            <motion.div
              className="absolute inset-0 grid place-items-center bg-zinc-900/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-wide text-zinc-300">Full time</p>
                <p className="mt-1 text-6xl font-bold text-white sm:text-7xl">
                  {score}
                  <span className="text-zinc-500">/{SHOTS}</span>
                </p>
                <p className="mt-2 text-sm text-zinc-300">{endLine(score)}</p>
                <div className="mt-5 flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={restart}
                    className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white ring-1 ring-yellow-400 hover:bg-white/15"
                  >
                    Play again
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg bg-white/5 px-4 py-2 text-sm text-zinc-100 hover:bg-white/10"
                  >
                    Back to the squad
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* power meter + instructions */}
        <div className="mt-4">
          <div className="relative h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="absolute inset-y-0 bg-yellow-400/30"
              style={{ left: `${SWEET[0] * 100}%`, width: `${(SWEET[1] - SWEET[0]) * 100}%` }}
            />
            <div
              className={`absolute inset-y-0 left-0 rounded-full ${
                power >= SWEET[0] && power <= SWEET[1] ? "bg-yellow-400" : "bg-zinc-300"
              }`}
              style={{ width: `${power * 100}%` }}
            />
          </div>
          <p className="mt-3 text-center text-sm text-zinc-400">
            {phase === "aim" && (
              <>
                <span className="text-white">Aim</span> — move and click, or tap where you want to shoot (arrow keys + Space work too)
              </>
            )}
            {phase === "power" && (
              <>
                <span className="text-white">Power</span> — click or press Space in the yellow zone
              </>
            )}
            {(phase === "shot" || phase === "result") && " "}
            {phase === "over" && "Space to play again · Esc to leave"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
