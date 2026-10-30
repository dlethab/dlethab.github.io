// Penalty best score, shared between the shootout and the header HUD.
import { useSyncExternalStore } from "react";

const KEY = "dh-penalty-best";
const EVENT = "dh-best";

export const getBest = () => Number(localStorage.getItem(KEY) || 0);

export function saveBest(score) {
  const best = Math.max(getBest(), score);
  localStorage.setItem(KEY, String(best));
  window.dispatchEvent(new Event(EVENT));
  return best;
}

export function useBest() {
  return useSyncExternalStore((cb) => {
    window.addEventListener(EVENT, cb);
    return () => window.removeEventListener(EVENT, cb);
  }, getBest);
}
