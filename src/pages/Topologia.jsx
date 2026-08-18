import { useEffect, useState } from "react";
import { getApps } from "../lib/api";
import { PageHeader } from "../components/ui";

// Layout simples em grade com "linhas" (SVG) ligando cada app a um nó central,
// no espírito do "Mapa de Serviços" do vídeo. Sem libs de grafo pesadas.
export default function Topologia() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    getApps().then((d) => setApps(d.apps || []));
  }, []);

  const cols = 3;
  const cellW = 220;
  const cellH = 110;
  const rows = Math.ceil(apps.length / cols) || 1;
  const width = cols * cellW;
  const height = rows * cellH + 140;
  const centerX = width / 2;
  const centerY = 60;

  return (
    <div className="space-y-6">
      <PageHeader title="Topologia" subtitle="Visão geral de como as aplicações se conectam ao host" />

      <div className="bg-blue-950/40 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-4 overflow-x-auto">
        <svg width={width} height={height} className="mx-auto">
          {/* nó central: o host */}
          <circle cx={centerX} cy={centerY} r={28} fill="#0ea5e9" opacity={0.15} />
          <circle cx={centerX} cy={centerY} r={18} fill="#38bdf8" />
          <text x={centerX} y={centerY + 45} textAnchor="middle" fontSize="11" fill="#94a3b8">
            host (VPS)
          </text>

          {apps.map((app, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = col * cellW + cellW / 2;
            const y = row * cellH + 140;
            const color = app.status === "Operacional" ? "#34d399" : "#f59e0b";
            return (
              <g key={app.name}>
                <line x1={centerX} y1={centerY + 20} x2={x} y2={y - 20} stroke="#1e293b" strokeWidth={1.5} />
                <rect x={x - 80} y={y - 20} width={160} height={56} rx={12} fill="#0f172a" stroke="#1e293b" />
                <circle cx={x - 62} cy={y - 2} r={4} fill={color} />
                <text x={x - 50} y={y + 2} fontSize="12" fill="#e2e8f0">
                  {app.name.length > 16 ? app.name.slice(0, 16) + "…" : app.name}
                </text>
                <text x={x - 62} y={y + 20} fontSize="10" fill="#64748b">
                  CPU {app.cpu}% · {app.mem}MB
                </text>
              </g>
            );
          })}
        </svg>
        {apps.length === 0 && <div className="text-center text-xs text-slate-600 py-8">Nenhum app pra desenhar ainda.</div>}
      </div>

      <div className="text-xs text-slate-600">
        Esse mapa é gerado a partir dos mesmos dados de <code>/status/apps</code> — sem endpoint novo. Dá pra
        evoluir depois pra mostrar dependências reais entre apps (ex: qual usa qual banco), se você guardar
        essa relação em um arquivo de config (tipo o <code>apps.json</code> que aparece no vídeo original).
      </div>
    </div>
  );
}
