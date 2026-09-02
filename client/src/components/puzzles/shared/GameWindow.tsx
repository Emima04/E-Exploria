import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";
import { X } from "lucide-react";

interface GameWindowProps {
  open: boolean;
  title: string;
  subtitle?: string;
  icon?: unknown;
  onClose: () => void;
  children: ReactNode;
}

export default function GameWindow({
  open,
  onClose,
  children,
}: GameWindowProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/60
            backdrop-blur-sm
          "
        >

          {/* =====================================================
              IMMERSIVE GAME WINDOW

              This is intentionally just a shell around the
              actual puzzle. No second application header/footer.
              ===================================================== */}

          <motion.div
            initial={{
              scale: 0.96,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            exit={{
              scale: 0.98,
              opacity: 0,
            }}
            transition={{
              duration: 0.22,
            }}
            className="
              relative
              flex
              h-[94vh]
              w-[97vw]
              max-w-[1600px]
              overflow-hidden
              rounded-2xl
              border
              border-purple-400/20
              bg-[#05060c]
              shadow-[0_0_80px_rgba(168,85,247,0.10)]
            "
          >

            {/* =================================================
                CLOSE BUTTON

                Floating so it doesn't create another header.
                ================================================= */}

            <button
              onClick={onClose}
              aria-label="Close interaction window"
              className="
                absolute
                right-4
                top-4
                z-[60]
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                border
                border-white/10
                bg-black/40
                text-zinc-500
                backdrop-blur-md
                transition
                hover:border-red-400/30
                hover:bg-red-500/10
                hover:text-red-300
              "
            >
              <X size={17} />
            </button>


            {/* =================================================
                PUZZLE CONTENT

                The puzzle owns its own internal layout,
                scrolling and screens.

                No padding is added here so MonitorPuzzle can
                use the entire available area.
                ================================================= */}

            <div
              className="
                flex
                min-h-0
                w-full
                flex-1
                overflow-hidden
              "
            >
              {children}
            </div>

          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}