async function uniqueKey(env, prefix, filename) {
  const dot = filename.lastIndexOf(".");
  const base = dot >= 0 ? filename.slice(0, dot) : filename;
  const ext  = dot >= 0 ? filename.slice(dot) : "";
  let candidate = prefix + filename;
  let i = 1;
  while (i < 100) {
    const exists = await env.BUCKET.get(candidate);
    if (!exists) return candidate;
    candidate = `${prefix}${base} (${i})${ext}`;
    i++;
  }
  return candidate;
}

export async function onRequest({ env, params, request }) {
  const body = await request.json().catch(() => ({}));
  const moveToKeep = !!body.moveToKeep;
  const name = decodeURIComponent(params.name);

  const imagesPrefix = env.IMAGES_PREFIX || "images/";
  const keepPrefix   = env.KEEP_PREFIX || "keep/";
  const srcKey = imagesPrefix + name;

  if (!moveToKeep) {
    return new Response(JSON.stringify({ ok: true, moved: false }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  const obj = await env.BUCKET.get(srcKey);
  if (!obj) {
    return new Response(JSON.stringify({ error: "Arquivo não encontrado" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }

  const destKey = await uniqueKey(env, keepPrefix, name);
  await env.BUCKET.put(destKey, obj.body, { httpMetadata: obj.httpMetadata });
  await env.BUCKET.delete(srcKey);

  return new Response(JSON.stringify({ ok: true, moved: true }), {
    headers: { "Content-Type": "application/json" }
  });
}
