import { motion } from "framer-motion";
import { Lock } from "lucide-react";

interface MissionNodeProps {
  number: number;
  x: number;
  y: number;
  unlocked: boolean;
  onClick: () => void;
}

export default function MissionNode({
  number,
  x,
  y,
  unlocked,
  onClick,
}: MissionNodeProps) {
  return (
    <div
      className="absolute z-20"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <motion.div
        onClick={unlocked ? onClick : undefined}
        whileHover={{
          scale: unlocked ? 1.12 : 1,
        }}
        className={`
          relative
          w-[58px]
          h-[58px]
          flex
          items-center
          justify-center
          ${unlocked ? "cursor-pointer" : "cursor-not-allowed"}
        `}
      >

        {unlocked && (
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
            className="
              absolute
              inset-0
              rounded-full
              border-2
              border-dashed
              border-cyan-300/80
            "
          />
        )}

        <div
          className={`
            absolute
            inset-1
            rounded-full
            blur-xl
            ${unlocked ? "bg-cyan-400/50" : "bg-cyan-900/20"}
          `}
        />

        <div
          className={`
            relative
            w-[46px]
            h-[46px]
            rounded-full
            flex
            items-center
            justify-center
            border-2
            backdrop-blur-xl

            ${
              unlocked
                ? `
                bg-cyan-400/25
                border-cyan-200
                shadow-[0_0_22px_#22d3ee]
                `
                : `
                bg-black/70
                border-cyan-700/60
                shadow-[0_0_12px_rgba(34,211,238,0.3)]
                `
            }
          `}
        >

          <div
            className="
              absolute
              inset-2
              rounded-full
              border
              border-cyan-300/40
            "
          />

          {unlocked ? (
            <span
              className="
                text-base
                font-black
                text-white
                drop-shadow-[0_0_8px_#22d3ee]
              "
            >
              {number.toString().padStart(2, "0")}
            </span>
          ) : (
            <Lock
              size={18}
              className="
                text-cyan-300
                drop-shadow-[0_0_8px_#22d3ee]
              "
            />
          )}

        </div>

      </motion.div>

    </div>
  );
}