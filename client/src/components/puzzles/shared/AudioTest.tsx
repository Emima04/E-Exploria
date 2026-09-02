import { useAudio } from "../../../contexts/AudioContext";

export default function AudioTest() {
  const { playSound } = useAudio();

  return (
    <div className="fixed bottom-20 left-5 z-[100] flex gap-2 rounded-xl border border-purple-400/30 bg-black/80 p-3 backdrop-blur-md">
      <button
        onClick={() => playSound("click")}
        className="rounded-lg bg-purple-500/20 px-3 py-2 text-xs text-purple-200"
      >
        Click
      </button>

      <button
        onClick={() => playSound("extract")}
        className="rounded-lg bg-pink-500/20 px-3 py-2 text-xs text-pink-200"
      >
        Extract
      </button>

      <button
        onClick={() => playSound("success")}
        className="rounded-lg bg-emerald-500/20 px-3 py-2 text-xs text-emerald-200"
      >
        Success
      </button>

      <button
        onClick={() => playSound("pickup")}
        className="rounded-lg bg-amber-500/20 px-3 py-2 text-xs text-amber-200"
      >
        Pickup
      </button>
    </div>
  );
}