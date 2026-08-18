import { useEffect, useState } from "react";
import { Database } from "lucide-react";
import { getDatabases } from "../lib/api";
import { StatCard, Card, StatusPill, PageHeader, EmptyState } from "../components/ui";

export default function BancosDeDados() {
  const [dbs, setDbs] = useState([]);

  useEffect(() => {
    getDatabases().then(setDbs);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Bancos de Dados" subtitle="Dados de exemplo — ver TODO em lib/api.js" />

      <section className="grid grid-cols-2 gap-4">
        <StatCard icon={Database} label="Bancos" value={dbs.length} />
        <StatCard icon={Database} label="Em execução" value={dbs.filter((d) => d.status === "Operacional").length} accent="text-emerald-400" />
      </section>

      <Card title="Instâncias">
        <div className="divide-y divide-slate-800 -mx-4">
          {dbs.length === 0 && <EmptyState text="Nenhum banco configurado ainda." />}
          {dbs.map((db) => (
            <div key={db.name} className="flex items-center justify-between px-4 py-3 text-sm">
              <div>
                <div className="text-slate-200">{db.name}</div>
                <div className="text-xs text-slate-500">{db.tipo}</div>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span>{db.memMB} MB</span>
                <span>{db.conexoes} conexões</span>
                <StatusPill status={db.status} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
