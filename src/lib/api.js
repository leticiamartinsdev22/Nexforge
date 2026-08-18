// Camada única de acesso à API do agente. Todas as páginas importam daqui.
//
// USE_MOCK = true faz TODAS as funções devolverem dados de exemplo, sem
// precisar do agente rodando em lugar nenhum. Quando você tiver o VPS com o
// agente no ar, é só trocar pra false (ou apagar essa flag e usar sempre o
// caminho real).
const USE_MOCK = false;

// Conectar no servidor real em localhost:4100
const API_BASE = "https://localhost:4101";
const AGENT_TOKEN = "57e40baa6406dcc50a65fea7f9fd14edb2ab60a4e3d8384f";

async function fetchWithAuth(endpoint) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${AGENT_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
}

async function apiGet(path) {
  return fetchWithAuth(path);
}

async function apiPost(path) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${AGENT_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Falha ao executar ${path}`);
  }
  
  return response.json();
}

// pequeno atraso artificial pra simular latência de rede real
const wait = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export function formatUptime(seconds) {
  if (seconds === undefined || seconds === null) return "—";
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  return `${d}d ${h}h`;
}

// ---- MOCKS: usados enquanto USE_MOCK = true ----
let mockCpu = 42;
let mockMem = 55;

async function mockGetHost() {
  await wait();
  // varia um pouco a cada chamada pra o gráfico não ficar uma linha reta
  mockCpu = Math.max(10, Math.min(95, mockCpu + (Math.random() * 10 - 5)));
  mockMem = Math.max(10, Math.min(95, mockMem + (Math.random() * 6 - 3)));
  return {
    hostname: "meu-vps-exemplo",
    cpu: Math.round(mockCpu),
    mem: Math.round(mockMem),
    memUsedGB: +((mockMem / 100) * 8.3).toFixed(1),
    memTotalGB: 8.3,
    disk: 29,
    diskUsedGB: 43.4,
    diskTotalGB: 158.3,
    uptimeSeconds: 15 * 86400,
    status: "Operacional",
  };
}

async function mockGetApps() {
  await wait();
  return {
    apps: [
      { name: "FinFlow", image: "finflow-backend:latest", status: "Operacional", cpu: 2.1, mem: 248 },
      { name: "Painel VPS", image: "painel-vps-front:latest", status: "Operacional", cpu: 0.4, mem: 91 },
      { name: "Site Pessoal", image: "nginx:alpine", status: "Operacional", cpu: 0.1, mem: 40 },
      { name: "API Testes", image: "api-testes:dev", status: "Parado", cpu: 0, mem: 0 },
    ],
  };
}

// ---- Rotas de host / apps / ações (Docker real) ----
export const getHost = () => (USE_MOCK ? mockGetHost() : apiGet("/status/host"));
export const getApps = () => (USE_MOCK ? mockGetApps() : apiGet("/status/apps"));
export const runBackup = () => (USE_MOCK ? wait(800).then(() => ({ ok: true })) : apiPost("/actions/backup"));
export const runCheck = () => (USE_MOCK ? wait(800).then(() => ({ ok: true })) : apiPost("/actions/check"));
export const restartContainer = (name) =>
  USE_MOCK ? wait(800).then(() => ({ ok: true })) : apiPost(`/actions/restart/${name}`);

// ---- TODO: implementar essas rotas no agente quando for expandir ----
// Já mockadas por padrão; troque o corpo por `apiGet(...)` assim que a rota
// existir de verdade no server.js.

export async function getDomains() {
  await wait();
  return [
    { domain: "painel.seudominio.com.br", ssl: "ativo", diasParaExpirar: 88, autoRenov: true },
    { domain: "app.seudominio.com.br", ssl: "ativo", diasParaExpirar: 51, autoRenov: true },
  ];
}

export async function getDatabases() {
  await wait();
  return [{ name: "app-postgres", tipo: "PostgreSQL", status: "Operacional", memMB: 128, conexoes: 6 }];
}

export async function getBackups() {
  await wait();
  return [
    { app: "Painel VPS", ultimoBackup: "há 12h", tamanhoMB: 2.5, status: "Sucesso" },
    { app: "FinFlow", ultimoBackup: "há 12h", tamanhoMB: 8.1, status: "Sucesso" },
  ];
}

export async function getAlerts() {
  await wait();
  return [{ titulo: "Reinício pendente após atualização", nivel: "aviso", quando: "há 9h" }];
}

export async function getLogs(fonte = "painel") {
  await wait();
  return [
    `[${new Date().toLocaleTimeString()}] (${fonte}) GET /status/host 200`,
    `[${new Date().toLocaleTimeString()}] (${fonte}) GET /status/apps 200`,
    `[${new Date().toLocaleTimeString()}] (${fonte}) exemplo de linha de log mockada`,
  ];
}

export async function getSecurity() {
  await wait();
  return {
    certificadosValidos: 2,
    certificadosTotal: 2,
    menorPrazoSSL: 51,
    portasPublicas: ["80", "443"],
    sshTailscaleOnly: true,
  };
}
