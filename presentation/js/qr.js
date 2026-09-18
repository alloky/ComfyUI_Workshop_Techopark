/* Рисует QR-коды во все элементы [data-qr] и подставляет ссылки в [data-url].
   Значение data-qr — ключ из window.WORKSHOP (pagesUrl / repoUrl)
   либо готовый URL, если ключа с таким именем нет. */

(function () {
  "use strict";

  function urlFor(key) {
    var cfg = window.WORKSHOP || {};
    return cfg[key] || key;
  }

  function renderQr(el) {
    var url = urlFor(el.getAttribute("data-qr"));

    // typeNumber 0 = подобрать автоматически, 'M' = средняя коррекция ошибок
    var qr = qrcode(0, "M");
    qr.addData(url);
    qr.make();

    // createSvgTag масштабируется без потери резкости на любом проекторе
    el.innerHTML = qr.createSvgTag({ cellSize: 8, margin: 0, scalable: true });

    var svg = el.querySelector("svg");
    if (svg) {
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", "QR-код на " + url);
    }
  }

  function fillUrls() {
    var nodes = document.querySelectorAll("[data-url]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var url = urlFor(el.getAttribute("data-url"));
      if (el.tagName === "A") {
        el.href = url;
        if (el.hasAttribute("data-url-text")) {
          el.textContent = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
        }
      } else {
        el.textContent = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
      }
    }
  }

  function init() {
    var nodes = document.querySelectorAll("[data-qr]");
    for (var i = 0; i < nodes.length; i++) {
      renderQr(nodes[i]);
    }
    fillUrls();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
