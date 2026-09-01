import { Bell, Settings } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function FacultyHeader() {
  const { user } = useAuth();

  return (
    <header className="z-20 flex items-center justify-between px-8 py-4 backdrop-blur-lg">
      <div className="flex items-center gap-4">
        <div className="text-lg font-extrabold tracking-widest text-cyan-300">Exploria</div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-md bg-black/10 text-cyan-300 hover:bg-black/20">
          <Bell size={18} />
        </button>

        <button className="p-2 rounded-md bg-black/10 text-cyan-300 hover:bg-black/20">
          <Settings size={18} />
        </button>

        <div className="flex items-center gap-3 rounded-xl bg-[#071525] px-3 py-1">
          <div className="h-9 w-9 rounded-full bg-cyan-400 text-black flex items-center justify-center font-bold">{user?.explorer_name?.charAt(0) || 'F'}</div>
          <div className="text-sm">
            <div className="font-semibold">{user?.explorer_name || 'Faculty'}</div>
            <div className="text-xs text-gray-400">Faculty Member</div>
          </div>
        </div>
      </div>
    </header>
  );
}
