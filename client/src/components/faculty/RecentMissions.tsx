interface Mission {
  id: string;
  title: string;
  subject: string;
  students: number;
  status: string;
}

const sampleMissions: Mission[] = [
  { id: "m1", title: "HTML Dungeon", subject: "Web Development", students: 45, status: "Published" },
  { id: "m2", title: "CSS Castle", subject: "Web Development", students: 38, status: "Published" },
  { id: "m3", title: "JavaScript Forest", subject: "JavaScript", students: 30, status: "Draft" },
  { id: "m4", title: "Database Breach", subject: "DBMS", students: 22, status: "Published" },
  { id: "m5", title: "Python Peaks", subject: "Python", students: 15, status: "Draft" },
];

export default function RecentMissions() {
  return (
    <div className="rounded-2xl border border-cyan-500/12 bg-[#061221cc] p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Recent Missions</h3>
        <a className="text-sm text-cyan-300 hover:underline" href="#">View All</a>
      </div>

      <div className="mt-4 w-full overflow-hidden">
        <div className="w-full">
          {sampleMissions.map((m) => (
            <div key={m.id} className="flex items-center justify-between gap-4 rounded-xl px-3 py-3 hover:backdrop-brightness-110">
              <div className="flex-1">
                <div className="font-medium text-cyan-100">{m.title}</div>
                <div className="text-xs text-gray-400">{m.subject}</div>
              </div>

              <div className="w-28 text-center text-sm text-gray-300">{m.students}</div>

              <div className="w-24 text-right">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs ${m.status === 'Published' ? 'bg-green-600/20 text-green-300' : 'bg-yellow-600/10 text-yellow-300'}`}>
                  {m.status}
                </span>
              </div>

              <div>
                <button className="rounded-md bg-cyan-500/20 px-3 py-2 text-sm font-medium text-cyan-300 hover:bg-cyan-500/30">Open</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
