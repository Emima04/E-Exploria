// components/Sidebar.tsx

import {
  LayoutDashboard,
  Brain,
  Bot,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SystemStatus from "./SystemStatus";

export default function Sidebar() {
  const navigate = useNavigate();
  const items = [
    {
      icon: <LayoutDashboard size={24} />,
      name: "Dashboard",
      active: true,
    },
    {
      icon: <Brain size={24} />,
      name: "Skills",
    },
    {
      icon: <Bot size={24} />,
      name: "AI Companion",
    },
    {
      icon: <Settings size={24} />,
      name: "Settings",
    },
  ];

  return (
    <div className="space-y-6">

      <div className="w-full rounded-3xl border border-cyan-500/30 bg-[#07101dcc] p-8 backdrop-blur-xl shadow-2xl shadow-cyan-500/10">

        <h2 className="mb-8 text-2xl font-bold uppercase tracking-[0.2em] text-cyan-300">
          Navigation
        </h2>

        <div className="space-y-5">

          {items.map((item) => (

            <button
              key={item.name}
              onClick={() => {
                if (item.name === "Dashboard") {
                  navigate("/");
                } else if (item.name === "AI Companion") {
                  navigate("/ai-companion");
                } else {
                  navigate("/cyber-room");
                }
              }}
              className={`group flex w-full items-center gap-5 rounded-2xl px-6 py-5 text-lg font-semibold transition-all duration-300 cursor-pointer

              ${
                item.active
                  ? "bg-cyan-400 text-black shadow-[0_0_30px_rgba(34,211,238,0.45)]"
                  : "text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-300 hover:border hover:border-cyan-400/40"
              }`}>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl

                ${
                  item.active
                    ? "bg-black/10"
                    : "bg-white/5 group-hover:bg-cyan-500/10"
                }`}>
                {item.icon}
              </div>

              <span>{item.name}</span>

            </button>

          ))}

        </div>

      </div>

      <div>
        <SystemStatus />
      </div>

    </div>
  );
}
