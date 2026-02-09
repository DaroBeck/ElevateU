// header.js — robust navigation + dropdowns + drawer (no frameworks)
// Fixes: auth links breaking on different pages / nested routes

function qs(sel, root = document) { return root.querySelector(sel); }
function qsa(sel, root = document) { return [...root.querySelectorAll(sel)]; }

/**
 * Return a path that works from ANY page depth.
 * Example:
 *  - from /index.html -> "auth.html"
 *  - from /pages/subject.html -> "../auth.html"
 */
function rootRelative(fileName) {
  const path = window.location.pathname || "/";
  const clean = path.split("?")[0].split("#")[0];

  // If you're at a folder URL (ends with "/"), treat it as index.html
  const parts = clean.endsWith("/") ? clean.slice(0, -1).split("/") : clean.split("/");

  // If last part has a dot, it’s a file; otherwise it’s a folder
  const last = parts[parts.length - 1] || "";
  const isFile = last.includes(".");
  const depth = Math.max(0, parts.length - 1 - (isFile ? 1 : 0)); // folders deep from root

  const prefix = depth === 0 ? "./" : "../".repeat(depth);
  return `${prefix}${fileName}`;
}

function rewriteAuthLinks() {
  const authPath = rootRelative("auth.html");

  qsa("a[data-auth='signup']").forEach(a => {
    a.setAttribute("href", `${authPath}?mode=signup#signup`);
  });

  qsa("a[data-auth='signin']").forEach(a => {
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
  burger.setAttribute("aria-expanded", String(open));
  drawer.setAttribute("aria-hidden", String(!open));
}

/**
 * IMPORTANT: force auth navigation even if other handlers preventDefault.
 * Capture phase so it runs before most bubbling handlers.
 */
document.addEventListener("click", (e) => {
  const authLink = e.target.closest("a[data-auth]");
  if (authLink) {
    // Ensure href is correct (in case header was injected late)
    rewriteAuthLinks();

    const href = authLink.getAttribute("href");
    if (href) {
      // Force navigation in a microtask after other handlers run
      queueMicrotask(() => { window.location.href = href; });
    }
    return; // don’t interfere further
  }

  // Dropdown buttons
  const btn = e.target.closest("[data-navbtn]");
  if (btn) {
    e.preventDefault();
    e.stopPropagation();
    toggleDropdown(btn.getAttribute("data-navbtn"));
    return;
  }

  // Burger
  if (e.target.closest("#euBurger")) {
    e.preventDefault();
    e.stopPropagation();
    toggleDrawer();
    return;
  }

  // Click outside header closes dropdowns + drawer
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
}, true);

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

// On load, always rewrite auth links so they work on any page depth
document.addEventListener("DOMContentLoaded", () => {
  rewriteAuthLinks();
});
