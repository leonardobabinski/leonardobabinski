export async function onRequest(context) {
  const { env, params } = context;
  const prefix = env.IMAGES_PREFIX || "images/";
  const key = prefix + decodeURIComponent(params.name);

  const obj = await env.BUCKET.get(key);
  if (!obj) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  if (obj.httpMetadata && obj.httpMetadata.contentType) {
    headers.set("Content-Type", obj.httpMetadata.contentType);
  } else {
    // tentativa simples de deduzir
    const lower = key.toLowerCase();
    if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) headers.set("Content-Type", "image/jpeg");
    else if (lower.endsWith(".png")) headers.set("Content-Type", "image/png");
    else if (lower.endsWith(".webp")) headers.set("Content-Type", "image/webp");
    else if (lower.endsWith(".gif")) headers.set("Content-Type", "image/gif");
    else if (lower.endsWith(".bmp")) headers.set("Content-Type", "image/bmp");
    else if (lower.endsWith(".tiff") || lower.endsWith(".tif")) headers.set("Content-Type", "image/tiff");
    else if (lower.endsWith(".avif")) headers.set("Content-Type", "image/avif");
    else headers.set("Content-Type", "application/octet-stream");
  }
  return new Response(obj.body, { headers });
}
