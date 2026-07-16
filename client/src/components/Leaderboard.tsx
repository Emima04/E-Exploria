// components/Leaderboard.tsx

import { Trophy, Crown, Medal } from "lucide-react";

export default function Leaderboard() {
  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-[#07101dcc] p-6 backdrop-blur-xl">

      <div className="mb-5 flex items-center gap-3">

        <Trophy className="text-yellow-400" />

        <h2 className="text-x1 font-bold">
          Leaderboard
        </h2>

      </div>

      <div className="rounded-2xl border border-cyan-400/20 bg-[#091625] p-13">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-4">

            <div className="rounded-full bg-yellow-500 p-3">

              <Crown
                className="text-black"
                size={22}
              />

            </div>

            <div>

              <h3 className="text-lg font-bold">

                Emima

              </h3>

              <p className="text-sm text-gray-400">

                Level 7 Explorer

              </p>

            </div>

          </div>

          <div className="text-right">

            <p className="text-2xl font-black text-cyan-300">

              1200 XP

            </p>

            <p className="text-xs text-gray-400">

              Rank #1

            </p>

          </div>

        </div>

      </div>

      <div className="mt-5 flex justify-center">

        <div className="flex items-center gap-2 rounded-full bg-yellow-500/20 px-8 py-2">

          <Medal
            className="text-yellow-400"
            size={18}
          />

          <span className="text-sm text-yellow-300">

            Keep solving missions to stay on top!

          </span>

        </div>

      </div>

    </div>
  );
}