// components/Navbar.tsx

import { Home, Target, Trophy, Award } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menus = [
    {
      title: "Home",
      icon: <Home size={18} />,
      to: "/",
    },
    {
      title: "Quests",
      icon: <Target size={18} />,
      to: "/quests",
    },
    {
      title: "Leaderboard",
      icon: <Trophy size={18} />,
      to: "/leaderboard",
    },
    {
      title: "Achievements",
      icon: <Award size={18} />,
      to: "/achievements",
    },
  ];

  return (
    <header className="relative flex items-center px-8 py-6">

      {/* Logo */}

      <div className="z-10">

        <h1 className="text-3xl font-extrabold tracking-widest text-cyan-400">

          EXPLORIA

        </h1>

        <p className="mt-1 text-sm text-gray-400">

          Escape • Learn • Conquer

        </p>

      </div>

      {/* Center Navigation */}

      <div className="absolute left-1/2 -translate-x-1/2">

        <div className="flex items-center gap-7 rounded-2xl border border-cyan-500/20 bg-[#07101dcc] px-4 py-3 backdrop-blur-xl shadow-lg shadow-cyan-500/10">

          {menus.map((menu) => {
            const isActive = location.pathname === menu.to;
            return (
              <button
                key={menu.title}
                type="button"
                onClick={() => navigate(menu.to)}
                className={`flex items-center gap-6 rounded-xl px-16 py-5 text-base font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-cyan-400 text-black shadow-[0_0_25px_rgba(34,211,238,0.45)]"
                    : "text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-300"
                }`}
              >
                {menu.icon}
                <span>{menu.title}</span>
              </button>
            );
          })}

        </div>

      </div>

    </header>
  );
}