import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

const SESSION_KEY = "painel_vps_auth";
// Troque por uma verificação real (ex: chamada ao agente) quando integrar de vez.
// Por enquanto, valida contra uma senha fixa só pra existir o fluxo de login.
const SENHA_VALIDA = "admin2212";

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");

  const login = useCallback(async (senha) => {
    // TODO: trocar por chamada real, ex:
    // const res = await fetch("/api/vps-agent/auth/login", { method: "POST", body: JSON.stringify({ senha }) });
    await new Promise((r) => setTimeout(r, 500)); // simula latência de rede
    if (senha !== SENHA_VALIDA) {
      throw new Error("Senha incorreta");
    }
    sessionStorage.setItem(SESSION_KEY, "1");
    setAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthenticated(false);
  }, []);

  return <AuthContext.Provider value={{ authenticated, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de <AuthProvider>");
  return ctx;
}
