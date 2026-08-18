import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Activity } from "lucide-react";
import { getHost } from "../lib/api";
import { Card, PageHeader } from "../components/ui";

const MAX_POINTS = 30;

export default function Monitoramento() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const tick = () =>
      getHost()
        .then((h) =>
          setHistory((prev) =>
            [...prev, { hora: new Date().toLocaleTimeString().slice(0, 8), cpu: h.cpu, mem: h.mem, disco: h.disk }].slice(-MAX_POINTS)
          )
        )
        .catch(() => {});
    tick();
    const i = setInterval(tick, 5000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Monitoramento" subtitle="Coleta a cada 5s (camada própria, sem depender de terceiros)" />

      <Card
        title={
          <span className="flex items-center gap-1">
            <Activity size={14} /> CPU, Memória e Disco em tempo real
          </span>
        }
      >
        <div className="h-72">
          {history.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <XAxis dataKey="hora" tick={{ fontSize: 10, fill: "#64748b" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#64748b" }} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="cpu" stroke="#38bdf8" strokeWidth={2} dot={false} name="CPU %" />
                <Line type="monotone" dataKey="mem" stroke="#34d399" strokeWidth={2} dot={false} name="Memória %" />
                <Line type="monotone" dataKey="disco" stroke="#a78bfa" strokeWidth={2} dot={false} name="Disco %" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-600">Coletando…</div>
          )}
        </div>
      </Card>

      <div className="text-xs text-slate-600">
        Essa tela usa o mesmo endpoint <code>/status/host</code> só que com coleta mais frequente. Se quiser
        histórico de verdade (mais que a sessão atual do navegador), o próximo passo é o agente gravar as
        métricas num banco de série temporal (ex: SQLite simples ou um CSV rotativo) e expor um endpoint de
        histórico.
      </div>
    </div>
  );
}
