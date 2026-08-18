import { useEffect, useState, useCallback } from "react";
import { AppWindow, Boxes, Clock } from "lucide-react";
import { getApps, restartContainer } from "../lib/api";
import { StatCard, Card, StatusPill, PageHeader, ErrorBanner, EmptyState } from "../components/ui";

export default function Aplicacoes() {
  const [apps, setApps] = useState([]);
  const [error, setError] = useState(null);
  const [restarting, setRestarting] = useState(null);

  const load = useCallback(() => {
    getApps()
      .then((d) => setApps(d.apps || []))
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    load();
    const i = setInterval(load, 10000);
    return () => clearInterval(i);
  }, [load]);

  const handleRestart = async (name) => {
    setRestarting(name);
    try {
      await restartContainer(name);
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setTimeout(() => setRestarting(null), 1000);
    }
  };

  const online = apps.filter((a) => a.status === "Operacional").length;

  return (
    <div className="space-y-6">
      <PageHeader title="Aplicações" subtitle={`${apps.length} aplicações · ${online} online`} />
      <ErrorBanner message={error} />

      <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard icon={AppWindow} label="Aplicações online" value={`${online} de ${apps.length}`} />
        <StatCard icon={Boxes} label="Containers ativos" value={apps.length} accent="text-emerald-400" />
        <StatCard icon={Clock} label="Atualizado" value="agora" accent="text-violet-400" />
      </section>

      <Card title="Aplicações hospedadas">
        <div className="divide-y divide-slate-800 -mx-4">
          {apps.length === 0 && <EmptyState text="Nenhum container encontrado pelo agente." />}
          {apps.map((app) => (
            <div key={app.name} className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="text-sm font-medium text-slate-100">{app.name}</div>
                <div className="text-xs text-slate-500">{app.image}</div>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span>CPU {app.cpu}%</span>
                <span>Mem {app.mem} MB</span>
                <StatusPill status={app.status} />
                <button
                  onClick={() => handleRestart(app.name)}
                  disabled={restarting === app.name}
                  className="text-sky-400 hover:text-sky-300 text-xs disabled:opacity-50"
                >
                  {restarting === app.name ? "Reiniciando…" : "Reiniciar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
