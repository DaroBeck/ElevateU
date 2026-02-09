// Simple, upgradable header interactions (no frameworks)

function qs(sel, root = document) { return root.querySelector(sel); }
function qsa(sel, root = document) { return [...root.querySelectorAll(sel)]; }

function closeAllDropdowns() {
  qsa("[data-dropdown]").forEach(d => d.classList.remove("show"));
  qsa("[data-navbtn]").forEach(b => b.classList.remove("is-open"));
}

function toggleDropdown(id) {
  const dd = qs(`[data-dropdown="${id}"]`);
  const btn = qs(`[data-navbtn="${id}"]`);
  if (!dd || !btn) return;

  const isOpen = dd.classList.contains("show");
  closeAllDropdowns();
  if (!isOpen) {
    dd.classList.add("show");
    btn.classList.add("is-open");
  }
}

function toggleDrawer() {
  const drawer = qs("#euDrawer");
  const burger = qs("#euBurger");
  if (!drawer || !burger) return;
  const open = drawer.classList.toggle("show");
  burger.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", String(open));
  drawer.setAttribute("aria-hidden", String(!open));
}

// -------- AUTH LINK FIX (works from ANY page depth) --------
async function resolveAuthBase() {
  // If you ever want to force a base (e.g. GitHub Pages repo), set:
  // <meta name="eu-base" content="/YOURREPO/">
  const metaBase = document.querySelector('meta[name="eu-base"]')?.content?.trim();
  if (metaBase) return metaBase.endsWith("/") ? metaBase : (metaBase + "/");

  // Try common relative depths first, then absolute root
  const tries = ["./", "../", "../../", "../../../", "../../../../", "/"];
  for (const prefix of tries) {
    try {
      // HEAD is fastest; some static hosts don’t allow HEAD, so fallback to GET.
      let res = await fetch(prefix + "auth.html", { method: "HEAD", cache: "no-store" });
      if (!res.ok) res = await fetch(prefix + "auth.html", { method: "GET", cache: "no-store" });
      if (res.ok) return prefix;
    } catch (_) {
      // ignore and keep trying
    }
  }

  // fallback: assume same folder
  return "./";
}

async function wireAuthLinks() {
  const base = await resolveAuthBase();

  // Any element with data-auth="signup" or data-auth="signin" will be rewritten
  qsa("[data-auth]").forEach(el => {
    const mode = el.getAttribute("data-auth");
    if (mode === "signup") el.setAttribute("href", base + "auth.html#signup");
    if (mode === "signin") el.setAttribute("href", base + "auth.html#signin");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  wireAuthLinks();
});

// -------- Click handling --------
document.addEventListener("click", (e) => {
  // dropdown buttons
  const btn = e.target.closest("[data-navbtn]");
  if (btn) {
    e.preventDefault();
    toggleDropdown(btn.getAttribute("data-navbtn"));
    return;
  }

  // burger
  if (e.target.closest("#euBurger")) {
    e.preventDefault();
    toggleDrawer();
    return;
  }

  // click outside closes dropdowns + drawer
  if (!e.target.closest(".eu-header")) {
    closeAllDropdowns();
    const drawer = qs("#euDrawer");
    const burger = qs("#euBurger");
    if (drawer) drawer.classList.remove("show");
    if (burger) {
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    }
    if (drawer) drawer.setAttribute("aria-hidden", "true");
  }
});

// ESC closes everything
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeAllDropdowns();
    const drawer = qs("#euDrawer");
    const burger = qs("#euBurger");
    if (drawer) drawer.classList.remove("show");
    if (burger) {
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    }
    if (drawer) drawer.setAttribute("aria-hidden", "true");
  }
});
