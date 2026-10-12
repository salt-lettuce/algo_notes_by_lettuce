// ヘッダー・サイドバー・パンくず・子ページ一覧を生成する
(function () {
  "use strict";

  var NAV = window.NAV_DATA || [];
  var body = document.body;
  var ROOT = body.getAttribute("data-root") || "./";
  var PATH = body.getAttribute("data-path") || "";
  var HLJS = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/";

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) { return null; }
  }

  function el(tag, attrs, children) {
    var e = document.createElement(tag);
    for (var k in attrs || {}) {
      if (k === "text") e.textContent = attrs[k];
      else e.setAttribute(k, attrs[k]);
    }
    (children || []).forEach(function (c) { if (c) e.appendChild(c); });
    return e;
  }

  // ---- ページの検索 ----
  function findTrail(nodes, path, trail) {
    for (var i = 0; i < nodes.length; i++) {
      var t = trail.concat([nodes[i]]);
      if (nodes[i].path === path) return t;
      if (nodes[i].children) {
        var r = findTrail(nodes[i].children, path, t);
        if (r) return r;
      }
    }
    return null;
  }
  var trail = findTrail(NAV, PATH, []) || [];
  var current = trail[trail.length - 1];

  // ---- テーマ ----
  var hlLight = el("link", { rel: "stylesheet", href: HLJS + "styles/github.min.css" });
  var hlDark = el("link", { rel: "stylesheet", href: HLJS + "styles/github-dark.min.css" });
  document.head.appendChild(hlLight);
  document.head.appendChild(hlDark);

  function applyTheme(theme) {
    if (theme) document.documentElement.setAttribute("data-theme", theme);
    else document.documentElement.removeAttribute("data-theme");
    var dark = theme === "dark" ||
      (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    hlLight.disabled = dark;
    hlDark.disabled = !dark;
  }
  applyTheme(store("theme"));

  // ---- 本文を main に移す ----
  var main = el("main", { class: "content" });
  Array.prototype.slice.call(body.childNodes).forEach(function (n) {
    if (n.nodeName !== "SCRIPT") main.appendChild(n);
  });

  // ---- ヘッダー ----
  var menuBtn = el("button", { class: "icon-btn", "aria-label": "サイドバーを開閉", text: "☰" });
  var themeBtn = el("button", { class: "icon-btn", "aria-label": "テーマ切替", text: "◐" });
  var header = el("header", { class: "site-header" }, [
    menuBtn,
    el("a", { class: "site-title", href: ROOT, text: "Algorithm Notes" }),
    el("span", { class: "spacer" }),
    themeBtn
  ]);

  // ---- サイドバー ----
  function buildTree(nodes) {
    var ul = el("ul");
    nodes.forEach(function (node) {
      var li = el("li");
      var row = el("div", { class: "nav-row" });
      var hasKids = node.children && node.children.length;
      var key = "open:" + node.path;
      var open = trail.indexOf(node) !== -1 || store(key) === "1";
      if (hasKids) {
        var tog = el("button", { class: "nav-toggle", "aria-label": "折りたたみ", text: "▸" });
        tog.addEventListener("click", function () {
          var isOpen = li.classList.toggle("open");
          store(key, isOpen ? "1" : "0");
        });
        row.appendChild(tog);
      } else {
        row.appendChild(el("span", { class: "nav-toggle-pad" }));
      }
      var a = el("a", { href: ROOT + node.path, text: node.title });
      if (node === current) a.className = "current";
      row.appendChild(a);
      li.appendChild(row);
      if (hasKids) {
        if (open) li.classList.add("open");
        li.appendChild(buildTree(node.children));
      }
      ul.appendChild(li);
    });
    return ul;
  }
  var sidebar = el("nav", { class: "sidebar" }, [buildTree(NAV)]);

  // ---- パンくず ----
  if (trail.length) {
    var bc = el("nav", { class: "breadcrumb" }, [el("a", { href: ROOT, text: "トップ" })]);
    trail.forEach(function (node, i) {
      bc.appendChild(el("span", { class: "sep", text: "/" }));
      bc.appendChild(i === trail.length - 1
        ? el("span", { text: node.title })
        : el("a", { href: ROOT + node.path, text: node.title }));
    });
    main.insertBefore(bc, main.firstChild);
  }

  // ---- 子ページ一覧 ----
  var kids = PATH === "" ? NAV : (current && current.children) || [];
  Array.prototype.forEach.call(main.querySelectorAll("[data-children]"), function (box) {
    box.className = "cards";
    kids.forEach(function (node) {
      box.appendChild(el("a", { class: "card", href: ROOT + node.path }, [
        el("strong", { text: node.title }),
        node.desc ? el("span", { text: node.desc }) : null
      ]));
    });
  });

  var layout = el("div", { class: "layout" }, [sidebar, main]);
  body.insertBefore(layout, body.firstChild);
  body.insertBefore(header, layout);

  // ---- サイドバー開閉 ----
  var narrow = window.matchMedia("(max-width: 800px)");
  function setSidebar(open) {
    body.classList.toggle("sidebar-closed", !open);
  }
  setSidebar(narrow.matches ? false : store("sidebar") !== "0");
  menuBtn.addEventListener("click", function () {
    var open = body.classList.contains("sidebar-closed");
    setSidebar(open);
    if (!narrow.matches) store("sidebar", open ? "1" : "0");
  });
  main.addEventListener("click", function () {
    if (narrow.matches) setSidebar(false);
  });

  themeBtn.addEventListener("click", function () {
    var dark = document.documentElement.getAttribute("data-theme") === "dark" ||
      (!document.documentElement.getAttribute("data-theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    var next = dark ? "light" : "dark";
    store("theme", next);
    applyTheme(next);
  });

  // ---- コードの色付け ----
  if (document.querySelector("pre code")) {
    var hl = el("script", { src: HLJS + "highlight.min.js" });
    hl.onload = function () { window.hljs.highlightAll(); };
    document.head.appendChild(hl);
  }

  // ---- 数式 ----
  window.MathJax = {
    tex: { inlineMath: [["$", "$"], ["\\(", "\\)"]] },
    options: { skipHtmlTags: ["script", "noscript", "style", "textarea", "pre", "code"] }
  };
  if (/\$|\\\(/.test(main.textContent)) {
    document.head.appendChild(el("script", {
      src: "https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-mml-chtml.js", async: ""
    }));
  }
})();
