// components/SystemStatus.tsx

import { Database, Shield, Wifi, Cpu } from "lucide-react";

export default function SystemStatus() {
  const status = [
    { key: "database", title: "Database", value: "Online" },
    { key: "security", title: "Security", value: "Protected" },
    { key: "network", title: "Network", value: "Connected" },
    { key: "ai_core", title: "AI Core", value: "Running" },
  ];

  const iconFor = (key: string) => {
    switch (key) {
      case "database":
        return <Database />;
      case "security":
        return <Shield />;
      case "network":
        return <Wifi />;
      case "ai_core":
        return <Cpu />;
      default:
        return <Database />;
    }
  };

  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-[#07101dcc] p-6 backdrop-blur-xl">
      <h2 className="mb-5 text-xl font-bold">System Status</h2>

      <div className="space-y-4">
        {status.map((item) => (
          <div key={item.key} className="flex items-center justify-between rounded-2xl bg-[#091625] p-4">
            <div className="flex items-center gap-3">
              <div className="text-cyan-400">{iconFor(item.key)}</div>
              <div>
                <h3>{item.title}</h3>
              </div>
            </div>

            <span className="font-bold text-green-400">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}