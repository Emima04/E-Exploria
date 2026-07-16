// components/MissionCard.tsx

import { Play, Flag, Shield, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MissionCard() {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => navigate("/cyber-room")}
      className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-[#07101dcc] p-8 backdrop-blur-xl cursor-pointer hover:border-cyan-400/70 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition duration-300"
    >

      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="flex items-start justify-between">

        <div>

          <span className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-cyan-300">
            Current Mission
          </span>

          <h1 className="mt-8 text-4xl font-black">
            Database Breach
          </h1>

          <p className="mt-4 max-w-lg text-gray-400">
            Recover the stolen database files, eliminate malicious
            scripts and restore security to the Exploria servers.
          </p>

        </div>

        <div className="flex h-32 w-32 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-500/10">

          <Shield
            size={55}
            className="text-cyan-300"
          />

        </div>

      </div>

      <div className="mt-8">

        <div className="mb-2 flex justify-between">

          <span className="text-sm text-gray-400">

            Mission Progress

          </span>

          <span className="font-bold text-cyan-300">

            60%

          </span>

        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-800">

          <div className="h-full w-[60%] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />

        </div>

      </div>

      <div className="mt-8 grid grid-cols-3 gap-5">

        <div className="rounded-2xl bg-[#0b1727] p-4">

          <Flag
            className="mb-2 text-cyan-300"
          />

          <p className="text-xs text-gray-500">

            Evidence

          </p>

          <h3 className="text-xl font-bold">

            3 / 5

          </h3>

        </div>

        <div className="rounded-2xl bg-[#0b1727] p-4">

          <Play
            className="mb-2 text-cyan-300"
          />

          <p className="text-xs text-gray-500">

            Reward

          </p>

          <h3 className="text-xl font-bold">

            +150 XP

          </h3>

        </div>

        <div className="rounded-2xl bg-[#0b1727] p-4">

          <Shield
            className="mb-2 text-cyan-300"
          />

          <p className="text-xs text-gray-500">

            Difficulty

          </p>

          <h3 className="text-xl font-bold">

            Medium

          </h3>

        </div>

      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate("/cyber-room");
        }}
        className="mt-8 flex items-center gap-3 rounded-2xl bg-cyan-400 px-8 py-4 font-bold text-black transition hover:scale-105 cursor-pointer"
      >
        Enter Mission

        <ArrowRight size={20} />

      </button>

    </div>
  );
}