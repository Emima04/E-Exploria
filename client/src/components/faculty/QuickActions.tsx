export default function QuickActions() {
  const actions = [
    { label: "Create Mission" },
    { label: "Create Quiz" },
    { label: "Add Study Material" },
    { label: "View Students" },
    { label: "View Reports" },
  ];

  return (
    <div className="rounded-2xl border border-cyan-500/12 bg-[#061221cc] p-4">
      <h3 className="font-semibold">Quick Actions</h3>
      <div className="mt-3 flex flex-wrap gap-3">
        {actions.map(a => (
          <button key={a.label} className="rounded-md bg-cyan-500/20 px-3 py-2 text-sm text-cyan-200 hover:bg-cyan-500/30">{a.label}</button>
        ))}
      </div>
    </div>
  );
}
