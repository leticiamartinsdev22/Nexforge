import { useEffect, useState } from "react";
import { Archive, RotateCw } from "lucide-react";
import { getBackups, runBackup } from "../lib/api";
import { StatCard, Card, StatusPill, PageHeader, EmptyState } from "../components/ui";

export default function Backups() {
  const [backups, setBackups] = useState([]);
  const [running, setRunning] = useState(false);

  const load = () => getBackups().then(setBackups);

  useEffect(() => {
    load();
  }, []);

  const handleRun = async () => {
    setRunning(true);
    try {
      await runBackup();
    } finally {
      load();
      setTimeout(() => setRunning(false), 1000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Backups" subtitle="Dados de exemplo — ver TODO em lib/api.js" />
        <button
          onClick={handleRun}
          disabled={running}
          className="flex items-center gap-2 text-sm bg-sky-500/10 text-sky-400 px-3 py-1.5 rounded-lg hover:bg-sky-500/20 disabled:opacity-50"
        >
          <RotateCw size={14} className={running ? "animate-spin" : ""} /> {running ? "Rodando…" : "Rodar backup agora"}
        </button>
      </div>

      <section className="grid grid-cols-2 gap-4">
        <StatCard icon={Archive} label="Apps com backup em dia" value={`${backups.filter((b) => b.status === "Sucesso").length} de ${backups.length}`} />
        <StatCard icon={Archive} label="Tamanho total" value={`${backups.reduce((a, b) => a + b.tamanhoMB, 0).toFixed(1)} MB`} accent="text-violet-400" />
      </section>

      <Card title="Últimos backups">
        <div className="divide-y divide-slate-800 -mx-4">
          {backups.length === 0 && <EmptyState text="Nenhum backup registrado ainda." />}
          {backups.map((b) => (
            <div key={b.app} className="flex items-center justify-between px-4 py-3 text-sm">
              <span className="text-slate-200">{b.app}</span>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span>{b.ultimoBackup}</span>
                <span>{b.tamanhoMB} MB</span>
                <StatusPill status={b.status} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
