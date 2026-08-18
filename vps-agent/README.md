# VPS Agent

Agente leve que roda no seu VPS e expõe métricas (CPU, memória, disco, containers Docker) via API HTTP local, para o painel React consumir.

## Instalação

```bash
mkdir -p /opt/vps-agent/scripts
# copie server.js e package.json para /opt/vps-agent
cd /opt/vps-agent
npm install
```

Crie os scripts referenciados (ou aponte para os seus já existentes):

```bash
touch scripts/backup.sh scripts/health-check.sh
chmod +x scripts/backup.sh scripts/health-check.sh
```

## Rodar como serviço (systemd)

```bash
cp vps-agent.service /etc/systemd/system/vps-agent.service
systemctl daemon-reload
systemctl enable --now vps-agent
systemctl status vps-agent
```

Edite o `AGENT_TOKEN` no arquivo `.service` antes de subir — é o token que o dashboard vai usar no header `Authorization: Bearer <token>`.

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| GET | `/status/host` | CPU, memória, disco, uptime |
| GET | `/status/apps` | Lista containers Docker com CPU/memória |
| GET | `/status/checks` | Status de serviços systemd (nginx, docker, etc.) |
| POST | `/actions/backup` | Dispara script de backup |
| POST | `/actions/restart/:container` | Reinicia um container específico |
| POST | `/actions/check` | Roda verificação/health-check geral |

Todas as rotas exigem header:
```
Authorization: Bearer <AGENT_TOKEN>
```

## Importante: segurança

O agente escuta só em `127.0.0.1` (não exposto à internet). Para o dashboard (rodando no navegador) acessar, você precisa de um proxy reverso (nginx) que:
1. Fica exposto publicamente com HTTPS
2. Encaminha para `127.0.0.1:4100`
3. Idealmente adiciona autenticação extra (ex: Tailscale, IP allowlist, ou login no próprio painel)

Exemplo de bloco nginx:

```nginx
location /api/vps-agent/ {
    proxy_pass http://127.0.0.1:4100/;
    proxy_set_header Authorization "Bearer troque-este-token-por-um-seguro";
}
```

Assim o front chama `/api/vps-agent/status/host` sem precisar expor o token no navegador.

## Próximo passo

No `vps-dashboard.jsx`, troque os mocks por `fetch("/api/vps-agent/status/host")` etc., usando `useEffect` + `setInterval` para atualizar periodicamente (ex: a cada 10s).
