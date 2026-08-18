import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { getLogs } from "../lib/api";
import { Card, PageHeader } from "../components/ui";

const FONTES = ["painel", "nginx", "agente"];

export default function Logs() {
  const [fonte, setFonte] = useState("painel");
  const [lines, setLines] = useState([]);

  useEffect(() => {
    getLogs(fonte).then(setLines);
  }, [fonte]);

  return (
    <div className="space-y-6">
      <PageHeader title="Logs" subtitle="Dados de exemplo — ver TODO em lib/api.js" />

      <div className="flex gap-2">
        {FONTES.map((f) => (
          <button
            key={f}
            onClick={() => setFonte(f)}
            className={`text-xs px-3 py-1.5 rounded-lg border ${
              fonte === f ? "bg-sky-500/10 border-sky-500/40 text-sky-400" : "border-blue-500/20 text-slate-400 hover:bg-blue-950/50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <Card
        title={
          <span className="flex items-center gap-1">
            <FileText size={14} /> {fonte}
          </span>
        }
      >
        <pre className="text-xs text-slate-400 bg-black rounded-xl p-3 overflow-x-auto max-h-96">
          {lines.join("\n") || "Sem linhas de log ainda."}
        </pre>
      </Card>
    </div>
  );
}
