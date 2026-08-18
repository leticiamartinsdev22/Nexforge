import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Em dev, redireciona chamadas de API pro agente rodando local/túnel.
      // Em produção quem faz isso é o nginx (ver DEPLOY.md).
      "/api/vps-agent": {
        target: "http://localhost:4100",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/vps-agent/, ""),
      },
    },
  },
});
