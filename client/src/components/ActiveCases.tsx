import {
  Layers,
  ArrowRightLeft,
  Hash,
  GitBranch,
  Search,
  ArrowRight,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../lib/api";
import { DSA_CASES, getMissionProgress, missionProgressEventName } from "../lib/missionProgress";

type CaseItem = {
  id: string | number;
  title: string;
  subtitle: string;
  progress: number;
  status: string;
  iconKey?: string;
  domain?: string;
};

type ActiveCasesProps = {
  onSelectMission?: (domainKey: string) => void;
};

const DEFAULT_DSA_CASES: CaseItem[] = [
  {
    id: "case-stack",
    title: "Stack",
    subtitle: "Command Buffer LIFO Protocol",
    progress: 0,
    status: "ACTIVE",
    iconKey: "stack",
    domain: "DSA",
  },
  {
    id: "case-queue",
    title: "Queue",
    subtitle: "Packet Queue FIFO Analysis",
    progress: 0,
    status: "LOCKED",
    iconKey: "queue",
    domain: "DSA",
  },
  {
    id: "case-hashing",
    title: "Hashing",
    subtitle: "Key-Value Hash Vault",
    progress: 0,
    status: "LOCKED",
    iconKey: "hashing",
    domain: "DSA",
  },
  {
    id: "case-recursion",
    title: "Recursion",
    subtitle: "Recursive Tree Traversal",
    progress: 0,
    status: "LOCKED",
    iconKey: "recursion",
    domain: "DSA",
  },
  {
    id: "case-searching",
    title: "Searching",
    subtitle: "Binary Search Memory Scan",
    progress: 0,
    status: "LOCKED",
    iconKey: "searching",
    domain: "DSA",
  },
];

export default function ActiveCases({ onSelectMission }: ActiveCasesProps) {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(getMissionProgress);
  const [cases, setCases] = useState<CaseItem[]>(DEFAULT_DSA_CASES);
  const [loading] = useState(false);

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
    setCases((currentCases) => currentCases.map((mission) => {
      const missionProgress = progress[mission.title as keyof typeof progress];
      const missionIndex = DSA_CASES.indexOf(mission.title as (typeof DSA_CASES)[number]);
      const previousComplete = missionIndex === 0 || progress[DSA_CASES[missionIndex - 1]] === 100;
      const completed = missionProgress === 100;
      return {
        ...mission,
        progress: missionProgress,
        status: completed ? "COMPLETED" : previousComplete ? "ACTIVE" : "LOCKED",
      };
    }));
  }, [progress]);

  useEffect(() => {
    let cancelled = false;
    api
      .get("/cases")
      .then((res) => {
        if (cancelled) return;
        if (res.data.cases && res.data.cases.length > 0) {
          // If backend returns cases, use them; if they don't include DSA topics, merge or keep DSA
          const dsaFiltered = res.data.cases.some((c: any) =>
            ["Stack", "Queue", "Hashing", "Recursion", "Searching"].includes(c.title)
          );
          if (dsaFiltered) {
            setCases(res.data.cases);
          }
        }
      })
      .catch(() => {
        // Fallback to DSA cases
        setCases(DEFAULT_DSA_CASES);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const renderIcon = (key?: string, title?: string) => {
    const check = (key || title || "").toLowerCase();
    if (check.includes("stack")) return Layers;
    if (check.includes("queue")) return ArrowRightLeft;
    if (check.includes("hash")) return Hash;
    if (check.includes("recursion")) return GitBranch;
    if (check.includes("search")) return Search;
    return Layers;
  };

  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-[#07101dcc] p-8 backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-wide">ACTIVE CASES</h2>
          <p className="text-xs uppercase tracking-widest text-cyan-400 mt-1">
            DSA Forensic Investigation Nodes
          </p>
        </div>

        <button 
          onClick={() => navigate("/mission-path", { state: { selectedDomain: "DSA" } })}
          className="flex items-center gap-2 text-cyan-300 hover:text-white cursor-pointer text-sm font-semibold"
        >
          VIEW ALL CASES
          <ArrowRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 p-6 text-slate-400">Loading cases...</div>
        ) : (
          cases.map((mission) => {
            const Icon = renderIcon(mission.iconKey, mission.title);
            const isLocked = mission.status === "LOCKED";

            return (
              <div
                key={mission.id}
                onClick={() => {
                  if (!isLocked) {
                    onSelectMission?.("DSA");
                    navigate("/cyber-room", { state: { selectedDomain: "DSA", caseType: mission.title.toLowerCase() } });
                  }
                }}
                className={`rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  isLocked
                    ? "border-slate-800 bg-[#080d18] opacity-75"
                    : mission.status === "COMPLETED"
                    ? "border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 to-transparent hover:border-emerald-400 cursor-pointer"
                    : "border-cyan-500/30 bg-gradient-to-b from-cyan-500/10 to-transparent hover:border-cyan-400 cursor-pointer"
                }`}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`rounded-xl p-3 ${
                        isLocked
                          ? "bg-slate-800 text-slate-500"
                          : mission.status === "COMPLETED"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-cyan-500/15 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                      }`}
                    >
                      <Icon size={24} />
                    </div>

                    <div>
                      <h3 className="font-bold text-white text-lg">{mission.title}</h3>
                      <p className="text-xs text-gray-400">{mission.subtitle}</p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-bold tracking-wider ${
                      isLocked
                        ? "bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1"
                        : mission.status === "COMPLETED"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
                        : "bg-cyan-500/20 text-cyan-400 border border-cyan-400/30"
                    }`}
                  >
                    {isLocked ? (
                      <>
                        <Lock size={10} />
                        LOCKED
                      </>
                    ) : (
                      mission.status
                    )}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Progress</span>
                    <span
                      className={`text-sm font-semibold ${
                        isLocked
                          ? "text-slate-500"
                          : mission.status === "COMPLETED"
                          ? "text-emerald-300"
                          : "text-cyan-300"
                      }`}
                    >
                      {mission.progress}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isLocked
                          ? "bg-slate-700"
                          : mission.status === "COMPLETED"
                          ? "bg-gradient-to-r from-emerald-400 to-teal-500"
                          : "bg-gradient-to-r from-cyan-400 to-blue-500"
                      }`}
                      style={{ width: `${mission.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
