import { useEffect, useState } from "react";
import { Globe, ShieldCheck } from "lucide-react";
import { getDomains } from "../lib/api";
import { StatCard, Card, PageHeader } from "../components/ui";

export default function Dominios() {
  const [domains, setDomains] = useState([]);

  useEffect(() => {
    getDomains().then(setDomains);
  }, []);

  const menorPrazo = domains.length ? Math.min(...domains.map((d) => d.diasParaExpirar)) : "—";

  return (
    <div className="space-y-6">
      <PageHeader title="Domínios" subtitle="Certificados SSL e renovações (dados de exemplo — ver TODO em lib/api.js)" />

      <section className="grid grid-cols-2 gap-4">
        <StatCard icon={Globe} label="Domínios ativos" value={domains.length} />
        <StatCard icon={ShieldCheck} label="Menor prazo SSL" value={`${menorPrazo}d`} accent="text-amber-400" />
      </section>

      <Card title="Domínios monitorados">
        <div className="divide-y divide-slate-800 -mx-4">
          {domains.map((d) => (
            <div key={d.domain} className="flex items-center justify-between px-4 py-3 text-sm">
              <span className="text-slate-200">{d.domain}</span>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span>SSL {d.ssl}</span>
                <span>expira em {d.diasParaExpirar}d</span>
                <span className={d.autoRenov ? "text-emerald-400" : "text-rose-400"}>
                  {d.autoRenov ? "auto-renovação ativa" : "renovação manual"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
