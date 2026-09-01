import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Shield } from "lucide-react";

const missionDetails: Record<
  string,
  { title: string; description: string; objectives: string[] }
> = {
  HTML5: {
    title: "HTML5 Matrix Node",
    description:
      "Validate markup, recover broken tags, and patch the web foundation before the system overloads.",
    objectives: [
      "Scan the fractured HTML structure.",
      "Repair invalid tags and attributes.",
      "Secure the layout for the next mission stage.",
    ],
  },
  CSS3: {
    title: "CSS3 Cascade Core",
    description:
      "Lock down the visual layer and stop rogue style injections from corrupting the interface.",
    objectives: [
      "Inspect style rules for anomalies.",
      "Correct cascade breaks and selector issues.",
      "Fortify the presentation stack.",
    ],
  },
  JS: {
    title: "JavaScript Logic Engine",
    description:
      "Trace the broken logic path, eliminate corrupted scripts, and restore runtime flow.",
    objectives: [
      "Analyze suspicious functions.",
      "Disable malicious automation.",
      "Reinstate secure execution flow.",
    ],
  },
  DBMS: {
    title: "DBMS Transaction Console",
    description:
      "Recover stolen records, neutralize malicious queries, and restore server integrity.",
    objectives: [
      "Locate stolen database fragments.",
      "Neutralize unauthorized transactions.",
      "Restore secure storage protocols.",
    ],
  },
  AI: {
    title: "AI Nexus Protocol",
    description:
      "Contain the neural anomaly and rebuild the decision-making core before it spreads.",
    objectives: [
      "Identify the compromised AI module.",
      "Reset corrupted weights.",
      "Contain the anomaly and recover control.",
    ],
  },
};

export default function MissionIntro() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedDomain = (location.state as any)?.selectedDomain as string | undefined;
  const [mission, setMission] = useState(missionDetails.DBMS);

  useEffect(() => {
    if (selectedDomain && missionDetails[selectedDomain]) {
      setMission(missionDetails[selectedDomain]);
    }
  }, [selectedDomain]);

  const handleBegin = () => {
    navigate("/cyber-room", { state: { selectedDomain: selectedDomain || "DBMS" } });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-white px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-3xl border border-cyan-500/20 bg-[#07101dcc] p-10 shadow-[0_0_60px_rgba(6,182,212,0.15)]">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-400/80">Mission Briefing</p>
            <h1 className="mt-4 text-4xl font-black">{mission.title}</h1>
            <p className="mt-4 text-slate-300">{mission.description}</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-slate-900/70 px-5 py-3 text-sm text-cyan-300 transition hover:bg-cyan-500/10"
          >
            Back to Mission Path
          </button>
        </div>

        <div className="grid gap-8 md:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-8">
            <h2 className="text-xl font-bold text-white">Objectives</h2>
            <div className="mt-6 space-y-4">
              {mission.objectives.map((objective, index) => (
                <div key={index} className="rounded-3xl border border-slate-800 bg-[#08121f]/90 p-4">
                  <div className="flex items-center gap-3 text-cyan-300">
                    <Shield size={18} />
                    <p className="font-semibold">Objective {index + 1}</p>
                  </div>
                  <p className="mt-3 text-slate-300">{objective}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-[#08121f]/95 p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Ready to launch</p>
            <h3 className="mt-4 text-2xl font-bold text-white">Prepare the terminal</h3>
            <p className="mt-4 text-slate-300">When you begin, you will enter the Cyber Room with the selected mission subject already loaded.</p>
            <button
              onClick={handleBegin}
              className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-cyan-400 px-6 py-4 font-bold text-black transition hover:scale-105"
            >
              Enter Cyber Room
n              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
