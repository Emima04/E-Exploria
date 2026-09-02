import { motion } from "framer-motion";

interface HotspotProps {
  id: string;

  top: string;
  left: string;

  width: string;
  height: string;

  visible?: boolean;

  onClick: () => void;
}

export default function Hotspot({
  top,
  left,
  width,
  height,
  visible = false,
  onClick,
}: HotspotProps) {
  return (
    <motion.button
      whileTap={{
        scale: 0.98,
      }}
      transition={{
        duration: 0.15,
      }}
      onClick={onClick}
      className="
        absolute
        z-20
        cursor-pointer
        rounded-lg
        overflow-hidden
      "
      style={{
        top,
        left,
        width,
        height,
      }}
    >
      {visible && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 0.08,
          }}
          whileTap={{
            opacity: 0.18,
          }}
          className="
            absolute
            inset-0

            rounded-lg

            bg-cyan-300
          "
        />
      )}
    </motion.button>
  );
}