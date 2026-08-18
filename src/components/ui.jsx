export function StatCard({ icon: Icon, label, value, sub, accent = "text-sky-400" }) {
  return (
    <div className="bg-blue-950/40 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-slate-400 text-sm">
        <Icon size={16} className={accent} />
        <span>{label}</span>
      </div>
      <div className="text-2xl font-semibold text-slate-100">{value}</div>
      {sub && <div className="text-xs text-slate-500">{sub}</div>}
    </div>
  );
}

export function StatusPill({ status }) {
  const ok = status === "Operacional" || status === "ok" || status === "Ativo" || status === "Sucesso";
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full ${
        ok ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
      }`}
    >
      {status}
    </span>
  );
}

export function Card({ title, action, children, className = "" }) {
  return (
    <section className={`bg-blue-950/40 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-4 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-3">
          {title && <h2 className="text-sm font-medium text-slate-300">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 text-sm bg-rose-500/10 text-rose-400 px-4 py-2 rounded-xl">
      {message}
    </div>
  );
}

export function EmptyState({ text }) {
  return <div className="text-xs text-slate-600 px-1 py-2">{text}</div>;
}

export function PageHeader({ title, subtitle }) {
  return (
    <header>
      <h1 className="text-xl font-semibold text-slate-100">{title}</h1>
      {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
    </header>
  );
}
