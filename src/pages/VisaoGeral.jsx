import { useEffect, useState, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Cpu, Activity, HardDrive, AppWindow, RotateCw, Database, Power, ShieldCheck, CircleCheck, CircleAlert } from "lucide-react";
import { getHost, getApps, runBackup, runCheck, formatUptime } from "../lib/api";
import { StatCard, Card, ErrorBanner, EmptyState, PageHeader } from "../components/ui";

const MAX_HISTORY_POINTS = 24;

function ActionButton({ icon: Icon, title, desc, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-xl bg-blue-950/30 backdrop-blur-md hover:bg-blue-900/40 border border-blue-500/20 transition text-left"
    >
      <div className={`p-2 rounded-lg ${danger ? "bg-rose-500/10 text-rose-400" : "bg-sky-500/10 text-sky-400"}`}>
        <Icon size={18} />
      </div>
      <div>
        <div className="text-sm font-medium text-slate-100">{title}</div>
        <div className="text-xs text-slate-500">{desc}</div>
      </div>
    </button>
  );
}

export default function VisaoGeral() {
  const [host, setHost] = useState(null);
  const [apps, setApps] = useState([]);
  const [history, setHistory] = useState([]);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      const [hostData, appsData] = await Promise.all([getHost(), getApps()]);
      setHost(hostData);
      setApps(appsData.apps || []);
      setHistory((prev) =>
        [...prev, { hora: new Date().toLocaleTimeString().slice(0, 5), cpu: hostData.cpu, mem: hostData.mem }].slice(
          -MAX_HISTORY_POINTS
        )
      );
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 10000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const runAction = async (name, fn) => {
    setBusy(name);
    try {
      await fn();
      await fetchAll();
    } catch (err) {
      setError(err.message);
    } finally {
      setTimeout(() => setBusy(null), 1000);
    }
  };

  if (loading) return <div className="text-slate-500 text-sm">Carregando métricas do host…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Visão Geral" subtitle={`${host?.hostname || "host"} · uptime ${formatUptime(host?.uptimeSeconds)}`} />
        <span className="flex items-center gap-1 text-sm bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full">
          <CircleCheck size={14} /> {host?.status || "—"}
        </span>
      </div>

      <ErrorBanner message={error && `Não foi possível atualizar: ${error}. Verifique se o agente e o proxy estão no ar.`} />

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Cpu} label="CPU" value={`${host?.cpu ?? "—"}%`} />
        <StatCard
          icon={Activity}
          label="Memória"
          value={`${host?.memory ?? "—"}%`}
          sub={host ? `${host.memUsedGB} / ${host.memTotalGB} GB` : null}
          accent="text-emerald-400"
        />
        <StatCard
          icon={HardDrive}
          label="Disco"
          value={`${host?.disk ?? "—"}%`}
          sub={host ? `${host.diskUsedGB} / ${host.diskTotalGB} GB` : null}
          accent="text-violet-400"
        />
        <StatCard
          icon={AppWindow}
          label="Apps online"
          value={`${apps.filter((a) => a.status === "Operacional").length}/${apps.length}`}
          accent="text-amber-400"
        />
      </section>

      <Card title="Desempenho do host · sessão atual">
        <div className="h-48">
          {history.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <XAxis dataKey="hora" hide />
                <YAxis hide domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "#94a3b8" }}
                />
                <Line type="monotone" dataKey="cpu" stroke="#38bdf8" strokeWidth={2} dot={false} name="CPU %" />
                <Line type="monotone" dataKey="mem" stroke="#34d399" strokeWidth={2} dot={false} name="Memória %" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-600">
              Coletando histórico… volte em alguns segundos
            </div>
          )}
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="space-y-2">
          <h2 className="text-sm font-medium text-slate-300 mb-1">Ações rápidas</h2>
          <ActionButton icon={RotateCw} title="Verificar Docker" desc="Confirma se o Docker está acessível" onClick={() => runAction("check", runCheck)} />
          <ActionButton icon={Database} title="Backup agora" desc="Placeholder — configure seu script de backup real" onClick={() => runAction("backup", runBackup)} />
          <ActionButton icon={Power} title="Reiniciar todos" desc="Reinicia containers em ordem (a implementar)" onClick={() => runAction("restart", runCheck)} danger />
          {busy && <div className="text-xs text-sky-400 pl-1 animate-pulse">Executando: {busy}…</div>}
        </section>

        <Card title="Resumo dos containers">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="text-2xl font-semibold text-emerald-400">{apps.filter((a) => a.status === "Operacional").length}</div>
              <div className="text-xs text-slate-500">rodando</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-amber-400">{apps.filter((a) => a.status !== "Operacional").length}</div>
              <div className="text-xs text-slate-500">parados</div>
            </div>
          </div>
        </Card>
      </div>

      <section>
        <h2 className="text-sm font-medium text-slate-300 mb-2">Aplicações hospedadas</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {apps.length === 0 && <EmptyState text="Nenhum container encontrado pelo agente." />}
          {apps.map((app) => (
            <div key={app.name} className="bg-blue-950/40 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-slate-100">{app.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${app.status === "Operacional" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                  {app.status}
                </span>
              </div>
              <div className="text-xs text-slate-500 mb-2">{app.image}</div>
              <div className="flex gap-4 text-xs text-slate-400">
                <span>CPU {app.cpu}%</span>
                <span>Mem {app.mem} MB</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
