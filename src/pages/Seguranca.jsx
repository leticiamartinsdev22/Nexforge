import { useEffect, useState } from "react";
import { ShieldCheck, Lock, Globe } from "lucide-react";
import { getSecurity } from "../lib/api";
import { StatCard, Card, PageHeader } from "../components/ui";

export default function Seguranca() {
  const [sec, setSec] = useState(null);

  useEffect(() => {
    getSecurity().then(setSec);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Segurança" subtitle="Dados de exemplo — ver TODO em lib/api.js" />

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={ShieldCheck} label="Certificados válidos" value={`${sec?.certificadosValidos ?? "—"} de ${sec?.certificadosTotal ?? "—"}`} />
        <StatCard icon={ShieldCheck} label="Menor prazo SSL" value={`${sec?.menorPrazoSSL ?? "—"}d`} accent="text-amber-400" />
        <StatCard icon={Globe} label="Portas públicas" value={sec?.portasPublicas?.length ?? "—"} accent="text-violet-400" />
        <StatCard icon={Lock} label="SSH" value={sec?.sshTailscaleOnly ? "Somente Tailscale" : "Público"} accent="text-emerald-400" />
      </section>

      <Card title="Hardening aplicado">
        <ul className="text-sm text-slate-300 space-y-2">
          <li className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-400" /> SSH restrito {sec?.sshTailscaleOnly ? "(via Tailscale)" : ""}
          </li>
          <li className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-400" /> Portas públicas: {sec?.portasPublicas?.join(", ") || "—"}
          </li>
        </ul>
      </Card>
    </div>
  );
}
