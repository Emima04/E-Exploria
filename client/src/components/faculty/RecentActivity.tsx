interface Student {
  id?: number;
  ID?: number;
  explorer_name?: string;
  xp?: number;
  last_active?: string;
}

export default function RecentActivity({ students }: { students: Student[] }) {
  return (
    <div className="rounded-2xl border border-cyan-500/12 bg-[#061221cc] p-4">
      <h3 className="font-semibold">Recent Student Activity</h3>
      <ul className="mt-3 space-y-3 text-sm text-gray-300">
        {students.length === 0 ? (
          <li className="py-4 text-gray-400">No registered students yet.</li>
        ) : students.slice(0, 5).map((student) => (
          <li key={student.ID ?? student.id ?? student.explorer_name} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-[#0b1720] flex items-center justify-center text-cyan-300 font-semibold">{student.explorer_name?.charAt(0).toUpperCase() || "E"}</div>
              <div>
                <div className="font-medium">{student.explorer_name || "Unnamed student"}</div>
                <div className="text-xs text-gray-400">{student.last_active || "No activity recorded"}</div>
              </div>
            </div>
            <div className="text-sm font-medium text-green-300">{student.xp ?? 0} XP</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
