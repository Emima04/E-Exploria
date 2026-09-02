import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function MissionDrawer({
  open,
  onClose,
}: Props) {
    const navigate = useNavigate();
  return (
    <AnimatePresence>

      {open && (

        <motion.div
          initial={{
            x: 350,
            opacity: 0,
          }}
          animate={{
            x: 0,
            opacity: 1,
          }}
          exit={{
            x: 350,
            opacity: 0,
          }}
          transition={{
            duration: 0.4,
          }}

          className="
            absolute

            right-8
            top-24

            z-50

            w-[310px]

            rounded-2xl

            bg-black/60
            backdrop-blur-xl

            border
            border-cyan-400/40

            p-5

            shadow-[0_0_35px_rgba(34,211,238,0.25)]
          "
        >


          <button
            onClick={onClose}

            className="
              absolute
              right-4
              top-4

              text-cyan-300
            "
          >

            <X size={18}/>

          </button>



          <p
            className="
              tracking-[0.3em]
              text-cyan-300
              text-xs
            "
          >
            MISSION 01
          </p>



          <h2
            className="
              text-white

              text-3xl

              font-black

              mt-3
            "
          >

            Database Breach

          </h2>



          <p
            className="
              text-zinc-300

              mt-4

              leading-6

              text-sm
            "
          >

            The academy database firewall has been compromised.

            Trace the vulnerability and restore access.

          </p>



          <div
            className="
              mt-6

              space-y-2

              text-sm

              text-cyan-100
            "
          >

            <p>
              Difficulty : Beginner
            </p>

            <p>
              Concept : SQL Basics
            </p>

            <p>
              Reward : +100 XP
            </p>

          </div>



         <button
                onClick={() => navigate("/cyber-room")}

                className="
                    mt-7
                    w-full
                    py-3
                    rounded-xl
                    bg-cyan-400
                    text-black
                    text-sm
                    font-bold
                "
                >

                ENTER MISSION

            </button>

        </motion.div>

      )}

    </AnimatePresence>
  );
}