import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

export default function DailyReward() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const todayStr = new Date().toISOString().slice(0, 10);
  const isClaimed = user?.last_active === todayStr;

  const handleClaim = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await api.post("/student/claim-daily");
      setMessage(res.data.message);
      await refreshUser();
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Failed to claim daily reward.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-yellow-400/30 bg-[#07101dcc] p-6 backdrop-blur-xl">
      <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-yellow-500/20 blur-3xl" />
      <h2 className="mb-6 text-xl font-bold">Daily Reward</h2>

      <div className="flex flex-col items-center">
        <img
          src="/treasure.png"
          alt="Treasure"
          className="h-40 transition duration-500 hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/875/875560.png";
          }}
        />
        <h3 className="mt-5 text-xl font-bold">Treasure Chest</h3>
        <p className="mt-2 text-center text-gray-400 text-sm">
          Claim today's reward and receive <b className="text-yellow-400">+100 XP & +20 Gems</b>
        </p>

        {message && (
          <p className="mt-4 text-center text-xs font-semibold text-yellow-300 bg-yellow-500/10 border border-yellow-500/30 px-3 py-2 rounded-xl">
            {message}
          </p>
        )}

        <button
          onClick={handleClaim}
          disabled={isClaimed || loading}
          className={`mt-6 rounded-2xl px-8 py-4 font-bold text-black transition hover:scale-105 cursor-pointer ${
            isClaimed 
              ? "bg-gray-600 text-gray-400 cursor-not-allowed" 
              : "bg-yellow-400 hover:bg-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.3)]"
          }`}
        >
          {loading ? "Claiming..." : isClaimed ? "Already Claimed" : "Claim Reward"}
        </button>
      </div>
    </div>
  );
}