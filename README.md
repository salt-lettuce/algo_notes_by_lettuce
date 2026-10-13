# Algorithm Notes

GitHub Pages で公開するアルゴリズムまとめサイト（ビルド不要の静的 HTML）。

## フォルダ構成

```
algo-notes/
├── index.html              トップ（分類一覧）
├── assets/
│   ├── nav-data.js         ★ サイドバーの構成（ページを増やしたらここに追記）
│   ├── site.js             ヘッダー・サイドバー・パンくず・子ページ一覧を生成
│   ├── diagram.js          セグ木・BIT の図(SVG)をステップ表示
│   ├── icon.svg            サイトのアイコン（favicon・ヘッダーのロゴ）
│   └── style.css
├── data-structure/index.html       分類ページ
│   ├── fenwick-tree/index.html     アルゴリズムページ（画像は同じフォルダに置く）
│   ├── segment-tree/index.html
│   └── sorted-containers/index.html
├── string/index.html
│   └── suffix-array/index.html
├── search/index.html
│   └── binary-search/index.html
└── _template/                      新しいページのひな形（GitHub Pages には公開されない）
    ├── page/index.html             アルゴリズムページ用
    └── category/index.html         分類ページ用
```

1ページ = 1フォルダ + `index.html`。子ページはそのフォルダの中にさらにフォルダを作ります。

## ページを追加する手順

1. `_template/page/` をコピーして `分類/ページ名/` にする（例：`graph/dijkstra/`）
2. `index.html` の「★」の箇所を書き換える。`data-path` はサイトのルートからのパス
   ```html
   <body data-root="../../" data-path="graph/dijkstra/">
   ```
3. `assets/nav-data.js` の該当分類の `children` に追記
   ```js
   { title: "ダイクストラ法", path: "graph/dijkstra/", desc: "非負重みの最短経路" }
   ```

分類を増やすときは `_template/category/` をコピーし、`nav-data.js` の一番外側に追加します。
`<div data-children></div>` を置いたところには子ページのカード一覧が自動で出ます。

## ページの書式

各アルゴリズムページは次の順で書きます（`_template/page/index.html` と同じ）。

1. `<h1>英語名（日本語名）</h1>` と `<p class="lead">〜について解説します.</p>`、あれば参考リンク
2. `<h2>〇〇について</h2>`：概要・使い道と、計算量の表（`操作` / `計算量`）
3. 操作・しくみの説明（操作ごとに `<h2>`、補足は `<h3>`、図は任意）
4. `<h2>ライブラリでの実装</h2>`：コード、実行結果、`<h3>操作一覧</h3>` の表（`操作` / `操作内容` / `計算量`）
5. 任意：使い方の例、似たものとの比較

- 計算量は `$O(\log N)$` のように MathJax で書く（表の中も同じ）
- 句読点は「,」「.」
- 表は `<div class="table-wrap">` で囲む
- 実行結果は `<pre class="output"><code class="nohighlight">`

## GitHub Pages で公開

1. このフォルダの中身をリポジトリのルートに置いて push
2. リポジトリの Settings → Pages → Source を「Deploy from a branch」、Branch を `main` / `(root)` に
3. 数分後に `https://<ユーザー名>.github.io/<リポジトリ名>/` で公開

## 機能

- サイドバーは ☰ で開閉（状態は記憶）、分類・子ページごとに ▸ で折りたたみ
- 現在のページはハイライトされ、その祖先は自動で展開
- ダーク/ライト切替（◐）、スマホ対応
- コードの色付け（highlight.js）、数式（MathJax、`$...$` 記法）
- セグ木・BIT の図（`diagram.js`）：`<figure class="diagram" data-diagram>` の中に JSON を書くと SVG で描画され、`steps` を2つ以上書くとクリックで1段階ずつ進む。書式は `assets/diagram.js` 冒頭のコメント参照
