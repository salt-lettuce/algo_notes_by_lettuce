// 木構造の図(セグメント木・BIT)を SVG で描画し,ステップごとに切り替える.
// 使い方:
//   <figure class="diagram" data-diagram>
//   <script type="application/json">{ "type": "segtree", "n": 8, "values": [...], "steps": [...] }</script>
//   </figure>
// values: ノード番号をインデックスにした値の配列(0番目は未使用)
// steps : [{ "text": "説明(HTML可)", "hl": { "cur": [1], "use": [2] }, "set": { "9": 2 }, "marks": { "L": 10, "R": 15 } }]
//   hl    … ノードの強調.cur=注目中, use=答えに使った, upd=更新した, ref=参照した, rng=対象の区間
//   set   … ノードの値を書き換える(以降のステップにも引き継がれる)
//   marks … ノードの左上(2つ目は右上)に付けるラベル
(function () {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var U = 72;     // 葉1つ分の幅
  var HH = 22;    // ノード番号の帯の高さ
  var BH = 38;    // 値の欄の高さ
  var VGAP = 12;  // 段の間隔
  var HGAP = 4;   // 横の隙間
  var PAD = 4;
  var HL_KINDS = ["cur", "use", "upd", "ref", "rng"];

  function svg(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function log2(x) { return Math.round(Math.log(x) / Math.LN2); }

  // ノードごとに担当区間 [l, r)(葉の単位)と段を求める
  function layout(cfg) {
    var n = cfg.n, nodes = [], k;
    if (cfg.type === "segtree") {
      for (k = 1; k < 2 * n; k++) {
        var d = Math.floor(Math.log(k) / Math.LN2 + 1e-9);
        var span = n >> d;
        var l = (k - (1 << d)) * span;
        nodes.push({ id: k, l: l, r: l + span, level: d });
      }
    } else if (cfg.type === "bit") {
      for (k = 1; k <= n; k++) {
        var lb = k & -k;
        nodes.push({ id: k, l: k - lb, r: k, level: log2(n) - log2(lb) });
      }
    }
    return nodes;
  }

  function build(fig) {
    var cfg = JSON.parse(fig.querySelector("script[type='application/json']").textContent);
    var nodes = layout(cfg);
    var levels = 0;
    nodes.forEach(function (nd) { levels = Math.max(levels, nd.level + 1); });
    var W = cfg.n * U + PAD * 2;
    var H = levels * (HH + BH) + (levels - 1) * VGAP + PAD * 2;
    var steps = cfg.steps && cfg.steps.length ? cfg.steps : [{}];

    var root = svg("svg", { viewBox: "0 0 " + W + " " + H, role: "img" });
    var byId = {};
    nodes.forEach(function (nd) {
      var x = PAD + nd.l * U + HGAP / 2;
      var y = PAD + nd.level * (HH + BH + VGAP);
      var w = (nd.r - nd.l) * U - HGAP;
      var g = svg("g", { class: "node" }, root);
      svg("rect", { class: "bd", x: x, y: y, width: w, height: HH + BH, rx: 4 }, g);
      svg("rect", { class: "hd", x: x, y: y, width: w, height: HH, rx: 4 }, g);
      var idx = svg("text", { class: "idx", x: x + w / 2, y: y + HH / 2 }, g);
      idx.textContent = nd.id;
      var val = svg("text", { class: "val", x: x + w / 2, y: y + HH + BH / 2 }, g);
      var marks = svg("g", {}, g);
      byId[nd.id] = { g: g, val: val, marks: marks, x: x, y: y, w: w };
    });
    fig.insertBefore(root, fig.firstChild);

    var caption = null, count = null, prev = null, next = null;
    if (steps.length > 1) {
      caption = document.createElement("p");
      caption.className = "dg-caption";
      var ctl = document.createElement("div");
      ctl.className = "dg-controls";
      prev = document.createElement("button");
      prev.type = "button";
      prev.textContent = "◀ 前へ";
      count = document.createElement("span");
      count.className = "dg-count";
      next = document.createElement("button");
      next.type = "button";
      ctl.appendChild(prev);
      ctl.appendChild(count);
      ctl.appendChild(next);
      root.insertAdjacentElement("afterend", ctl);
      ctl.insertAdjacentElement("afterend", caption);
      root.classList.add("clickable");
    }

    if (cfg.legend) {
      var lg = document.createElement("div");
      lg.className = "dg-legend";
      cfg.legend.forEach(function (item) {
        var s = document.createElement("span");
        var sw = document.createElement("i");
        sw.className = "sw " + item[0];
        s.appendChild(sw);
        s.appendChild(document.createTextNode(item[1]));
        lg.appendChild(s);
      });
      fig.appendChild(lg);
    }

    var cur = 0;
    function show(i) {
      cur = i;
      var values = (cfg.values || []).slice();
      for (var s = 0; s <= i; s++) {
        var set = steps[s].set || {};
        for (var k in set) values[k] = set[k];
      }
      var st = steps[i];
      nodes.forEach(function (nd) {
        var o = byId[nd.id];
        var cls = ["node"];
        HL_KINDS.forEach(function (kind) {
          if (st.hl && st.hl[kind] && st.hl[kind].indexOf(nd.id) !== -1) cls.push(kind);
        });
        o.g.setAttribute("class", cls.join(" "));
        o.val.textContent = values[nd.id] === undefined || values[nd.id] === null ? "" : values[nd.id];
        while (o.marks.firstChild) o.marks.removeChild(o.marks.firstChild);
      });
      var placed = {};
      for (var name in st.marks || {}) {
        var o = byId[st.marks[name]];
        if (!o) continue;
        var nth = placed[st.marks[name]] = (placed[st.marks[name]] || 0) + 1;
        var bw = 10 + name.length * 9;
        var bx = nth === 1 ? o.x + 3 : o.x + o.w - bw - 3;
        svg("rect", { class: "badge", x: bx, y: o.y + 3, width: bw, height: HH - 6, rx: 8 }, o.marks);
        svg("text", { class: "badge-t", x: bx + bw / 2, y: o.y + HH / 2 }, o.marks).textContent = name;
      }
      if (caption) {
        caption.innerHTML = st.text || "";
        count.textContent = (i + 1) + " / " + steps.length;
        prev.disabled = i === 0;
        next.textContent = i === steps.length - 1 ? "↺ 最初から" : "次へ ▶";
      }
      root.setAttribute("aria-label", caption ? caption.textContent : (fig.getAttribute("aria-label") || "図"));
    }
    if (steps.length > 1) {
      var go = function () { show(cur === steps.length - 1 ? 0 : cur + 1); };
      prev.addEventListener("click", function () { if (cur > 0) show(cur - 1); });
      next.addEventListener("click", go);
      root.addEventListener("click", go);
    }
    show(0);
  }

  Array.prototype.forEach.call(document.querySelectorAll("[data-diagram]"), build);
})();
