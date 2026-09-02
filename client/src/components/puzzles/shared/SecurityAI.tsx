import { motion } from "framer-motion";

interface SecurityAIProps {
  size?: "small" | "medium" | "large";
}

const SIZES = {
  small: {
    wrapper: "h-20 w-20",
    face: "h-11 w-11",
    eye: "h-2.5 w-2.5",
  },

  medium: {
    wrapper: "h-28 w-28",
    face: "h-16 w-16",
    eye: "h-3 w-3",
  },

  large: {
    wrapper: "h-36 w-36",
    face: "h-20 w-20",
    eye: "h-3.5 w-3.5",
  },
};

export default function SecurityAI({
  size = "medium",
}: SecurityAIProps) {
  const dimensions = SIZES[size];

  /*
   * The AI has its own endless holographic color cycle.
   *
   * Cyan is intentionally excluded so the AI contrasts
   * with the cyan-heavy Cyber Room interface.
   */

  const hologramColors = [
    "#c084fc", // purple
    "#f472b6", // pink
    "#e769fb", // magenta
    "#fb7185", // red
    "#fb923c", // orange
    "#facc15", // yellow
    "#637def", // blue
    "#8cfc84", // green
  ];

  return (
    <motion.div
      className={`
        relative
        flex
        ${dimensions.wrapper}
        items-center
        justify-center
      `}
      animate={{
        y: [-2, 2, -2],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* =====================================================
          OUTER HOLOGRAPHIC FIELD
          ===================================================== */}

      <motion.div
        className="
          absolute
          inset-0
          rounded-full
          border
        "
        animate={{
          borderColor: hologramColors,
          scale: [0.95, 1.04, 0.95],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          borderColor: {
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          },
          scale: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          },
          opacity: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />

      {/* =====================================================
          SECOND HOLOGRAPHIC RING
          ===================================================== */}

      <motion.div
        className="
          absolute
          inset-3
          rounded-full
          border
        "
        animate={{
          borderColor: hologramColors,
          rotate: [0, 180, 360],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          borderColor: {
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          },
          rotate: {
            duration: 7,
            repeat: Infinity,
            ease: "linear",
          },
          opacity: {
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />

      {/* =====================================================
          THIRD RING
          ===================================================== */}

      <motion.div
        className="
          absolute
          inset-6
          rounded-full
          border
        "
        animate={{
          borderColor: hologramColors,
          scale: [1, 0.9, 1],
          opacity: [0.15, 0.4, 0.15],
        }}
        transition={{
          borderColor: {
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          },
          scale: {
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut",
          },
          opacity: {
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />

      {/* =====================================================
          MOVING HOLOGRAPHIC LIGHT
          ===================================================== */}

      <motion.div
        className="
          absolute
          inset-0
          rounded-full
        "
        animate={{
          background: hologramColors.map(
            (color) =>
              `radial-gradient(circle, ${color}45 0%, transparent 68%)`
          ),
          rotate: [0, 360],
          opacity: [0.3, 0.55, 0.3],
        }}
        transition={{
          background: {
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          },
          rotate: {
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          },
          opacity: {
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      />

      {/* =====================================================
          AI FACE
          ===================================================== */}

      <motion.div
        className={`
          relative
          ${dimensions.face}
          flex
          items-center
          justify-center
          rounded-[28%]
          border-2
        `}
        animate={{
          borderColor: hologramColors,
          backgroundColor: hologramColors.map(
            (color) => `${color}18`
          ),
          boxShadow: hologramColors.map(
            (color) =>
              `0 0 18px ${color}88, inset 0 0 15px ${color}44`
          ),
          scale: [1, 1.025, 1],
        }}
        transition={{
          borderColor: {
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          },
          backgroundColor: {
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          },
          boxShadow: {
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          },
          scale: {
            duration: 2.6,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        {/* Inner face outline */}

        <motion.div
          className="
            absolute
            inset-2.5
            rounded-[24%]
            border
          "
          animate={{
            borderColor: hologramColors,
            opacity: [0.2, 0.55, 0.2],
          }}
          transition={{
            borderColor: {
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            },
            opacity: {
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />

        {/* ===================================================
            LEFT EYE
            =================================================== */}

        <motion.span
          className={`
            absolute
            left-[25%]
            top-[34%]
            ${dimensions.eye}
            rounded-full
          `}
          animate={{
            backgroundColor: hologramColors,
            boxShadow: hologramColors.map(
              (color) => `0 0 10px ${color}`
            ),
            scaleY: [1, 1, 0.08, 1, 1],
            opacity: [0.9, 1, 0.12, 1, 0.9],
          }}
          transition={{
            backgroundColor: {
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            },
            boxShadow: {
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            },
            scaleY: {
              duration: 3.7,
              repeat: Infinity,
              times: [0, 0.42, 0.47, 0.52, 1],
              ease: "easeInOut",
            },
            opacity: {
              duration: 3.7,
              repeat: Infinity,
              times: [0, 0.42, 0.47, 0.52, 1],
              ease: "easeInOut",
            },
          }}
        />

        {/* ===================================================
            RIGHT EYE
            =================================================== */}

        <motion.span
          className={`
            absolute
            right-[25%]
            top-[34%]
            ${dimensions.eye}
            rounded-full
          `}
          animate={{
            backgroundColor: hologramColors,
            boxShadow: hologramColors.map(
              (color) => `0 0 10px ${color}`
            ),
            scaleY: [1, 1, 0.08, 1, 1],
            opacity: [1, 0.9, 0.12, 1, 1],
          }}
          transition={{
            backgroundColor: {
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            },
            boxShadow: {
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            },
            scaleY: {
              duration: 3.7,
              delay: 0.08,
              repeat: Infinity,
              times: [0, 0.42, 0.47, 0.52, 1],
              ease: "easeInOut",
            },
            opacity: {
              duration: 3.7,
              delay: 0.08,
              repeat: Infinity,
              times: [0, 0.42, 0.47, 0.52, 1],
              ease: "easeInOut",
            },
          }}
        />

        {/* ===================================================
            FLOATING DATA DOTS
            =================================================== */}

        <motion.span
          className="
            absolute
            -left-2
            top-1/3
            h-1
            w-1
            rounded-full
          "
          animate={{
            backgroundColor: hologramColors,
            x: [0, 7, 0],
            y: [0, -8, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            backgroundColor: {
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            },
            x: {
              duration: 2.4,
              repeat: Infinity,
            },
            y: {
              duration: 2.4,
              repeat: Infinity,
            },
            opacity: {
              duration: 2.4,
              repeat: Infinity,
            },
          }}
        />

        <motion.span
          className="
            absolute
            -right-2
            top-1/2
            h-1.5
            w-1.5
            rounded-full
          "
          animate={{
            backgroundColor: hologramColors,
            x: [0, -7, 0],
            y: [0, 7, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            backgroundColor: {
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            },
            x: {
              duration: 2.7,
              repeat: Infinity,
              delay: 0.4,
            },
            y: {
              duration: 2.7,
              repeat: Infinity,
              delay: 0.4,
            },
            opacity: {
              duration: 2.7,
              repeat: Infinity,
              delay: 0.4,
            },
          }}
        />
      </motion.div>
    </motion.div>
  );
}