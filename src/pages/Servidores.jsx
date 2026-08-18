import { useEffect, useState } from "react";
import { Server, Cpu, Activity, HardDrive, Clock } from "lucide-react";
import { getHost, formatUptime } from "../lib/api";
import { StatCard, Card, PageHeader, ErrorBanner } from "../components/ui";

export default function Servidores() {
  const [host, setHost] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getHost().then(setHost).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Servidores" subtitle="1 servidor monitorado" />
      <ErrorBanner message={error} />

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Server} label="Servidores" value="1" sub="1 monitorado" />
        <StatCard icon={Activity} label="Operacionais" value={host?.status === "Operacional" ? "1" : "0"} sub="100% no ar" accent="text-emerald-400" />
        <StatCard icon={Cpu} label="CPU do host" value={`${host?.cpu ?? "—"}%`} accent="text-amber-400" />
        <StatCard icon={Clock} label="Uptime" value={formatUptime(host?.uptimeSeconds)} accent="text-violet-400" />
      </section>

      <Card title="Inventário de servidores">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 text-xs">
              <th className="pb-2 font-normal">Host</th>
              <th className="pb-2 font-normal">CPU</th>
              <th className="pb-2 font-normal">Memória</th>
              <th className="pb-2 font-normal">Disco</th>
              <th className="pb-2 font-normal">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            <tr>
              <td className="py-3 text-slate-200">{host?.hostname || "—"}</td>
              <td className="py-3 text-slate-400">{host?.cpu ?? "—"}%</td>
              <td className="py-3 text-slate-400">{host?.mem ?? "—"}%</td>
              <td className="py-3 text-slate-400">{host?.disk ?? "—"}%</td>
              <td className="py-3">
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">{host?.status || "—"}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </Card>

      <div className="text-xs text-slate-600">
        Esta página já mostra dados reais do único host monitorado. Se no futuro você adicionar mais VPS,
        basta o agente rodar em cada um e o front listar vários hosts nessa mesma tabela.
      </div>
    </div>
  );
}
