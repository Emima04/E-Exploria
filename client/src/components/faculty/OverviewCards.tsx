interface OverviewProps {
  totalStudents: number;
  activeMissions: number;
  completedMissions: number;
  averageXp: number;
}

export default function OverviewCards({ totalStudents, activeMissions, completedMissions, averageXp }: OverviewProps) {
  const cards = [
    { title: "Total Students", value: totalStudents },
    { title: "Active Missions", value: activeMissions },
    { title: "Missions Completed", value: completedMissions },
    { title: "Average Class XP", value: averageXp },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((c) => (
        <div key={c.title} className="flex-1 rounded-2xl border border-cyan-500/12 bg-[#061221cc] p-5 backdrop-blur-md shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400">{c.title}</p>
              <h3 className="mt-2 text-3xl font-bold">{c.value}</h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
