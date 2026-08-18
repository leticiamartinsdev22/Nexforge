import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { getAlerts } from "../lib/api";
import { Card, PageHeader, EmptyState, StatCard } from "../components/ui";

const NIVEL_COLOR = {
  critico: "bg-rose-500/10 text-rose-400",
  aviso: "bg-amber-500/10 text-amber-400",
  info: "bg-sky-500/10 text-sky-400",
};

export default function Alertas() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    getAlerts().then(setAlerts);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Alertas" subtitle="Dados de exemplo — ver TODO em lib/api.js" />

      <section className="grid grid-cols-2 gap-4">
        <StatCard icon={AlertTriangle} label="Alertas ativos" value={alerts.length} accent="text-amber-400" />
        <StatCard icon={AlertTriangle} label="Críticos" value={alerts.filter((a) => a.nivel === "critico").length} accent="text-rose-400" />
      </section>

      <Card title="Alertas recentes">
        <div className="divide-y divide-slate-800 -mx-4">
          {alerts.length === 0 && <EmptyState text="Nenhum alerta no momento." />}
          {alerts.map((a, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 text-sm">
              <span className="text-slate-200">{a.titulo}</span>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>{a.quando}</span>
                <span className={`px-2 py-0.5 rounded-full ${NIVEL_COLOR[a.nivel] || NIVEL_COLOR.info}`}>{a.nivel}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
