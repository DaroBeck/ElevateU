// Simple, upgradable header interactions (no frameworks)

function qs(sel, root = document) { return root.querySelector(sel); }
function qsa(sel, root = document) { return [...root.querySelectorAll(sel)]; }

// Build a relative path to a file that lives at the project root (same folder as index.html)
function rootRelative(fileName) {
  // Example:
  // /index.html -> depth 0 => "auth.html"
  // /subject.html -> depth 0 => "auth.html"
  // /pages/gcse/biology.html -> depth 2 => "../../auth.html"
  const path = location.pathname;

  // If you're serving from a real domain root, pathname starts with "/".
  // Split and remove empty parts.
  const parts = path.split("/").filter(Boolean);

  // If the last segment looks like a file (has .html), exclude it from depth.
  const last = parts[parts.length - 1] || "";
  const depth = last.includes(".") ? Math.max(0, parts.length - 1) : parts.length;

  const prefix = depth === 0 ? "./" : "../".repeat(depth);
  return prefix + fileName;
}

function rewriteAuthLinks() {
  const authPath = rootRelative("auth.html");

  qsa("[data-auth='signup']").forEach(a => {
    a.setAttribute("href", `${authPath}?mode=signup#signup`);
  });

  qsa("[data-auth='signin']").forEach(a => {
    a.setAttribute("href", `${authPath}?mode=signin#signin`);
  });
}

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
}

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
    if (burger) burger.classList.remove("open");
  }
});

// ESC closes everything
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeAllDropdowns();
    const drawer = qs("#euDrawer");
    const burger = qs("#euBurger");
    if (drawer) drawer.classList.remove("show");
    if (burger) burger.classList.remove("open");
  }
});

// Run once on load
rewriteAuthLinks();
