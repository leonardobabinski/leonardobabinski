export async function onRequest({ env }) {
  const allowed = (env.ALLOWED_EXT || "jpg,jpeg,png,webp,gif,bmp,tiff,avif")
    .split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
  const prefix = env.IMAGES_PREFIX || "images/";
  const list = await env.BUCKET.list({ prefix, limit: 1000 });

  const items = (list.objects || [])
    .filter(o => {
      const name = o.key.slice(prefix.length);
      const ext = (name.split(".").pop() || "").toLowerCase();
      return !!name && allowed.includes(ext);
    })
    .map(o => ({
      name: o.key.slice(prefix.length),
      size: o.size,
      mtime: new Date(o.uploaded || Date.now()).getTime()
    }))
    .sort((a, b) => b.mtime - a.mtime);

  return new Response(JSON.stringify({
    images: items,
    permanentDeleteDefault: (env.PERMANENT_DELETE || "false").toLowerCase() === "true"
  }), { headers: { "Content-Type": "application/json" } });
}
