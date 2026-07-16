import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

type Props = {
  onClose: () => void;
};

export default function MonitorPopup({ onClose }: Props) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          onClick={(event) => event.stopPropagation()}
          className="w-full max-w-[800px] rounded-2xl border border-cyan-500/70 bg-black/95 p-8 shadow-[0_0_40px_#06b6d4]"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-cyan-400">
              ACCESS TERMINAL
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-red-500/30 px-3 py-1 text-xl text-red-400 transition hover:bg-red-500/10"
              aria-label="Close terminal"
            >
              ✕
            </button>
          </div>

          <div className="mt-8 space-y-4 font-mono text-green-400">
            <p>{"> ACCESSING SERVER..."}</p>
            <p>{"> USER : admin"}</p>
            <p>{"> FAILED LOGIN ATTEMPTS : 7"}</p>
            <p>{"> Suspicious IP Found :"}</p>
            <p className="text-cyan-300">192.168.10.44</p>

            <br />

            <p className="text-yellow-300">CLUE :</p>
            <p>"The attacker left traces in the authentication server."</p>
            <p className="text-cyan-400">Evidence Added ✓</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}