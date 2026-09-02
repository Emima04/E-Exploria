import {
  Database,
  Globe,
  Brain,
  Monitor,
  ArrowRight,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DSA_CASES, getMissionProgress, missionProgressEventName } from "../lib/missionProgress";

type CaseItem = {
  id: string;
  title: string;
  subtitle: string;
  progress: number;
  status: string;
  iconKey?: string;
};

type ActiveCasesProps = {
  onSelectMission?: (domainKey: string) => void;
};

export default function ActiveCases({ onSelectMission }: ActiveCasesProps) {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(getMissionProgress);
  const [cases, setCases] = useState<CaseItem[]>(DSA_CASES.map((title, index) => ({
    id: `case-${title.toLowerCase()}`,
    title,
    subtitle: ["Command Buffer LIFO Protocol", "Packet Queue FIFO Analysis", "Key-Value Hash Vault", "Recursive Tree Traversal", "Binary Search Memory Scan"][index],
    progress: 0,
    status: index === 0 ? "ACTIVE" : "LOCKED",
    iconKey: index === 0 ? "system" : "database",
  })));

  useEffect(() => {
    const refreshProgress = () => setProgress(getMissionProgress());
    window.addEventListener(missionProgressEventName(), refreshProgress);
    window.addEventListener("storage", refreshProgress);
    return () => {
      window.removeEventListener(missionProgressEventName(), refreshProgress);
      window.removeEventListener("storage", refreshProgress);
    };
  }, []);

  useEffect(() => {
    setCases((currentCases) => currentCases.map((mission, index) => {
      const missionProgress = progress[DSA_CASES[index]];
      return {
        ...mission,
        progress: missionProgress,
        status: missionProgress === 100 ? "COMPLETED" : index === 0 || progress[DSA_CASES[index - 1]] === 100 ? "ACTIVE" : "LOCKED",
      };
    }));
  }, [progress]);

  const mapToDomain = (title: string) => {
    switch (title) {
      default:
        return "DSA";
    }
  };

  const renderIcon = (key?: string) => {
    switch (key) {
      case "database":
        return Database;
      case "web":
        return Globe;
      case "ai":
        return Brain;
      case "system":
        return Monitor;
      default:
        return Database;
    }
  };

  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-[#07101dcc] p-8 backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-wide">ACTIVE CASES</h2>

        <button className="flex items-center gap-2 text-cyan-300 hover:text-white">
          VIEW ALL CASES
          <ArrowRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {cases.map((mission) => {
            const Icon = renderIcon(mission.iconKey);
            return (
              <div
                key={mission.id}
                onClick={() => {
                  if (mission.status !== "LOCKED") {
                    const domain = mapToDomain(mission.title);
                    onSelectMission?.(domain);
                    navigate("/cyber-room", { state: { selectedDomain: domain, caseType: mission.title.toLowerCase() } });
                  }
                }}
                className={`rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                ${
                  mission.status === "LOCKED"
                    ? "border-slate-700 bg-[#111827aa]"
                    : "border-cyan-500/30 bg-gradient-to-b from-cyan-500/10 to-transparent hover:border-cyan-400 cursor-pointer"
                }`}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-6">
                    <div className={`rounded-xl p-3 ${mission.status === "LOCKED" ? "bg-slate-700" : "bg-cyan-500/10"}`}>
                      <Icon size={29} className={mission.status === "LOCKED" ? "text-slate-500" : "text-cyan-300"} />
                    </div>

                    <div>
                      <h3 className="font-semibold">{mission.title}</h3>
                      <p className="text-sm text-gray-400">{mission.subtitle}</p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-bold tracking-wider ${
                      mission.status === "ACTIVE"
                        ? "bg-cyan-500/20 text-cyan-400 border border-cyan-400/30"
                        : "bg-slate-700 text-slate-400 border border-slate-600"
                    }`}
                  >
                    {mission.status === "LOCKED" ? (
                      <div className="flex items-center gap-1">
                        <Lock size={10} />
                        LOCKED
                      </div>
                    ) : (
                      mission.status
                    )}
                  </span>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Progress</span>
                    <span className="text-sm font-semibold text-cyan-300">{mission.progress}%</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        mission.status === "LOCKED" ? "bg-slate-600" : "bg-gradient-to-r from-cyan-400 to-blue-500"
                      }`}
                      style={{ width: `${mission.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
