# Deploy: Front na Koyeb + Agente no seu PC (dados reais, sem VPS, sem cartão)

Esse guia conecta três peças:
1. Seu código no **GitHub**
2. O **front** hospedado na **Koyeb** (grátis, acessível de qualquer lugar)
3. O **agente** rodando no seu PC, exposto pela internet via **túnel do Cloudflare** (grátis, sem cartão)

---

## Parte 1 — Subir o projeto pro GitHub

No PowerShell, dentro da pasta do projeto:

```powershell
cd C:\Users\Copagri\Downloads\painel-vps-ls\painel-vps
git init
git add .
git commit -m "primeiro commit"
```

Cria um repositório novo em **github.com/new** (pode ser privado), depois:

```powershell
git remote add origin https://github.com/SEU-USUARIO/painel-vps.git
git branch -M main
git push -u origin main
```

## Parte 2 — Rodar o túnel do Cloudflare (expõe o agente do seu PC)

Baixa o `cloudflared` (não precisa de conta, não pede cartão):

```powershell
winget install --id Cloudflare.cloudflared
```

Com o agente já rodando (numa janela do PowerShell: `node server.js` dentro de `vps-agent`), abre **outra janela** e roda:

```powershell
cloudflared tunnel --url http://localhost:4100
```

Isso vai imprimir uma URL parecida com:
```
https://algo-aleatorio-123.trycloudflare.com
```

**Guarda essa URL** — ela muda toda vez que você reinicia o túnel (é um túnel temporário/gratuito, não fixo). Deixa essa janela aberta enquanto quiser o painel funcionando.

⚠️ Enquanto você não fechar essa janela nem desligar o PC, o túnel fica no ar. Se fechar, a URL para de funcionar até você abrir de novo (e aí a URL muda).

## Parte 3 — Deploy do front na Koyeb

1. Cria conta em **koyeb.com** (GitHub, Google ou email — sem cartão)
2. **Create App** → **GitHub** → autoriza e seleciona seu repositório `painel-vps`
3. Configuração do build:
   - **Build command**: `npm run build`
   - **Run command**: `npx serve -s dist -l 8080` (ou similar — ver nota abaixo)
   - **Port**: `8080`
4. Em **Environment variables**, adiciona:
   - `VITE_AGENT_URL` = a URL do túnel que você copiou (ex: `https://algo-aleatorio-123.trycloudflare.com`)
   - `VITE_AGENT_TOKEN` = o mesmo token que você definiu no `AGENT_TOKEN` do agente
5. **Deploy**

A Koyeb vai te dar uma URL pública tipo `https://painel-vps-seunome.koyeb.app` — é isso que você acessa do celular ou de qualquer lugar.

### Nota sobre servir o build estático

Como o projeto é Vite (gera arquivos estáticos em `dist/`), precisa de algo simples servindo esses arquivos. Adicione ao `package.json`:

```json
"scripts": {
  "start": "npx serve -s dist -l 8080"
}
```

E na Koyeb, configure o **Run command** como `npm run start`.

## Parte 4 — Atualizar o token do agente

No agente (seu PC), defina o mesmo token usado na Koyeb antes de rodar:

```powershell
$env:AGENT_TOKEN="mesmo-token-que-voce-colocou-na-koyeb"
node server.js
```

## Resumo do "toda vez que eu for usar"

Pra esse painel funcionar com dados reais, toda vez que você for usar precisa, no seu PC:
1. Docker Desktop aberto
2. Agente rodando (`node server.js` dentro de `vps-agent`)
3. Túnel rodando (`cloudflared tunnel --url http://localhost:4100`)

Se a URL do túnel mudar (porque você reiniciou), precisa **atualizar a variável `VITE_AGENT_URL` na Koyeb** e refazer o deploy — ou migrar pra um túnel fixo depois (Cloudflare Tunnel autenticado, que dá URL permanente, mas aí precisa de domínio próprio).

## Limitações desse modelo (sendo honesto)

- Só mostra dados reais **enquanto seu PC estiver ligado** com agente + túnel rodando
- A URL do túnel gratuito **muda a cada reinício**, dando trabalho manual de atualizar
- Não é uma solução "definitiva" — é o melhor caminho **sem gastar nada e sem cartão**, mas tem esse atrito manual embutido
