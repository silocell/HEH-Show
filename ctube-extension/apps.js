/* Chausima apps: the app switcher shared by every Chausima site.
   Add <script src="https://chausima.com/apps.js" defer></script> and put
   <span data-chausima-apps></span> where the button should go (usually the top bar,
   next to the account button). Styles live in a shadow root, so the page's CSS
   can't touch them and they can't touch the page. Follows the page's
   html[data-theme] if set, otherwise the device's light/dark setting. */
(function () {
  "use strict";
  if (window.__chausimaApps) return; window.__chausimaApps = true;

  var APPS = [
    { id: "launchpad", name: "Launchpad", url: "https://civilinitiatives.org/", bg: "#1f4fd8", hosts: ["civilinitiatives.org", "www.civilinitiatives.org"],
      icon: '<path d="M12 3c3 2.5 4 6 3.6 9.5H8.4C8 9 9 5.5 12 3z"/><circle cx="12" cy="9" r="1.6"/><path d="M8.6 12.5L6 16l3 -.8M15.4 12.5L18 16l-3 -.8M10.5 15.5l1.5 4 1.5-4"/>' },
    { id: "mail", name: "Mail", url: "https://mail.chausima.com/", bg: "#c8312b", hosts: ["mail.chausima.com"],
      icon: '<rect x="4" y="6" width="16" height="12" rx="2"/><path d="M4.5 7l7.5 6 7.5-6"/>' },
    { id: "write", name: "Write", url: "https://suite.civilinitiatives.org/write/", bg: "#2f6fe0", path: "/write",
      icon: '<path d="M7 3.5h7l4 4V20.5H7z"/><path d="M14 3.5v4h4M9.5 12h6M9.5 15h6M9.5 18h4"/>' },
    { id: "grid", name: "Grid", url: "https://suite.civilinitiatives.org/grid/", bg: "#1f8a55", path: "/grid",
      icon: '<rect x="4.5" y="4.5" width="15" height="15" rx="1.5"/><path d="M4.5 9.5h15M4.5 14.5h15M9.5 4.5v15M14.5 4.5v15"/>' },
    { id: "present", name: "Present", url: "https://suite.civilinitiatives.org/present/", bg: "#e08a12", path: "/present",
      icon: '<rect x="3.5" y="5" width="17" height="11" rx="1.5"/><path d="M12 16v3.5M8.5 19.5h7"/>' },
    { id: "notebook", name: "Notebook", url: "https://suite.civilinitiatives.org/notebook/", bg: "#7a4fd8", path: "/notebook",
      icon: '<path d="M6 3.5h11a1.5 1.5 0 0 1 1.5 1.5v14A1.5 1.5 0 0 1 17 20.5H6z"/><path d="M9 3.5v17M11.5 8h4.5M11.5 11h4.5"/>' },
    { id: "draw", name: "Draw", url: "https://suite.civilinitiatives.org/draw/", bg: "#d8417a", path: "/draw",
      icon: '<path d="M4 20l1.2-4.2L15.5 5.5l3 3L8.2 18.8z"/><path d="M13.5 7.5l3 3"/>' },
    { id: "forms", name: "Forms", url: "https://suite.civilinitiatives.org/forms/", bg: "#6b4fb8", path: "/forms",
      icon: '<rect x="5" y="3.5" width="14" height="17" rx="1.5"/><circle cx="9" cy="9" r="1"/><circle cx="9" cy="13" r="1"/><path d="M11.5 9h4.5M11.5 13h4.5"/>' },
    { id: "files", name: "Files", url: "https://files.civilinitiatives.org/", bg: "#0e8a8a", hosts: ["files.civilinitiatives.org"],
      icon: '<path d="M3.5 7a1.5 1.5 0 0 1 1.5-1.5h4.5l2 2H19A1.5 1.5 0 0 1 20.5 9v9A1.5 1.5 0 0 1 19 19.5H5A1.5 1.5 0 0 1 3.5 18z"/>' },
    { id: "hosting", name: "Videos", url: "https://hosting.civilinitiatives.org/", bg: "#d23b3b", hosts: ["hosting.civilinitiatives.org"],
      icon: '<rect x="3.5" y="6" width="17" height="12" rx="3"/><path d="M10.5 9.5v5l4-2.5z" fill="currentColor"/>' },
    { id: "hwlai", name: "HWL AI", url: "https://hwlai.civilinitiatives.org/", bg: "#3a3f8f", hosts: ["hwlai.civilinitiatives.org"],
      icon: '<path d="M12 3.5l1.8 4.7 4.7 1.8-4.7 1.8L12 16.5l-1.8-4.7L5.5 10l4.7-1.8z"/><path d="M18 15l.9 2.1 2.1.9-2.1.9L18 21l-.9-2.1-2.1-.9 2.1-.9z"/>' },
    { id: "chausima", name: "Chausima", url: "https://chausima.com/", bg: "#1f3a93", hosts: ["chausima.com", "www.chausima.com"],
      icon: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.6 5.4 3.6 8.5S14.5 17.9 12 20.5C9.5 17.9 8.4 15.1 8.4 12S9.5 6.1 12 3.5z"/>' }
  ];

  function current() {
    var h = location.hostname, p = location.pathname;
    for (var i = 0; i < APPS.length; i++) {
      var a = APPS[i];
      if (a.path && h === "suite.civilinitiatives.org" && p.indexOf(a.path) === 0) return a.id;
      if (a.hosts && a.hosts.indexOf(h) >= 0) return a.id;
    }
    return "";
  }

  var CSS = '\
:host{all:initial;display:inline-block;vertical-align:middle}\
.btn{width:40px;height:40px;border:0;border-radius:50%;background:transparent;display:grid;place-items:center;cursor:pointer;color:var(--soft);padding:0}\
.btn:hover{background:var(--hover)}\
.btn:focus-visible{outline:3px solid var(--focus);outline-offset:1px}\
.btn svg{width:22px;height:22px;fill:currentColor}\
.panel{position:fixed;z-index:2147483000;width:340px;max-width:calc(100vw - 16px);max-height:min(560px,calc(100vh - 80px));overflow:auto;background:var(--card);color:var(--ink);border-radius:24px;box-shadow:0 12px 40px rgba(0,0,0,.22),0 2px 6px rgba(0,0,0,.08);padding:10px 10px 6px;font:14px/1.3 "Atkinson Hyperlegible",system-ui,-apple-system,Segoe UI,sans-serif;transform-origin:top right;animation:pop .14s ease-out}\
@keyframes pop{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:none}}\
@media (prefers-reduced-motion:reduce){.panel{animation:none}}\
.air{height:5px;border-radius:3px;margin:2px 6px 10px;background:repeating-linear-gradient(135deg,var(--red) 0 10px,transparent 10px 15px,var(--blue) 15px 25px,transparent 25px 30px)}\
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;background:var(--well);border-radius:18px;padding:8px}\
a{display:flex;flex-direction:column;align-items:center;gap:7px;padding:12px 4px 10px;border-radius:14px;color:var(--ink);text-decoration:none;text-align:center}\
a:hover{background:var(--hover)}\
a:focus-visible{outline:3px solid var(--focus);outline-offset:-3px}\
a[aria-current="page"]{background:var(--hover)}\
a[aria-current="page"] .nm{font-weight:700}\
.ic{width:46px;height:46px;border-radius:14px;display:grid;place-items:center;color:#fff;box-shadow:inset 0 -3px 0 rgba(0,0,0,.14)}\
.ic svg{width:26px;height:26px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}\
.nm{font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:96px}\
.foot{display:flex;justify-content:center;padding:8px 0 4px}\
.foot a{flex-direction:row;padding:6px 12px;border-radius:999px;font-size:13px;color:var(--soft)}\
';
  function vars(dark) {
    return dark
      ? ":host{--card:#1b2026;--well:#14181d;--ink:#e7ebee;--soft:#a7b1bc;--hover:rgba(255,255,255,.08);--focus:#ff8a7e;--red:#ff6a5c;--blue:#7f9cff}"
      : ":host{--card:#ffffff;--well:#f1f4f9;--ink:#17202a;--soft:#5b6673;--hover:rgba(23,32,42,.07);--focus:#c8312b;--red:#c8312b;--blue:#1f3a93}";
  }
  function isDark() {
    var t = document.documentElement.getAttribute("data-theme");
    if (t === "dark") return true; if (t === "light") return false;
    return !!(window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches);
  }

  var here = current(), panelHost = null, panel = null, openBtn = null, styleEls = [];

  function paintTheme() { var v = vars(isDark()); styleEls.forEach(function (el) { el.textContent = v + CSS; }); }

  function buildPanel() {
    panelHost = document.createElement("div");
    panelHost.setAttribute("data-chausima-apps-panel", "");
    var root = panelHost.attachShadow({ mode: "open" });
    var st = document.createElement("style"); styleEls.push(st); root.appendChild(st);
    panel = document.createElement("div");
    panel.className = "panel"; panel.id = "chausimaAppsPanel";
    panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Chausima apps");
    var html = '<div class="air" aria-hidden="true"></div><nav class="grid" aria-label="Chausima apps">';
    APPS.forEach(function (a) {
      html += '<a href="' + a.url + '"' + (a.id === here ? ' aria-current="page"' : "") + '>' +
        '<span class="ic" style="background:' + a.bg + '"><svg viewBox="0 0 24 24" aria-hidden="true">' + a.icon + "</svg></span>" +
        '<span class="nm">' + a.name + "</span></a>";
    });
    html += '</nav><div class="foot"><a href="https://chausima.com/">More from Chausima</a></div>';
    panel.innerHTML = html;
    root.appendChild(panel);
    panel.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { e.preventDefault(); close(true); return; }
      var links = [].slice.call(panel.querySelectorAll(".grid a")), i = links.indexOf(root.activeElement);
      if (i < 0) return;
      var step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 3, ArrowUp: -3 }[e.key];
      if (step) { e.preventDefault(); var n = links[Math.max(0, Math.min(links.length - 1, i + step))]; n.focus(); }
    });
    paintTheme();
    document.body.appendChild(panelHost);
  }
  function place() {
    var r = openBtn.getBoundingClientRect(), w = Math.min(340, innerWidth - 16);
    var left = Math.min(Math.max(8, r.right - w), innerWidth - w - 8);
    panel.style.left = left + "px"; panel.style.top = Math.min(r.bottom + 8, innerHeight - 120) + "px";
  }
  function open(btn) {
    if (!panelHost) buildPanel();
    openBtn = btn; panelHost.hidden = false; place();
    (btn.__btn || btn).setAttribute("aria-expanded", "true");
    var cur = panel.querySelector('[aria-current="page"]') || panel.querySelector(".grid a");
    setTimeout(function () { cur && cur.focus(); }, 0);
  }
  function close(refocus) {
    if (!panelHost || panelHost.hidden) return;
    panelHost.hidden = true;
    if (openBtn) { var b = openBtn.__btn || openBtn; b.setAttribute("aria-expanded", "false"); if (refocus) b.focus(); }
  }
  document.addEventListener("click", function (e) {
    if (!panelHost || panelHost.hidden) return;
    var path = e.composedPath ? e.composedPath() : [];
    if (path.indexOf(panelHost) >= 0 || (openBtn && path.indexOf(openBtn) >= 0)) return;
    close(false);
  }, true);
  addEventListener("resize", function () { if (panelHost && !panelHost.hidden) place(); });
  addEventListener("scroll", function () { if (panelHost && !panelHost.hidden) place(); }, true);

  function mount(slot) {
    if (slot.__chausima) return; slot.__chausima = true;
    var root = slot.attachShadow ? slot.attachShadow({ mode: "open" }) : slot;
    var st = document.createElement("style"); styleEls.push(st); root.appendChild(st);
    var b = document.createElement("button");
    b.type = "button"; b.className = "btn"; b.title = "Chausima apps";
    b.setAttribute("aria-label", "Chausima apps"); b.setAttribute("aria-haspopup", "dialog");
    b.setAttribute("aria-expanded", "false"); b.setAttribute("aria-controls", "chausimaAppsPanel");
    b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      [5, 12, 19].map(function (y) { return [5, 12, 19].map(function (x) { return '<circle cx="' + x + '" cy="' + y + '" r="2.1"/>'; }).join(""); }).join("") + "</svg>";
    b.addEventListener("click", function (e) {
      e.stopPropagation();
      if (panelHost && !panelHost.hidden && openBtn === slot) close(false); else open(slot);
    });
    root.appendChild(b); slot.__btn = b;
    paintTheme();
  }
  function scan() { [].forEach.call(document.querySelectorAll("[data-chausima-apps]"), mount); }
  new MutationObserver(function () { paintTheme(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  if (window.matchMedia) { var mq = matchMedia("(prefers-color-scheme: dark)"); (mq.addEventListener ? mq.addEventListener("change", paintTheme) : mq.addListener(paintTheme)); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", scan); else scan();
  /* sites that draw their header later (apps, sign-in) can call this */
  window.ChausimaApps = { scan: scan, close: function () { close(false); } };
})();
