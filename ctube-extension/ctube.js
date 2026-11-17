/* CTube for YouTube: switches the Chausima look and focus mode on or off by
   putting classes on <html>; ctube.css does the rest. YouTube's own logo,
   player and pages are left as they are. */
(function () {
  "use strict";
  var DEFAULTS = { look: true, noShorts: false, noComments: false, noRecs: false };
  var html = document.documentElement;
  function apply(o) {
    html.classList.toggle("ctube-on", !!o.look);
    html.classList.toggle("ctube-noshorts", !!o.noShorts);
    html.classList.toggle("ctube-nocomments", !!o.noComments);
    html.classList.toggle("ctube-norecs", !!o.noRecs);
  }
  apply(DEFAULTS);
  chrome.storage.sync.get(DEFAULTS, apply);
  chrome.storage.onChanged.addListener(function () { chrome.storage.sync.get(DEFAULTS, apply); });

  /* the app switcher follows YouTube's dark mode */
  function theme() { html.setAttribute("data-theme", html.hasAttribute("dark") ? "dark" : "light"); }
  new MutationObserver(theme).observe(html, { attributes: true, attributeFilter: ["dark"] });
  theme();

  /* YouTube builds its top bar after the page loads, and again when you move
     between pages, so keep checking for it */
  function addSwitcher() {
    var end = document.querySelector("ytd-masthead #end, #masthead #end");
    if (!end || end.querySelector("[data-chausima-apps]")) return;
    var slot = document.createElement("span");
    slot.setAttribute("data-chausima-apps", "");
    slot.className = "ctube-apps";
    end.insertBefore(slot, end.firstChild);
    if (window.ChausimaApps) window.ChausimaApps.scan();
  }
  new MutationObserver(addSwitcher).observe(html, { childList: true, subtree: true });
  addSwitcher();
  document.addEventListener("DOMContentLoaded", addSwitcher);
})();
