import { LayoutDashboard, FileText, Book, Users, BarChart2, Award, Megaphone, FilePlus, Cpu, Settings, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function FacultySidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const items = [
    { icon: <LayoutDashboard size={18} />, name: "Dashboard", to: "/faculty" },
    { icon: <FileText size={18} />, name: "Missions", to: "/faculty/missions" },
    { icon: <Book size={18} />, name: "Quizzes", to: "/faculty/quizzes" },
    { icon: <Users size={18} />, name: "Students", to: "/faculty/students" },
    { icon: <BarChart2 size={18} />, name: "Progress & Reports", to: "/faculty/reports" },
    { icon: <Award size={18} />, name: "Achievements", to: "/faculty/achievements" },
    { icon: <Megaphone size={18} />, name: "Announcements", to: "/faculty/announcements" },
    { icon: <FilePlus size={18} />, name: "Study Materials", to: "/faculty/materials" },
    { icon: <Cpu size={18} />, name: "Archie AI Assistant", to: "/faculty/assistant" },
    { icon: <Settings size={18} />, name: "Settings", to: "/faculty/settings" },
    { icon: <LogOut size={18} />, name: "Logout", to: "/" },
  ];

  const isActive = (to: string) => location.pathname === to || location.pathname.startsWith(to + "/");

  return (
    <aside className="w-full">
      <div className="sticky top-8 space-y-6">
        <div className="w-full rounded-2xl border border-cyan-500/20 bg-[#07101d66] p-6 backdrop-blur-xl shadow-lg shadow-cyan-500/10">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-cyan-400 text-black flex items-center justify-center font-bold">{user?.explorer_name?.charAt(0) || 'F'}</div>
            <div>
              <div className="text-sm font-semibold">{user?.explorer_name || 'Faculty'}</div>
              <div className="text-xs text-gray-400">Faculty Member</div>
            </div>
          </div>

          <nav className="space-y-2">
            {items.map((it) => (
              <button
                key={it.name}
                onClick={() => {
                  if (it.name === "Logout") {
                    logout();
                    navigate("/login");
                    return;
                  }
                  navigate(it.to);
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive(it.to)
                    ? 'bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.12)]'
                    : 'text-gray-200 hover:bg-black/12'
                }`}
              >
                <div className="text-cyan-300">{it.icon}</div>
                <span>{it.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
