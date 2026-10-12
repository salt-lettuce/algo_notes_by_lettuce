# Algorithm Notes

GitHub Pages で公開するアルゴリズムまとめサイト（ビルド不要の静的 HTML）。

## フォルダ構成

```
algo-notes/
├── index.html              トップ（分類一覧）
├── assets/
│   ├── nav-data.js         ★ サイドバーの構成（ページを増やしたらここに追記）
│   ├── site.js             ヘッダー・サイドバー・パンくず・子ページ一覧を生成
│   └── style.css
├── data-structure/index.html       分類ページ
│   ├── fenwick-tree/index.html     アルゴリズムページ（画像は同じフォルダに置く）
│   ├── segment-tree/index.html
│   └── sorted-containers/index.html
└── string/index.html
    └── suffix-array/index.html
```

1ページ = 1フォルダ + `index.html`。子ページはそのフォルダの中にさらにフォルダを作ります。

## ページを追加する手順

1. 例：`graph/dijkstra/index.html` を作る
2. `<body>` に `data-root`（ルートまでの相対パス）と `data-path` を書く
   ```html
   <body data-root="../../" data-path="graph/dijkstra/">
   ```
3. `assets/nav-data.js` の該当分類の `children` に追記
   ```js
   { title: "ダイクストラ法", path: "graph/dijkstra/", desc: "非負重みの最短経路" }
   ```

分類を増やすときは、フォルダ + `index.html` を作って `nav-data.js` の一番外側に追加します。
`<div data-children></div>` を置いたところには子ページのカード一覧が自動で出ます。

## GitHub Pages で公開

1. このフォルダの中身をリポジトリのルートに置いて push
2. リポジトリの Settings → Pages → Source を「Deploy from a branch」、Branch を `main` / `(root)` に
3. 数分後に `https://<ユーザー名>.github.io/<リポジトリ名>/` で公開

## 機能

- サイドバーは ☰ で開閉（状態は記憶）、分類・子ページごとに ▸ で折りたたみ
- 現在のページはハイライトされ、その祖先は自動で展開
- ダーク/ライト切替（◐）、スマホ対応
- コードの色付け（highlight.js）、数式（MathJax、`$...$` 記法）
