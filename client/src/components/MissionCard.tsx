// components/MissionCard.tsx

import { Play, Flag, Shield, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DSA_CASES, getMissionProgress, missionProgressEventName } from "../lib/missionProgress";

type MissionCardProps = {
  domainKey?: string;
};

const MISSION_CARD_DATA: Record<string, { title: string; description: string; difficulty?: string; xp?: string; evidence?: string; progress?: number }> = {
  DSA: {
    title: "Data Structures & Algorithms",
    description:
      "Investigate the cyber security breach. Master Command Stacks, FIFO Packet Queues, and algorithmic trace forensics inside the Cyber Room.",
    difficulty: "Beginner",
    xp: "+150 XP",
    evidence: "2 / 5",
    progress: 40,
  },
  HTML5: {
    title: "HTML5 Matrix Node",
    description:
      "Secure the web foundations, recover corrupted markup, and restore structural integrity across the Exploria network.",
    difficulty: "Easy",
    xp: "+60 XP",
    evidence: "0 / 5",
    progress: 0,
  },
  CSS3: {
    title: "CSS3 Style Lab",
    description:
      "Patch cascading style leaks, align visual surfaces, and lock down the system's presentation layer from rogue styles.",
    difficulty: "Easy",
    xp: "+80 XP",
    evidence: "0 / 5",
    progress: 0,
  },
  JS: {
    title: "JavaScript Logic Engine",
    description:
      "Debug the script core, disable malicious automation, and restore logic flow to the Exploria engines.",
    difficulty: "Medium",
    xp: "+100 XP",
    evidence: "0 / 5",
    progress: 0,
  },
  DBMS: {
    title: "Database Breach",
    description:
      "Recover the stolen database files, eliminate malicious scripts and restore security to the Exploria servers.",
    difficulty: "Medium",
    xp: "+120 XP",
    evidence: "0 / 5",
    progress: 0,
  },
  AI: {
    title: "AI Nexus Protocol",
    description:
      "Neutralize the compromised AI routines, retrain the neural defenses, and secure the intelligence core.",
    difficulty: "Hard",
    xp: "+150 XP",
    evidence: "0 / 5",
    progress: 0,
  },
};

export default function MissionCard({ domainKey = "DSA" }: MissionCardProps) {
  const navigate = useNavigate();
  const mission = MISSION_CARD_DATA[domainKey] || MISSION_CARD_DATA.DSA;
  const [caseProgress, setCaseProgress] = useState(getMissionProgress);

  useEffect(() => {
    const refreshProgress = () => setCaseProgress(getMissionProgress());
    window.addEventListener(missionProgressEventName(), refreshProgress);
    window.addEventListener("storage", refreshProgress);
    return () => {
      window.removeEventListener(missionProgressEventName(), refreshProgress);
      window.removeEventListener("storage", refreshProgress);
    };
  }, []);

  const completedCases = DSA_CASES.filter((caseTitle) => caseProgress[caseTitle] === 100).length;
  const missionProgress = Math.round(
    DSA_CASES.reduce((total, caseTitle) => total + caseProgress[caseTitle], 0) / DSA_CASES.length
  );
  const displayMission = domainKey === "DSA"
    ? { ...mission, progress: missionProgress, evidence: `${completedCases} / ${DSA_CASES.length}` }
    : mission;

  return (
    <div 
      onClick={() => navigate("/mission-path", { state: { selectedDomain: domainKey } })}
      className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-[#07101dcc] p-8 backdrop-blur-xl cursor-pointer hover:border-cyan-400/70 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition duration-300"
    >

      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="flex items-start justify-between">

        <div>

          <span className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-cyan-300">
            Current Mission
          </span>

          <h1 className="mt-8 text-4xl font-black">
            {displayMission.title}
          </h1>

          <p className="mt-4 max-w-lg text-gray-400">
            {displayMission.description}
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
          <span className="text-sm text-gray-400">Mission Progress</span>
          <span className="font-bold text-cyan-300">{displayMission.progress ?? 0}%</span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700"
            style={{ width: `${displayMission.progress ?? 0}%` }}
          />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-5">
        <div className="rounded-2xl bg-[#0b1727] p-4">
          <Flag className="mb-2 text-cyan-300" />
          <p className="text-xs text-gray-500">Evidence</p>
          <h3 className="text-xl font-bold">{displayMission.evidence ?? "0 / 5"}</h3>
        </div>

        <div className="rounded-2xl bg-[#0b1727] p-4">
          <Play className="mb-2 text-cyan-300" />
          <p className="text-xs text-gray-500">Reward</p>
          <h3 className="text-xl font-bold">{displayMission.xp ?? "+150 XP"}</h3>
        </div>

        <div className="rounded-2xl bg-[#0b1727] p-4">
          <Shield className="mb-2 text-cyan-300" />
          <p className="text-xs text-gray-500">Difficulty</p>
          <h3 className="text-xl font-bold">{displayMission.difficulty ?? "Medium"}</h3>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate("/mission-path", { state: { selectedDomain: domainKey } });
        }}
        className="mt-8 flex items-center gap-3 rounded-2xl bg-cyan-400 px-8 py-4 font-bold text-black transition hover:scale-105 cursor-pointer"
      >
        Enter Mission

        <ArrowRight size={20} />

      </button>

    </div>
  );
}