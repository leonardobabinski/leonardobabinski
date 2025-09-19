// Upload endpoint: PUT /api/upload?key=path/inside/images
export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  let key = url.searchParams.get("key");
  if (!key) {
    return new Response(JSON.stringify({ error: "query param 'key' é obrigatório" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  // Normaliza caminhos: remove ./ e // e evita voltar diretório
  key = key.replace(/^\/?+/, "").replace(/\\/g, "/");
  if (key.includes("..")) {
    return new Response(JSON.stringify({ error: "caminho inválido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const contentType = request.headers.get("content-type") || "application/octet-stream";
  const prefix = env.IMAGES_PREFIX || "images/";
  const fullKey = prefix + key;

  await env.BUCKET.put(fullKey, request.body, {
    httpMetadata: { contentType }
  });

  return new Response(JSON.stringify({ ok: true, key: fullKey }), {
    headers: { "Content-Type": "application/json" }
  });
}
