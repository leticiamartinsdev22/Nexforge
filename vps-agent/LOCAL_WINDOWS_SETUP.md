# Rodando local no Windows com Docker Desktop (dados reais, sem VPS)

Isso faz o painel mostrar dados **reais** dos containers que você já tem no
Docker Desktop, sem precisar de nenhum servidor remoto.

## 1. Confirme que o Docker Desktop está rodando

Abre o Docker Desktop normalmente. Depois, no PowerShell:
```powershell
docker ps
```
Se listar containers (ou uma tabela vazia sem erro), tá tudo certo.

## 2. Instalar e rodar o agente

```powershell
cd C:\Users\Copagri\Downloads\painel-vps-ls\painel-vps\vps-agent
npm install
$env:AGENT_TOKEN="um-token-qualquer-para-teste"
node server.js
```
Deve aparecer: `Agente rodando em http://127.0.0.1:4100 (plataforma: win32)`

Deixa essa janela do PowerShell aberta.

## 3. Testar se está pegando dados reais

Em **outra** janela do PowerShell:
```powershell
curl -H "Authorization: Bearer um-token-qualquer-para-teste" http://127.0.0.1:4100/status/apps
```
Deve retornar um JSON com os containers reais que você tem no Docker Desktop.

## 4. Rodar o front

Em uma terceira janela do PowerShell:
```powershell
cd C:\Users\Copagri\Downloads\painel-vps-ls\painel-vps
npm run dev
```
Abre `http://localhost:5173`. O `vite.config.js` já redireciona `/api/vps-agent/*`
pro agente rodando em `127.0.0.1:4100`, então não precisa configurar nginx nem nada
pra esse teste local.

## O que já é real nesse modo

- CPU / memória / disco do seu PC (não do container, do host mesmo)
- Lista de containers Docker reais, com CPU e memória de cada um
- Botão de reiniciar container (reinicia de verdade)

## O que ainda é placeholder

- Botão de "Backup agora" — só retorna sucesso simulado, ainda não tem lógica de backup real
- Domínios, Bancos de Dados, Alertas, Logs, Segurança — continuam mockados (ver `src/lib/api.js`)

## Quando migrar pro VPS de verdade

O mesmo `server.js` funciona lá também (ele detecta o sistema operacional
sozinho). Nesse caso ver `DEPLOY.md` pra colocar como serviço systemd + nginx
com HTTPS.
