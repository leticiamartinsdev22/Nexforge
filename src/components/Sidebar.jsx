import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  Server,
  AppWindow,
  Globe,
  Database,
  Archive,
  Activity,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Share2,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../lib/auth";

const ITEMS = [
  { to: "/", label: "Visão Geral", icon: LayoutGrid, end: true },
  { to: "/servidores", label: "Servidores", icon: Server },
  { to: "/aplicacoes", label: "Aplicações", icon: AppWindow },
  { to: "/dominios", label: "Domínios", icon: Globe },
  { to: "/bancos-de-dados", label: "Bancos de Dados", icon: Database },
  { to: "/backups", label: "Backups", icon: Archive },
  { to: "/monitoramento", label: "Monitoramento", icon: Activity },
  { to: "/alertas", label: "Alertas", icon: AlertTriangle },
  { to: "/logs", label: "Logs", icon: FileText },
  { to: "/seguranca", label: "Segurança", icon: ShieldCheck },
  { to: "/topologia", label: "Topologia", icon: Share2 },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
];

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <nav className="w-56 shrink-0 border-r border-blue-500/20 bg-black/60 backdrop-blur-xl p-3 hidden md:flex md:flex-col gap-1">
      <div className="px-2 py-3 mb-2 flex items-center gap-2">
        <svg width="28" height="28" viewBox="0 0 240 240">
          <defs>
            <linearGradient id="hexGradSide" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
            <linearGradient id="cubeTopSide" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
          <rect width="240" height="240" rx="28" fill="#020617" />
          <g transform="translate(20, 15)">
            <path d="M100 8 L182 55 L182 148 L100 195 L18 148 L18 55 Z" fill="none" stroke="url(#hexGradSide)" strokeWidth="11" />
            <path d="M62 72 L62 150 L84 150 L84 106 L116 150 L138 150 L138 72 L116 72 L116 116 L84 72 Z" fill="url(#cubeTopSide)" />
          </g>
        </svg>
        <span className="text-slate-100 font-bold text-sm tracking-wide">
          NEX<span className="bg-gradient-to-br from-indigo-400 to-cyan-400 bg-clip-text text-transparent">FORGE</span>
        </span>
      </div>
      {ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
              isActive
                ? "bg-sky-500/15 text-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.15)]"
                : "text-slate-400 hover:bg-blue-950/50 hover:text-slate-200"
            }`
          }
        >
          <Icon size={16} />
          {label}
        </NavLink>
      ))}

      <button
        onClick={logout}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-blue-950/50 hover:text-rose-400 transition mt-auto"
      >
        <LogOut size={16} />
        Sair
      </button>
    </nav>
  );
}
