import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import VisaoGeral from "./pages/VisaoGeral";
import Servidores from "./pages/Servidores";
import Aplicacoes from "./pages/Aplicacoes";
import Dominios from "./pages/Dominios";
import BancosDeDados from "./pages/BancosDeDados";
import Backups from "./pages/Backups";
import Monitoramento from "./pages/Monitoramento";
import Alertas from "./pages/Alertas";
import Logs from "./pages/Logs";
import Seguranca from "./pages/Seguranca";
import Topologia from "./pages/Topologia";
import Configuracoes from "./pages/Configuracoes";
import { AuthProvider, useAuth } from "./lib/auth";

function AppRoutes() {
  const { authenticated, login } = useAuth();

  if (!authenticated) {
    return <Login onLogin={login} />;
  }

  return (
    <div
      className="flex min-h-screen text-slate-100"
      style={{
        background:
          "radial-gradient(circle at 15% 10%, rgba(37,99,235,0.35), transparent 40%), radial-gradient(circle at 85% 0%, rgba(56,189,248,0.25), transparent 35%), radial-gradient(circle at 50% 100%, rgba(59,130,246,0.2), transparent 45%), #000000",
      }}
    >
      <Sidebar />
      <main className="flex-1 p-6 overflow-x-hidden">
        <Routes>
          <Route path="/" element={<VisaoGeral />} />
          <Route path="/servidores" element={<Servidores />} />
          <Route path="/aplicacoes" element={<Aplicacoes />} />
          <Route path="/dominios" element={<Dominios />} />
          <Route path="/bancos-de-dados" element={<BancosDeDados />} />
          <Route path="/backups" element={<Backups />} />
          <Route path="/monitoramento" element={<Monitoramento />} />
          <Route path="/alertas" element={<Alertas />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/seguranca" element={<Seguranca />} />
          <Route path="/topologia" element={<Topologia />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
