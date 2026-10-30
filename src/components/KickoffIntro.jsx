import { useEffect } from "react";
import { motion } from "framer-motion";
import { profile } from "../data/content";
import ballImg from "../assets/ball.png";

// Short welcome screen. Auto-dismisses; any key / tap skips it.
export default function KickoffIntro({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2400);
    const skip = () => onDone();
    window.addEventListener("keydown", skip);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", skip);
    };
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] grid cursor-pointer place-items-center bg-zinc-900"
      onClick={onDone}
      exit={{ opacity: 0, transition: { duration: 0.35 } }}
    >
      <div className="text-center">
        <motion.img
          src={ballImg}
          alt=""
          className="mx-auto h-14 w-14"
          initial={{ y: -200, rotate: -360 }}
          animate={{ y: 0, rotate: 0 }}
          transition={{ type: "spring", stiffness: 160, damping: 12 }}
        />
        <motion.h1
          className="mt-6 text-3xl font-semibold text-white sm:text-4xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {profile.name}
        </motion.h1>
        <motion.p
          className="mt-2 text-sm uppercase tracking-wide text-zinc-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Welcome to my interactive portfolio
        </motion.p>
        <motion.p
          className="mt-8 text-xs text-zinc-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Tap or press any key
        </motion.p>
      </div>
    </motion.div>
  );
}
