// Agente de monitoria — versão focada em Docker (funciona em Linux, Windows e Mac
// com Docker Desktop, sem depender de systemctl/systemd).
//
// Instalação (qualquer SO com Node + Docker):
//   cd vps-agent
//   npm install
//   node server.js

const express = require("express");
const si = require("systeminformation");
const Docker = require("dockerode");
const { exec } = require("child_process");
const util = require("util");
const execAsync = util.promisify(exec);

const app = express();
app.use(express.json());

// CORS: necessário porque o front vai rodar em outro domínio (Koyeb) e
// precisa poder chamar esse agente através do túnel do Cloudflare.
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "*");
  res.header("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

const PORT = process.env.AGENT_PORT || 4100;
const TOKEN = process.env.AGENT_TOKEN || "troque-este-token"; // autenticação simples

// No Windows, o Docker Desktop expõe o socket via named pipe; no Linux/Mac é o
// socket unix padrão. O dockerode detecta isso sozinho na maioria dos casos,
// mas deixamos explícito pra evitar erro de conexão no Windows.
const docker =
  process.platform === "win32"
    ? new Docker({ socketPath: "//./pipe/docker_engine" })
    : new Docker(); // usa /var/run/docker.sock por padrão

// ---- Middleware de autenticação simples via header ----
app.use((req, res, next) => {
  const auth = req.headers["authorization"];
  if (auth !== `Bearer ${TOKEN}`) {
    return res.status(401).json({ error: "não autorizado" });
  }
  next();
});

// ---- GET /status/host : métricas gerais da máquina (funciona em qualquer SO) ----
app.get("/status/host", async (req, res) => {
  try {
    const [cpu, mem, disk, time, osInfo] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.time(),
      si.osInfo(),
    ]);

    const diskTotal = disk.reduce((a, d) => a + d.size, 0);
    const diskUsed = disk.reduce((a, d) => a + d.used, 0);

    res.json({
      hostname: osInfo.hostname,
      cpu: Math.round(cpu.currentLoad),
      mem: Math.round((mem.active / mem.total) * 100),
      memUsedGB: +(mem.active / 1e9).toFixed(1),
      memTotalGB: +(mem.total / 1e9).toFixed(1),
      disk: diskTotal > 0 ? Math.round((diskUsed / diskTotal) * 100) : 0,
      diskUsedGB: +(diskUsed / 1e9).toFixed(1),
      diskTotalGB: +(diskTotal / 1e9).toFixed(1),
      uptimeSeconds: time.uptime,
      status: "Operacional",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- GET /status/apps : lista containers Docker e uso de recursos (real) ----
app.get("/status/apps", async (req, res) => {
  try {
    const containers = await docker.listContainers({ all: true });

    const apps = await Promise.all(
      containers.map(async (c) => {
        let cpuPercent = 0;
        let memMB = 0;
        if (c.State === "running") {
          try {
            const container = docker.getContainer(c.Id);
            const stats = await container.stats({ stream: false });
            const cpuDelta =
              stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
            const systemDelta =
              stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
            const cores = stats.cpu_stats.online_cpus || 1;
            cpuPercent = systemDelta > 0 ? +(((cpuDelta / systemDelta) * cores) * 100).toFixed(1) : 0;
            memMB = +(stats.memory_stats.usage / 1e6).toFixed(0);
          } catch {
            // container pode ter parado entre a listagem e a leitura de stats
          }
        }
        return {
          name: c.Names[0]?.replace("/", "") || c.Id.slice(0, 12),
          image: c.Image,
          status: c.State === "running" ? "Operacional" : "Parado",
          cpu: cpuPercent,
          mem: memMB,
        };
      })
    );

    res.json({ apps });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- POST /actions/backup : dispara script de backup ----
// TODO: no Windows não existe .sh nativo; ajuste esse comando pra algo que
// funcione no seu ambiente (ex: um .bat, ou um script Node próprio) quando
// for automatizar backup de verdade. Por ora só retorna sucesso simulado.
app.post("/actions/backup", async (req, res) => {
  res.json({ ok: true, message: "Backup (placeholder — configure seu script de backup real aqui)" });
});

// ---- POST /actions/restart/:container : reinicia um container específico (real) ----
app.post("/actions/restart/:container", async (req, res) => {
  try {
    const container = docker.getContainer(req.params.container);
    await container.restart();
    res.json({ ok: true, message: `${req.params.container} reiniciado` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- POST /actions/check : verificação geral simplificada (sem systemctl) ----
// Só confirma que o Docker está acessível — evolua depois se quiser mais checks.
app.post("/actions/check", async (req, res) => {
  try {
    await docker.ping();
    res.json({ ok: true, message: "Docker acessível, tudo certo" });
  } catch (err) {
    res.status(500).json({ error: "Docker não respondeu: " + err.message });
  }
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Agente rodando em http://127.0.0.1:${PORT} (plataforma: ${process.platform})`);
  console.log(`Pra acessar de fora (Koyeb), rode o túnel do Cloudflare apontando pra essa porta.`);
});
