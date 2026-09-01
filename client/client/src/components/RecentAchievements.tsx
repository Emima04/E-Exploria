// components/RecentAchievements.tsx

import { Trophy } from "lucide-react";

export default function RecentAchievements() {
  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-[#07101dcc] p-8 backdrop-blur-xl">

      <div className="mb-6 flex items-center gap-3">

        <Trophy
          className="text-cyan-400"
          size={28}
        />

        <h2 className="text-2xl font-bold">

          Recent Achievements

        </h2>

      </div>

      <div className="flex h-48 flex-col items-center justify-center rounded-3xl border border-dashed border-cyan-500/20 bg-[#091625]">

        <div className="mb-4 rounded-full bg-cyan-500/10 p-6">

          <Trophy
            size={45}
            className="text-cyan-300"
          />

        </div>

        <h3 className="text-xl font-semibold">

          None Yet

        </h3>

        <p className="mt-2 text-center text-gray-400">

          Complete missions to unlock achievements.

        </p>

      </div>

    </div>
  );
}