import { useEffect, useState } from "react";
import { Trophy, Flame, Star, Target } from "lucide-react";
import api from "../lib/api";

interface Achievement {
  ID: number;
  key: string;
  title: string;
  description: string;
  icon: string;
}

export default function RecentAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .get("/student/achievements")
      .then((res) => {
        if (!active) return;
        setAchievements(res.data.achievements || []);
      })
      .catch((err) => console.error("Error loading achievements:", err))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const renderIcon = (key: string) => {
    switch (key) {
      case "first_mission":
        return <Trophy className="text-yellow-400" size={32} />;
      case "streak_7":
        return <Flame className="text-orange-400" size={32} />;
      case "xp_1000":
        return <Star className="text-cyan-400" size={32} />;
      case "missions_10":
        return <Target className="text-rose-400" size={32} />;
      default:
        return <Trophy className="text-yellow-400" size={32} />;
    }
  };

  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-[#07101dcc] p-8 backdrop-blur-xl">
      <div className="mb-6 flex items-center gap-3">
        <Trophy className="text-cyan-400" size={28} />
        <h2 className="text-2xl font-bold">Recent Achievements</h2>
      </div>

      {loading ? (
        <div className="text-center py-6 text-gray-400 text-sm">Scanning database modules...</div>
      ) : achievements.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center rounded-3xl border border-dashed border-cyan-500/20 bg-[#091625]">
          <div className="mb-4 rounded-full bg-cyan-500/10 p-6">
            <Trophy size={45} className="text-cyan-300" />
          </div>
          <h3 className="text-xl font-semibold">None Yet</h3>
          <p className="mt-2 text-center text-gray-400">Complete missions to unlock achievements.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((ach) => (
            <div key={ach.ID} className="flex items-center gap-4 rounded-2xl border border-cyan-500/10 bg-[#091625] p-5 shadow-lg">
              <div className="rounded-xl bg-cyan-500/5 p-3 flex items-center justify-center">
                {renderIcon(ach.key)}
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{ach.title}</h4>
                <p className="text-xs text-gray-400 mt-1">{ach.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}