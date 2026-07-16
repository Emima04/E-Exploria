import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import background from "../assets/images/cyber/background.png";
import AccessTerminalModal from "./AccessTerminalModal";
import { useLocation } from "react-router-dom";

export default function CyberRoom() {
  const location = useLocation();
  const [showMonitor, setShowMonitor] = useState(false);
  const [incomingDomain, setIncomingDomain] = useState<string | null>(null);

  useEffect(() => {
    const state: any = location.state;
    if (state && state.selectedDomain) {
      setIncomingDomain(state.selectedDomain || "HTML5");
      setShowMonitor(true);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">

      {/* Background */}

      <img
        src={background}
        alt="Cyber Room"
        className="w-full h-screen object-cover"
      />
      {/* Monitor Hotspot */}

      <motion.button
        type="button"
        onClick={() => setShowMonitor(true)}
        aria-label="Open access terminal"
        whileHover={{ scale: 1.01, boxShadow: "0 0 35px rgba(34, 211, 238, 0.6)" }}
        whileTap={{ scale: 0.98 }}
        className="
          absolute z-20
          bg-cyan-500/10
          border border-cyan-400/50
          hover:bg-cyan-500/20
          hover:border-cyan-400
          hover:shadow-[0_0_30px_#06b6d4]
          transition-all
          duration-300
          cursor-pointer
          rounded-xl
        "
        style={{
          top: "18.7%",
          left: "40.5%",
          width: "19.1%",
          height: "18.3%",
        }}
      />



      {/* Mission */}

      <div className="absolute top-7 left-7 bg-black/65 backdrop-blur-md border border-cyan-500 rounded-3xl p-6 w-[350px]">

        <h1 className="text-cyan-400 text-4xl font-bold">
          Cyber Investigation
        </h1>

        <p className="text-zinc-200 mt-5 text-lg leading-relaxed">
          The university database has been hacked.

          Find the attacker before the evidence is erased.
        </p>

      </div>



      {/* Security AI */}

      <div className="absolute bottom-28 right-8 bg-cyan-500/10 backdrop-blur-md border border-cyan-400 rounded-3xl p-6 w-[320px]">

        <h2 className="text-cyan-300 text-3xl font-bold">
          🤖 Security AI
        </h2>

        <p className="text-zinc-200 mt-4 text-lg leading-relaxed">
          Unauthorized access detected.

          Investigate the room and locate clues.
        </p>

      </div>



      {/* Inventory */}

      <div className="absolute bottom-0 left-0 w-full h-24 bg-black/70 backdrop-blur-md border-t border-cyan-500 flex items-center px-10">

        <h3 className="text-cyan-300 font-semibold text-xl">
          Inventory
        </h3>

        <div className="ml-8 flex gap-4">

          <div className="w-14 h-14 border border-cyan-500 rounded-xl"></div>

          <div className="w-14 h-14 border border-cyan-500 rounded-xl"></div>

          <div className="w-14 h-14 border border-cyan-500 rounded-xl"></div>

        </div>

      </div>



      {/* Access Terminal Modal */}

      {showMonitor && (
        <AccessTerminalModal
          selectedDomain={incomingDomain || "HTML5"}
          onClose={() => setShowMonitor(false)}
        />
      )}

    </div>
  );
}