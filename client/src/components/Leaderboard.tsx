import { useEffect, useState } from "react";
import { Trophy, Crown, Medal } from "lucide-react";
import api from "../lib/api";

interface LeaderboardItem {
  explorer_name: string;
  xp: number;
  rank: number;
  level: number;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .get("/leaderboard")
      .then((res) => {
        if (!active) return;
        setLeaderboard(res.data.leaderboard || []);
      })
      .catch((err) => console.error("Error fetching leaderboard", err))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-[#07101dcc] p-6 backdrop-blur-xl">
      <div className="mb-5 flex items-center gap-3">
        <Trophy className="text-yellow-400" />
        <h2 className="text-xl font-bold">Leaderboard</h2>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-sm text-gray-400 py-2">Calculating rankings...</div>
        ) : leaderboard.length === 0 ? (
          <div className="text-sm text-gray-400 py-2">No rankings available yet.</div>
        ) : (
          leaderboard.map((item) => (
            <div
              key={item.explorer_name}
              className={`rounded-2xl border p-4 flex items-center justify-between ${
                item.rank === 1
                  ? "border-yellow-500/30 bg-yellow-500/5 shadow-[0_0_15px_rgba(234,179,8,0.1)]"
                  : "border-cyan-400/10 bg-[#091625]"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`rounded-full p-2 flex items-center justify-center ${
                    item.rank === 1
                      ? "bg-yellow-500 text-black animate-pulse"
                      : item.rank === 2
                      ? "bg-slate-300 text-black"
                      : "bg-amber-600 text-black"
                  }`}
                >
                  <Crown size={16} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    {item.explorer_name}
                    {item.rank === 1 && <span className="text-[9px] uppercase tracking-widest text-yellow-400 font-mono font-black bg-yellow-400/10 border border-yellow-400/20 px-1.5 py-0.5 rounded">Top</span>}
                  </h3>
                  <p className="text-xs text-gray-400">Level {item.level} Explorer</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-base font-black text-cyan-300">{item.xp} XP</p>
                <p className="text-[10px] text-gray-400">Rank #{item.rank}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-5 flex justify-center">
        <div className="flex items-center gap-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 px-4 py-1.5">
          <Medal className="text-yellow-400" size={14} />
          <span className="text-xs text-yellow-300 font-medium">Keep solving missions to rank up!</span>
        </div>
      </div>
    </div>
  );
}