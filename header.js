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
