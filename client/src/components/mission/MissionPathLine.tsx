import { motion } from "framer-motion";

export default function MissionPathLine() {
  return (
    <svg
      className="
        absolute
        inset-0
        w-full
        h-full
        z-10
        pointer-events-none
      "
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <motion.path
        d="
          M30 82
          C45 78 50 72 58 70
          C70 66 55 56 38 55
          C25 52 45 42 65 40
          C80 37 60 28 45 25
        "
        fill="none"
        stroke="#22d3ee"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeDasharray="2 2"
        animate={{
          strokeDashoffset: [20, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </svg>
  );
}