import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Shield, Sparkles } from "lucide-react";

interface MissionNode {
  id: number;
  title: string;
  subtitle: string;
  domain: string;
  unlocked: boolean;
}

const missionNodes: MissionNode[] = [
  { id: 1, title: "HTML", subtitle: "Web Foundation", domain: "HTML5", unlocked: true },
  { id: 2, title: "CSS", subtitle: "Style Lab", domain: "CSS3", unlocked: true },
  { id: 3, title: "JavaScript", subtitle: "Logic Engine", domain: "JS", unlocked: true },
  { id: 4, title: "DBMS", subtitle: "Data Vault", domain: "DBMS", unlocked: true },
  { id: 5, title: "AI", subtitle: "Neural Nexus", domain: "AI", unlocked: false },
  { id: 6, title: "Firewall", subtitle: "Defensive Grid", domain: "FIREWALL", unlocked: false },
  { id: 7, title: "Core", subtitle: "Protocol Nexus", domain: "CORE", unlocked: false },
  { id: 8, title: "Launch", subtitle: "Final Sequence", domain: "LAUNCH", unlocked: false },
];

const domainTitles: Record<string, string> = {
  HTML5: "HTML5 Matrix Node",
  CSS3: "CSS3 Cascade Core",
  JS: "JavaScript Logic Engine",
  DBMS: "DBMS Transaction Console",
  AI: "AI Nexus Protocol",
};

const missionDetails: Record<
  string,
  {
    difficulty: string;
    xp: number;
    story: string;
    objectives: string[];
  }
> = {
  HTML5: {
    difficulty: "Easy",
    xp: 60,
    story:
      "The web matrix is fractured. Rebuild the broken markup, recover lost structure, and restore the node to stability.",
    objectives: [
      "Identify corrupted HTML tags.",
      "Repair invalid markup and broken links.",
      "Secure the web foundation for the next node.",
    ],
  },
  CSS3: {
    difficulty: "Easy",
    xp: 80,
    story:
      "Style rules have been tampered with. Seal the cascading leaks, restore visual order, and lock down the presentation layer.",
    objectives: [
      "Detect rogue CSS rules.",
      "Correct selector cascade issues.",
      "Harden the interface styling protocol.",
    ],
  },
  JS: {
    difficulty: "Medium",
    xp: 100,
    story:
      "The logic engine is compromised. Trace the faulty scripts, neutralize malicious automation, and restore runtime flow.",
    objectives: [
      "Analyze suspicious functions.",
      "Disable malicious script injections.",
      "Reinstate secure program flow.",
    ],
  },
  DBMS: {
    difficulty: "Medium",
    xp: 120,
    story:
      "Database transactions are corrupted by an intruder. Recover stolen records, neutralize rogue queries, and restore the archive.",
    objectives: [
      "Locate stolen data fragments.",
      "Block unauthorized database access.",
      "Rebuild secure storage protocols.",
    ],
  },
  AI: {
    difficulty: "Hard",
    xp: 150,
    story:
      "The neural nexus is under attack. Contain the anomaly, restore corrupted weights, and regain control of the intelligence core.",
    objectives: [
      "Identify the compromised AI module.",
      "Reset corrupted neural pathways.",
      "Secure the AI decision engine.",
    ],
  },
};

export default function MissionPath() {
  const location = useLocation();
  const navigate = useNavigate();
  const incomingDomain = (location.state as any)?.selectedDomain as string | undefined;
  const defaultNode = missionNodes.find((node) => node.domain === incomingDomain) || missionNodes[3];

  const [activeNode, setActiveNode] = useState<MissionNode>(defaultNode);

  const currentTitle = domainTitles[activeNode.domain] || activeNode.title;
  const currentDetails = missionDetails[activeNode.domain] || {
    difficulty: "Unknown",
    xp: 0,
    story: "A mission profile is not available.",
    objectives: ["No objectives defined."],
  };

  const activeIndex = useMemo(
    () => missionNodes.findIndex((node) => node.domain === activeNode.domain),
    [activeNode.domain]
  );

  const handleSelectNode = (node: MissionNode) => {
    if (!node.unlocked) return;
    setActiveNode(node);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-white px-6 py-10">
      <div className="mx-auto max-w-6xl rounded-3xl border border-cyan-500/20 bg-[#07101d]/90 p-8 shadow-[0_0_60px_rgba(6,182,212,0.12)]">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-400/80">Mission Progress</p>
            <h1 className="mt-4 text-4xl font-black">Mission Path</h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Choose your next subject node and follow the path into mission briefing and the Cyber Room.
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-slate-900/80 px-5 py-3 text-sm text-cyan-300 transition hover:bg-cyan-500/10"
          >
            <ArrowRight size={16} className="rotate-180" />
            Back to Dashboard
          </button>
        </div>

        <div className="space-y-8">
          <div className="relative rounded-3xl border border-slate-800 bg-slate-950/50 p-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Selected Node</span>
                <h2 className="mt-3 text-3xl font-bold text-white">{currentTitle}</h2>
                <p className="mt-2 text-slate-300">{activeNode.subtitle} — ready to advance the mission core.</p>
              </div>
              <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 px-5 py-4 text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.12)]">
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-100/80">Node Status</p>
                <p className="mt-2 text-3xl font-black">{activeNode.unlocked ? "Unlocked" : "Locked"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-[#08121f]/95 p-6 shadow-inner shadow-cyan-500/10">
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-8 md:items-center">
                {missionNodes.map((node, index) => (
                  <div key={node.id} className="flex flex-col items-center text-center">
                    <button
                      type="button"
                      onClick={() => handleSelectNode(node)}
                      className={`group relative flex h-28 w-28 flex-col items-center justify-center rounded-3xl border px-4 py-4 text-sm transition duration-200 ${
                        node.unlocked
                          ? activeNode.domain === node.domain
                            ? "border-cyan-400/90 bg-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.20)]"
                            : "border-slate-700 bg-slate-900/80 hover:-translate-y-1 hover:border-cyan-400/60 hover:bg-slate-900/95"
                          : "border-slate-700 bg-slate-950/80 text-slate-500"
                      }`}
                    >
                      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900/70 text-lg text-white">
                        {node.unlocked ? <Shield size={20} /> : <Lock size={20} />}
                      </div>
                      <span className="font-semibold text-white">{node.title}</span>
                      <span className="mt-1 text-[11px] uppercase tracking-[0.3em] text-slate-400">{node.subtitle}</span>
                      {!node.unlocked && (
                        <span className="absolute inset-x-0 bottom-2 mx-auto inline-flex items-center rounded-full bg-slate-900/90 px-2 py-1 text-[10px] uppercase tracking-[0.3em] text-slate-500">
                          Locked
                        </span>
                      )}
                    </button>
                    {index < missionNodes.length - 1 && (
                      <div className="hidden md:block h-1 bg-slate-700/80"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Mission Name</p>
                  <h3 className="mt-3 text-3xl font-bold text-white">{activeNode.title}</h3>
                </div>
                <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">
                  <p className="uppercase tracking-[0.2em] text-slate-300">Difficulty</p>
                  <p className="mt-1 text-xl font-black">{currentDetails.difficulty}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-800 bg-[#08121f]/95 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">XP Reward</p>
                  <p className="mt-3 text-4xl font-black text-cyan-300">+{currentDetails.xp} XP</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-[#08121f]/95 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Story</p>
                  <p className="mt-3 text-slate-300">{currentDetails.story}</p>
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-slate-800 bg-[#08121f]/95 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Objectives</p>
                <ul className="mt-4 space-y-3">
                  {currentDetails.objectives.map((objective, index) => (
                    <li key={index} className="rounded-2xl bg-slate-900/80 p-4 text-slate-300">
                      <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-300 text-sm font-bold">{index + 1}</span>
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <div className="flex items-center gap-3 text-cyan-300">
                <Sparkles size={20} />
                <p className="font-semibold uppercase tracking-[0.3em] text-white">Path Progress</p>
              </div>
              <div className="mt-5 space-y-3">
                {missionNodes.map((node) => (
                  <div key={node.id} className="flex items-center justify-between rounded-2xl bg-slate-900/80 px-4 py-3">
                    <div>
                      <p className="font-semibold text-white">{node.title}</p>
                      <p className="text-xs text-slate-500">{node.subtitle}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase ${node.unlocked ? "bg-cyan-500/10 text-cyan-300" : "bg-slate-800 text-slate-500"}`}>
                      {node.unlocked ? "Open" : "Locked"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-sm text-slate-400">Selected mission</p>
              <h4 className="text-xl font-bold text-white">{activeNode.title}</h4>
            </div>

            <button
              disabled={!activeNode.unlocked}
              onClick={() => navigate("/mission-intro", { state: { selectedDomain: activeNode.domain } })}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-6 py-4 font-bold text-black transition hover:scale-105 disabled:cursor-not-allowed disabled:bg-slate-700"
            >
              Start Mission
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
