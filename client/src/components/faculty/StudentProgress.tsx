interface StudentProgressProps {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
}

export default function StudentProgress({ total, completed, inProgress, notStarted }: StudentProgressProps) {
  const perc = (n: number) => (total ? Math.round((n / total) * 100) : 0);

  return (
    <div className="rounded-2xl border border-cyan-500/12 bg-[#061221cc] p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Student Progress Overview</h3>
        <a className="text-sm text-cyan-300 hover:underline" href="#">View All</a>
      </div>

      <div className="mt-4 flex gap-4 items-center">
        <div className="h-28 w-28 rounded-full bg-[#0b1720] flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold">{total}</div>
            <div className="text-xs text-gray-400">Students</div>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center justify-between text-sm mb-1"><span>Completed</span><span className="font-medium">{completed} ({perc(completed)}%)</span></div>
            <div className="h-3 w-full rounded bg-[#0b1720]">
              <div style={{ width: `${perc(completed)}%` }} className="h-3 rounded bg-cyan-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-sm mb-1"><span>In Progress</span><span className="font-medium">{inProgress} ({perc(inProgress)}%)</span></div>
            <div className="h-3 w-full rounded bg-[#0b1720]">
              <div style={{ width: `${perc(inProgress)}%` }} className="h-3 rounded bg-amber-500" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-sm mb-1"><span>Not Started</span><span className="font-medium">{notStarted} ({perc(notStarted)}%)</span></div>
            <div className="h-3 w-full rounded bg-[#0b1720]">
              <div style={{ width: `${perc(notStarted)}%` }} className="h-3 rounded bg-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
