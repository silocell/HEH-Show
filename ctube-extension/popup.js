var DEFAULTS = { look: true, noShorts: false, noComments: false, noRecs: false };
chrome.storage.sync.get(DEFAULTS, function (o) {
  Object.keys(DEFAULTS).forEach(function (k) {
    var el = document.getElementById(k); el.checked = !!o[k];
    el.addEventListener("change", function () { var x = {}; x[k] = el.checked; chrome.storage.sync.set(x); });
  });
});
