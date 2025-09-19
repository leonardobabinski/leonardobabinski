export async function onRequest({ env, params, request }) {
  const body = await request.json().catch(() => ({}));
  const permanent = typeof body.permanent === "boolean"
    ? body.permanent
    : (env.PERMANENT_DELETE || "false").toLowerCase() === "true";

  const name = decodeURIComponent(params.name);
  const imagesPrefix = env.IMAGES_PREFIX || "images/";
  const trashPrefix  = env.TRASH_PREFIX  || "trash/";
  const srcKey = imagesPrefix + name;

  const obj = await env.BUCKET.get(srcKey);
  if (!obj) {
    return new Response(JSON.stringify({ error: "Arquivo não encontrado" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }

  if (permanent) {
    await env.BUCKET.delete(srcKey);
    return new Response(JSON.stringify({ ok: true, deleted: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } else {
    const destKey = trashPrefix + name;
    await env.BUCKET.put(destKey, obj.body, { httpMetadata: obj.httpMetadata });
    await env.BUCKET.delete(srcKey);
    return new Response(JSON.stringify({ ok: true, movedToTrash: true }), {
      headers: { "Content-Type": "application/json" }
    });
  }
}
