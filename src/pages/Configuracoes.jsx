import { useState } from "react";
import { Settings, Moon, Sun, Bell } from "lucide-react";
import { Card, PageHeader } from "../components/ui";

export default function Configuracoes() {
  const [tema, setTema] = useState("escuro");
  const [notificacoes, setNotificacoes] = useState(true);
  const [intervalo, setIntervalo] = useState(10);

  return (
    <div className="space-y-6">
      <PageHeader title="Configurações" subtitle="Preferências locais do painel (guardadas só nesta sessão por enquanto)" />

      <Card
        title={
          <span className="flex items-center gap-1">
            <Settings size={14} /> Geral
          </span>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300 flex items-center gap-2">
              {tema === "escuro" ? <Moon size={14} /> : <Sun size={14} />} Tema
            </span>
            <button
              onClick={() => setTema((t) => (t === "escuro" ? "claro" : "escuro"))}
              className="text-xs px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              {tema === "escuro" ? "Escuro" : "Claro"} (alternar)
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300 flex items-center gap-2">
              <Bell size={14} /> Notificações
            </span>
            <button
              onClick={() => setNotificacoes((n) => !n)}
              className={`w-10 h-6 rounded-full transition relative ${notificacoes ? "bg-sky-500" : "bg-slate-700"}`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition ${notificacoes ? "left-5" : "left-0.5"}`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">Intervalo de coleta</span>
            <select
              value={intervalo}
              onChange={(e) => setIntervalo(Number(e.target.value))}
              className="bg-slate-800 text-slate-200 text-xs rounded-lg px-2 py-1 border border-slate-700"
            >
              <option value={5}>5s</option>
              <option value={10}>10s</option>
              <option value={30}>30s</option>
              <option value={60}>60s</option>
            </select>
          </div>
        </div>
      </Card>

      <div className="text-xs text-slate-600">
        Nota técnica: essas preferências ainda não persistem (não usamos localStorage aqui de propósito, pra
        manter o artifact/preview compatível). No seu projeto real, dá pra salvar isso em localStorage ou num
        endpoint <code>/settings</code> do próprio agente.
      </div>
    </div>
  );
}
