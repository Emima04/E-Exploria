interface Student { name: string; xp: number; level: number }

const top: Student[] = [
  { name: "Alice Johnson", xp: 2450, level: 12 },
  { name: "Bob Smith", xp: 2150, level: 11 },
  { name: "Diana Prince", xp: 1980, level: 10 },
  { name: "Ethan Hunt", xp: 1650, level: 9 },
  { name: "Charlie Brown", xp: 1420, level: 8 },
];

export default function TopStudents() {
  return (
    <div className="rounded-2xl border border-cyan-500/12 bg-[#061221cc] p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Top Performing Students</h3>
        <a className="text-sm text-cyan-300 hover:underline" href="#">View All</a>
      </div>
      <ol className="mt-3 space-y-2">
        {top.map((s, i) => (
          <li key={s.name} className={`flex items-center justify-between rounded-md px-2 py-2 ${i === 0 ? 'bg-[#0b1720]' : ''}`}>
            <div className="flex items-center gap-3">
              <div className={`h-8 w-8 rounded-full bg-cyan-400 text-black flex items-center justify-center font-bold`}>{i+1}</div>
              <div>
                <div className="font-medium">{s.name}</div>
                <div className="text-xs text-gray-400">XP Earned: {s.xp}</div>
              </div>
            </div>
            <div className="text-sm text-cyan-300">Level {s.level}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}
