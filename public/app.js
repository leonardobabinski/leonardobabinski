let images = [];
let idx = 0;

const elMain = document.getElementById("main");
const elCount = document.getElementById("count");
const elThumbs = document.getElementById("thumbs");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const btnKeep = document.getElementById("btnKeep");
const btnDelete = document.getElementById("btnDelete");
const chkKeep = document.getElementById("moveKeep");
const chkPerm = document.getElementById("permanent");

init();

async function init() {
  const r = await fetch("/api/images");
  const data = await r.json();
  if (!r.ok) {
    alert(data.error || "Erro carregando lista");
    return;
  }
  chkPerm.checked = !!data.permanentDeleteDefault;

  images = data.images || [];
  renderThumbs();
  show(0);
}

function renderThumbs() {
  elThumbs.innerHTML = "";
  images.forEach((img, i) => {
    const a = document.createElement("button");
    a.className = "thumb";
    a.title = img.name;
    a.addEventListener("click", () => show(i));
    const im = document.createElement("img");
    im.loading = "lazy";
    im.src = `/api/file/${encodeURIComponent(img.name)}`;
    a.appendChild(im);
    elThumbs.appendChild(a);
  });
}

function show(i) {
  if (images.length === 0) {
    elMain.removeAttribute("src");
    elCount.textContent = "0 / 0";
    return;
  }
  idx = Math.max(0, Math.min(i, images.length - 1));
  const cur = images[idx];
  elMain.src = `/api/file/${encodeURIComponent(cur.name)}`;
  elMain.alt = cur.name;
  elCount.textContent = `${idx + 1} / ${images.length}`;
  [...elThumbs.children].forEach((c, j) => c.classList.toggle("active", j === idx));
}

async function keepCurrent() {
  if (!images.length) return;
  const cur = images[idx];
  const moveToKeep = chkKeep.checked;
  const r = await fetch(`/api/keep/${encodeURIComponent(cur.name)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ moveToKeep })
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    alert(data.error || "Erro ao manter");
    return;
  }
  if (data.moved) images.splice(idx, 1);
  advance();
}

async function deleteCurrent() {
  if (!images.length) return;
  const cur = images[idx];
  const permanent = chkPerm.checked;
  const r = await fetch(`/api/delete/${encodeURIComponent(cur.name)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ permanent })
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    alert(data.error || "Erro ao excluir");
    return;
  }
  images.splice(idx, 1);
  advance();
}

function advance() {
  if (images.length === 0) {
    show(0);
    return;
  }
  show(Math.min(idx, images.length - 1));
}

btnPrev.onclick = () => show(idx - 1);
btnNext.onclick = () => show(idx + 1);
btnKeep.onclick = keepCurrent;
btnDelete.onclick = deleteCurrent;

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") show(idx - 1);
  if (e.key === "ArrowRight") show(idx + 1);
  if (e.key.toLowerCase() === "a" || e.key === "1") keepCurrent();
  if (e.key.toLowerCase() === "d" || e.key === "2" || e.key === "Backspace") deleteCurrent();
});
