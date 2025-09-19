# Classificador de Imagens (Cloudflare Pages + R2)

App para classificar imagens rapidamente: **Boa** (opcionalmente move para um prefixo KEEP) ou **Excluir** (mover para TRASH ou deletar permanentemente).

## Arquitetura

- **Frontend**: HTML/CSS/JS estático (Cloudflare Pages - diretório `public/`)
- **Backend**: Pages Functions (em `functions/api/...`)
- **Armazenamento**: R2 (bucket e prefixes)

## Configuração

1. **Crie um bucket R2** (ex.: `images-bucket`).
2. **Carregue suas imagens** para o prefixo `images/` (ex.: `images/foto1.jpg`).
3. Configure os **Bindings** nas Pages Functions:
   - R2 binding: `BUCKET` → `images-bucket`
4. Ajuste variáveis no `wrangler.toml` se quiser:
   - `IMAGES_PREFIX` (padrão `images/`)
   - `KEEP_PREFIX`   (padrão `keep/`)
   - `TRASH_PREFIX`  (padrão `trash/`)
   - `ALLOWED_EXT`
   - `PERMANENT_DELETE`

## Deploy via Cloudflare Pages (com Git)

1. Suba este projeto para um repositório no GitHub.
2. No painel da Cloudflare → **Pages** → **Create a project** → **Connect to Git** e selecione o repositório.
3. Build command: **(vazio)**
4. Build output directory: **public**
5. Functions directory: **functions**
6. Depois do deploy, abra a URL para usar o app.

## Desenvolvimento local

Requer Wrangler:

```bash
npm i -g wrangler
wrangler login
wrangler pages dev public
```

> O comando acima roda o `public/` e as **functions** de `functions/` automaticamente.

## Endpoints

- `GET /api/images` → lista imagens no prefixo `IMAGES_PREFIX`
- `GET /api/file/:name` → baixa/serve a imagem `:name` do prefixo `IMAGES_PREFIX`
- `POST /api/keep/:name` (`{ moveToKeep: true|false }`) → se `true`, move para `KEEP_PREFIX`
- `POST /api/delete/:name` (`{ permanent: true|false }`) → se `true`, deleta de vez; senão move para `TRASH_PREFIX`

## Observações

- Por simplicidade, **Undo** não está implementado. Pode ser adicionado com **KV**.
- O `keep` usa verificação de **nome único** simples em R2 para evitar overwrite.
- Para muitas imagens, considere paginação (marker) no `list()`.
