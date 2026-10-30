import { motion } from "framer-motion";
import Crest from "./Crest";
import { reserves } from "../data/content";
import { CloseIcon } from "./Icons";

export default function ReservesDrawer({ onSelect, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex touch-none items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Reserves"
        className="w-full max-w-md touch-auto rounded-t-3xl border border-white/10 bg-zinc-800/95 p-5 text-zinc-100 shadow-xl backdrop-blur sm:m-4 sm:rounded-3xl"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 34 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-300">Reserves</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
          >
            <CloseIcon />
          </button>
        </div>
        <ul className="mt-4 space-y-1.5">
          {reserves.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => onSelect(p.id)}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-white/5"
              >
                <Crest player={p} className="h-9 w-9" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-zinc-100">{p.name}</span>
                  <span className="block truncate text-xs text-zinc-400">
                    {p.role} · {p.dates}
                  </span>
                </span>
                <span className="rounded-full bg-black/50 px-1.5 py-0.5 text-[10px] text-white">RES</span>
              </button>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}
