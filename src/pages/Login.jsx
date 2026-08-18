import { useState } from "react";

export default function Login({ onLogin }) {
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);
    try {
      await onLogin(senha);
    } catch (err) {
      setErro(err.message || "Senha incorreta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "radial-gradient(circle at 15% 10%, rgba(37,99,235,0.35), transparent 40%), radial-gradient(circle at 85% 0%, rgba(56,189,248,0.25), transparent 35%), radial-gradient(circle at 50% 100%, rgba(59,130,246,0.2), transparent 45%), #000000",
      }}
    >
      <div className="w-full max-w-sm bg-blue-950/40 backdrop-blur-xl border border-blue-500/20 rounded-2xl shadow-2xl shadow-blue-500/10 p-8">
        {/* Logo Nexforge */}
        <div className="flex flex-col items-center mb-2">
          <svg width="64" height="64" viewBox="0 0 240 240" className="mb-3">
            <defs>
              <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
              <linearGradient id="cubeTop" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
            <rect width="240" height="240" rx="28" fill="#020617" />
            <g transform="translate(20, 15)">
              <path d="M100 8 L182 55 L182 148 L100 195 L18 148 L18 55 Z" fill="none" stroke="url(#hexGrad)" strokeWidth="11" />
              <path d="M62 72 L62 150 L84 150 L84 106 L116 150 L138 150 L138 72 L116 72 L116 116 L84 72 Z" fill="url(#cubeTop)" />
            </g>
          </svg>
          <h1 className="text-2xl font-bold tracking-wide text-white">
            NEX<span className="bg-gradient-to-br from-indigo-400 to-cyan-400 bg-clip-text text-transparent">FORGE</span>
          </h1>
          <p className="text-xs font-semibold tracking-[0.2em] text-sky-400 mt-1">INFRAESTRUTURA</p>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-base font-semibold text-slate-200">Painel de infraestrutura</h2>
          <p className="text-sm text-slate-400 mt-1">Acesso restrito à infraestrutura</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha"
            autoFocus
            className="w-full bg-black/40 border border-blue-500/20 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />

          {erro && <p className="text-sm text-rose-400 text-center">{erro}</p>}

          <button
            type="submit"
            disabled={loading || !senha}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition shadow-lg shadow-blue-600/30"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
