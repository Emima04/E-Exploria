import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import background from "../../assets/images/home/hero-background.avif";

interface BootOverlayProps {
  show: boolean;
}

const logs = [
  "Authenticating Explorer...",
  "Connecting to Cyber Academy...",
  "Loading Mission Database...",
  "Scanning Digital Environment...",
  "Preparing Escape Room..."
];

export default function BootOverlay({ show }: BootOverlayProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!show) {
      setProgress(0);
      return;
    }

    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= logs.length) {
            clearInterval(interval);
            return prev;
          }

          return prev + 1;
        });
      }, 1300);

      return () => clearInterval(interval);
    }, 1400);

    return () => clearTimeout(timeout);
  }, [show]);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="fixed inset-0 z-[9999] overflow-hidden flex items-center justify-center"
    >
      {/* Background */}

      <motion.img
        src={background}
        alt=""
        initial={{ scale: 1.12 }}
        animate={{ scale: 1.24 }}
        transition={{
          duration: 10,
          ease: "easeInOut"
        }}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Overlay */}

      <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" />

      {/* Content */}

      <div className="relative z-10 w-full max-w-4xl text-center px-10">

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.7,
            duration: 0.8
          }}
          className="text-cyan-300 text-2xl font-mono tracking-[0.25em]"
        >
          Initializing World...
        </motion.p>

        {/* Square Progress Loader */}

        <div className="flex justify-center gap-4 mt-16">

          {logs.map((_, index) => (

            <motion.div
              key={index}
              animate={
                progress === index + 1
                  ? {
                      scale: [1, 1.2, 1]
                    }
                  : {}
              }
              transition={{
                duration: 0.4
              }}
              className={`
                w-9
                h-9
                rounded-sm
                border
                transition-all
                duration-700
                ${
                  progress > index
                    ? "bg-cyan-400 border-cyan-300 shadow-[0_0_18px_#22d3ee]"
                    : "bg-zinc-800 border-zinc-600"
                }
              `}
            />

          ))}

        </div>

        {/* Current Status */}

        <motion.p
          key={progress}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-14 text-cyan-200 text-xl font-mono"
        >
          {progress === 0
            ? "Preparing Interface..."
            : progress === logs.length
            ? "Cyber Guide Online"
            : logs[progress - 1]}
        </motion.p>

        {/* Completed Logs */}

        <div className="mt-16 max-w-xl mx-auto text-left space-y-3">

          {logs.slice(0, progress).map((item, index) => (

            <motion.p
              key={index}
              initial={{
                opacity: 0,
                x: -15
              }}
              animate={{
                opacity: 1,
                x: 0
              }}
              className="text-green-400 font-mono"
            >
              ✓ {item}
            </motion.p>

          ))}

          {progress === logs.length && (

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-10 text-center"
            >
              <p className="text-cyan-300 text-2xl font-semibold">
                Cyber Guide
              </p>

              <p className="mt-3 text-zinc-300 text-lg">
                Welcome, Explorer.
              </p>
            </motion.div>

          )}

        </div>

      </div>

    </motion.div>
  );
}