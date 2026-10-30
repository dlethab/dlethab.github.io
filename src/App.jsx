import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, animate, motion, useMotionValue } from "framer-motion";
import Header from "./components/Header";
import Pitch from "./components/Pitch";
import PlayerCard, { DepthChart } from "./components/PlayerCard";
import ArchiveDrawer from "./components/ArchiveDrawer";
import PenaltyGame from "./components/PenaltyGame";
import KickoffIntro from "./components/KickoffIntro";
import { ArchiveIcon, BallIcon, CloseIcon } from "./components/Icons";
import { allPlayers, profile, squad } from "./data/content";
import { play } from "./lib/sound";

const ORDER = [profile.id, ...allPlayers.map((p) => p.id)];
const BY_ID = Object.fromEntries([[profile.id, profile], ...allPlayers.map((p) => [p.id, p])]);
const INTRO_KEY = "dh-intro-seen";

function useMediaQuery(query) {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches
  );
}

// Freeze the page behind overlays (position: fixed is what actually stops iOS Safari scrolling).
function useScrollLock(locked) {
  useEffect(() => {
    if (!locked) return;
    const y = window.scrollY;
    const s = document.body.style;
    const prev = { position: s.position, top: s.top, width: s.width, overflow: s.overflow };
    Object.assign(s, { position: "fixed", top: `-${y}px`, width: "100%", overflow: "hidden" });
    return () => {
      Object.assign(s, prev);
      window.scrollTo(0, y);
    };
  }, [locked]);
}

// Bottom sheet for player cards on mobile. Swipe down anywhere on it to close: if the card is
// scrolled, the swipe scrolls it back to the top first, then pulls the sheet down.
function MobileSheet({ children, onClose }) {
  const sheetRef = useRef(null);
  const scrollRef = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const y = useMotionValue(0);

  useEffect(() => {
    const sheet = sheetRef.current;
    let startY = 0;
    let lastY = 0;
    let lastT = 0;
    let velocity = 0;
    let dragging = false;

    const onStart = (e) => {
      startY = lastY = e.touches[0].clientY;
      lastT = e.timeStamp;
      velocity = 0;
      dragging = false;
    };

    const onMove = (e) => {
      const cy = e.touches[0].clientY;
      const atTop = (scrollRef.current?.scrollTop ?? 0) <= 0;
      if (!dragging && atTop && cy > lastY) {
        dragging = true;
        startY = cy;
      }
      if (dragging) {
        if (e.cancelable) e.preventDefault();
        const dy = cy - startY;
        if (dy < 0) {
          // pushed back past where the drag began: hand the gesture back to scrolling
          dragging = false;
          y.set(0);
        } else {
          y.set(dy);
          const dt = e.timeStamp - lastT;
          if (dt > 0) velocity = ((cy - lastY) / dt) * 1000;
        }
      }
      lastY = cy;
      lastT = e.timeStamp;
    };

    const onEnd = () => {
      if (!dragging) return;
      dragging = false;
      if (y.get() > 110 || velocity > 500) closeRef.current();
      else animate(y, 0, { type: "spring", stiffness: 500, damping: 40 });
    };

    sheet.addEventListener("touchstart", onStart, { passive: true });
    sheet.addEventListener("touchmove", onMove, { passive: false });
    sheet.addEventListener("touchend", onEnd);
    sheet.addEventListener("touchcancel", onEnd);
    return () => {
      sheet.removeEventListener("touchstart", onStart);
      sheet.removeEventListener("touchmove", onMove);
      sheet.removeEventListener("touchend", onEnd);
      sheet.removeEventListener("touchcancel", onEnd);
    };
  }, [y]);

  return (
    <>
      <motion.div
        className="fixed inset-0 z-40 touch-none bg-black/60 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        className="fixed inset-x-0 bottom-0 z-40 flex max-h-[88dvh] flex-col rounded-t-3xl border-t border-white/10 bg-zinc-800 text-zinc-100 shadow-xl"
        style={{ y }}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 420, damping: 40 }}
      >
        <div className="relative flex shrink-0 justify-center pb-2 pt-3">
          <span className="h-1.5 w-12 rounded-full bg-white/30" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-3 z-10 grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
          >
            <CloseIcon width={16} height={16} />
          </button>
        </div>
        <div ref={scrollRef} className="overflow-y-auto overscroll-contain px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          {children}
        </div>
      </motion.div>
    </>
  );
}

function MenuTab({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg text-sm transition ${
        active ? "bg-white/10 ring-1 ring-yellow-400" : "bg-white/5 hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}

export default function App() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [selectedId, setSelectedId] = useState(profile.id);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [penaltyOpen, setPenaltyOpen] = useState(false);
  const [intro, setIntro] = useState(() => !sessionStorage.getItem(INTRO_KEY));

  const selected = BY_ID[selectedId];
  const sheetOpen = !isDesktop && selectedId !== profile.id;
  const overlayOpen = intro || archiveOpen || penaltyOpen;
  useScrollLock(overlayOpen || sheetOpen);

  const select = useCallback((id) => {
    setSelectedId(id);
    setArchiveOpen(false);
    play("select");
  }, []);

  const step = useCallback(
    (dir) => {
      const i = ORDER.indexOf(selectedId);
      select(ORDER[(i + dir + ORDER.length) % ORDER.length]);
    },
    [selectedId, select]
  );

  const endIntro = useCallback(() => {
    sessionStorage.setItem(INTRO_KEY, "1");
    setIntro(false);
    play("whistle");
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (archiveOpen && e.key === "Escape") return setArchiveOpen(false);
      if (overlayOpen) return;
      if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "Escape") select(profile.id);
      else if (e.key.toLowerCase() === "p") setPenaltyOpen(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [overlayOpen, archiveOpen, step, select]);

  const card = useMemo(
    () => (
      <PlayerCard
        player={selected}
        onSelect={select}
        onPrev={() => step(-1)}
        onNext={() => step(1)}
        onArchive={() => setArchiveOpen(true)}
      />
    ),
    [selected, select, step]
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-zinc-900 text-zinc-100">
      <Header onHome={() => select(profile.id)} />

      <main className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-[minmax(0,1fr)] items-start gap-6 p-4 lg:grid-cols-[1.4fr_1fr_0.9fr] lg:p-6">
        {/* field column */}
        <div
          className="mx-auto flex w-full max-w-[520px] flex-col gap-4"
          style={isDesktop ? { maxWidth: "max(340px, calc((100vh - 230px) * 2 / 3))" } : undefined}
        >
          <section className="rounded-3xl border border-white/10 bg-zinc-800/40 px-4 py-3 backdrop-blur">
            <div className="grid grid-cols-3 gap-2">
              <MenuTab active>Squad</MenuTab>
              <MenuTab onClick={() => setArchiveOpen(true)}>
                <ArchiveIcon width={15} height={15} /> Archive
              </MenuTab>
              <MenuTab onClick={() => setPenaltyOpen(true)}>
                <BallIcon width={15} height={15} /> Penalty
              </MenuTab>
            </div>
          </section>

          <Pitch
            key={intro ? "pre" : "live"}
            players={squad}
            selectedId={selectedId}
            onSelect={select}
            onManager={() => select(profile.id)}
            onBall={() => setPenaltyOpen(true)}
            revealed={!intro}
          />

          <p className="hidden text-center text-xs text-zinc-500 lg:block">
            ← → to browse · Esc for manager · P for a penalty
          </p>
        </div>

        {isDesktop ? (
          <>
            {/* selected player column */}
            <section className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto rounded-3xl border border-white/10 bg-zinc-800/40 p-4 backdrop-blur">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={selectedId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                >
                  {card}
                </motion.div>
              </AnimatePresence>
            </section>

            {/* depth chart column */}
            <section className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto rounded-3xl border border-white/10 bg-zinc-800/40 p-4 backdrop-blur">
              <DepthChart selectedId={selectedId} onSelect={select} onArchive={() => setArchiveOpen(true)} />
            </section>
          </>
        ) : (
          <section className="rounded-3xl border border-white/10 bg-zinc-800/40 p-4 backdrop-blur">
            <PlayerCard
              player={profile}
              onSelect={select}
              onPrev={() => step(-1)}
              onNext={() => step(1)}
              onArchive={() => setArchiveOpen(true)}
              withDepth
            />
          </section>
        )}
      </main>

      <AnimatePresence>
        {sheetOpen && (
          <MobileSheet onClose={() => setSelectedId(profile.id)}>
            <div key={selectedId}>{card}</div>
          </MobileSheet>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {archiveOpen && <ArchiveDrawer onSelect={select} onClose={() => setArchiveOpen(false)} />}
      </AnimatePresence>
      <AnimatePresence>{penaltyOpen && <PenaltyGame onClose={() => setPenaltyOpen(false)} />}</AnimatePresence>
      <AnimatePresence>{intro && <KickoffIntro onDone={endIntro} />}</AnimatePresence>
    </div>
  );
}
