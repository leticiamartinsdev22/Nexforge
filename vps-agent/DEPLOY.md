# Deploy do Painel VPS — passo a passo completo

Pré-requisito: DNS do seu domínio/subdomínio (ex: `painel.seudominio.com.br`) já apontando para o IP do VPS.

## 1. Subir o agente

```bash
mkdir -p /opt/vps-agent/scripts
# copie server.js, package.json e a pasta scripts/ para /opt/vps-agent
cd /opt/vps-agent
npm install
```

Gere um token forte e anote:
```bash
openssl rand -hex 24
```

Edite `vps-agent.service`, coloque o token gerado em `AGENT_TOKEN`, depois:

```bash
cp vps-agent.service /etc/systemd/system/vps-agent.service
systemctl daemon-reload
systemctl enable --now vps-agent
systemctl status vps-agent
```

Teste local (deve responder JSON, não erro):
```bash
curl -H "Authorization: Bearer <SEU_TOKEN>" http://127.0.0.1:4100/status/host
```

## 2. Buildar o front

No seu ambiente de dev (ou direto no VPS):
```bash
npm install
npm run build
```
Isso gera a pasta `dist/`. Copie o conteúdo para o VPS:
```bash
scp -r dist/* usuario@seu-vps:/var/www/painel-vps/dist/
```
(crie a pasta antes com `mkdir -p /var/www/painel-vps/dist` no VPS)

## 3. Configurar nginx

```bash
cp nginx-painel-vps.conf /etc/nginx/sites-available/painel-vps
ln -s /etc/nginx/sites-available/painel-vps /etc/nginx/sites-enabled/
```

Edite o arquivo e:
- troque `painel.seudominio.com.br` pelo seu domínio real (2 lugares)
- troque `SEU_TOKEN_AQUI` pelo mesmo token do `vps-agent.service`

Teste a config e recarregue:
```bash
nginx -t
systemctl reload nginx
```

## 4. Gerar certificado HTTPS (certbot)

```bash
apt install certbot python3-certbot-nginx -y   # se ainda não tiver
certbot --nginx -d painel.seudominio.com.br
```
O certbot edita o bloco `listen 80` automaticamente para o redirect e preenche os caminhos do certificado.

## 5. Validar tudo

Abra `https://painel.seudominio.com.br` no navegador. O dashboard deve:
- carregar sem o aviso de erro
- mostrar CPU/memória/disco reais do host
- listar containers Docker de verdade
- os botões de ação (backup, verificação) devem responder

Se der erro "Falha ao buscar /status/...", nessa ordem verifique:
1. `systemctl status vps-agent` — agente no ar?
2. `curl` direto na porta 4100 — funciona sem passar pelo nginx?
3. `nginx -t` e `journalctl -u nginx` — proxy configurado certo?
4. Token idêntico nos dois lados (`vps-agent.service` e `nginx-painel-vps.conf`)

## 6. Renovação automática do certificado

O certbot já instala um timer systemd (`certbot.timer`) que renova sozinho. Confirme:
```bash
systemctl list-timers | grep certbot
```
