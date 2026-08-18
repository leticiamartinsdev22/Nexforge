# Painel VPS

Painel de monitoria de infraestrutura pra um VPS com várias aplicações — inspirado no fluxo
mostrado no vídeo (visão geral, servidores, aplicações, domínios, bancos, backups,
monitoramento, alertas, logs, segurança, topologia e configurações).

## Estrutura

```
painel-vps/
├── src/
│   ├── pages/          uma página por seção do menu lateral
│   ├── components/     Sidebar + componentes de UI reutilizáveis (Card, StatCard, etc.)
│   ├── lib/api.js       toda a comunicação com o agente do VPS
│   ├── App.jsx          rotas
│   └── main.jsx
├── vps-agent/           API que roda no VPS e coleta métricas reais
│   ├── server.js
│   ├── vps-agent.service
│   ├── nginx-painel-vps.conf
│   ├── DEPLOY.md         passo a passo completo de deploy
│   └── README.md
├── vite.config.js
└── package.json
```

## O que já é real vs. o que é exemplo

| Página | Status |
|---|---|
| Visão Geral | ✅ dados reais (host + apps + checks) |
| Servidores | ✅ dados reais (host) |
| Aplicações | ✅ dados reais (containers Docker), com botão de reiniciar |
| Monitoramento | ✅ dados reais (mesmo host, coleta mais frequente) |
| Domínios | ⚠️ mock — precisa endpoint novo no agente (`/status/domains`) |
| Bancos de Dados | ⚠️ mock — precisa endpoint novo (`/status/databases`) |
| Backups | ⚠️ mock, mas o botão "rodar backup agora" já dispara o `/actions/backup` real |
| Alertas | ⚠️ mock — precisa endpoint novo (`/status/alerts`) |
| Logs | ⚠️ mock — precisa endpoint novo (`/status/logs`) |
| Segurança | ⚠️ mock — precisa endpoint novo (`/status/security`) |
| Topologia | ✅ desenha com dados reais dos apps (sem endpoint extra) |
| Configurações | preferências locais de UI, não depende do agente |

Todo mock está isolado em `src/lib/api.js`, cada função tem um comentário `// TODO`
explicando exatamente qual endpoint criar no agente pra substituir por dado real.

## Rodando localmente

```bash
npm install
npm run dev
```

Isso sobe o front em `http://localhost:5173`. As chamadas pra `/api/vps-agent/*` são
redirecionadas pelo `vite.config.js` pra `http://localhost:4100` — ou seja, você precisa do
agente rodando local (ou via túnel SSH pro VPS) pra ver dados reais em dev:

```bash
ssh -L 4100:127.0.0.1:4100 usuario@seu-vps
```

## Deploy em produção

Ver `vps-agent/DEPLOY.md` — cobre agente (systemd), build do front, nginx com HTTPS
(certbot) e checklist de troubleshooting.

## Próximos passos sugeridos

1. Expandir o agente com os endpoints marcados como TODO (domínios, bancos, backups, logs, alertas, segurança)
2. Adicionar autenticação de usuário no próprio painel (hoje qualquer um que acesse o domínio vê tudo)
3. Guardar histórico de métricas em disco no agente, pra "Monitoramento" mostrar mais que a sessão atual
