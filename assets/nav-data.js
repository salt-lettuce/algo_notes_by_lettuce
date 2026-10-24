// サイドバーの構成。ページを増やしたらここに追記する。
// path はサイトのルートからの相対パス（末尾は "/"）。
window.NAV_DATA = [
  {
    title: "データ構造",
    path: "data-structure/",
    desc: "区間クエリや順序付き集合など",
    children: [
      { title: "Fenwick Tree (BIT)", path: "data-structure/fenwick-tree/", desc: "一点更新・区間和を O(log N)" },
      { title: "Segment Tree", path: "data-structure/segment-tree/", desc: "モノイドの区間クエリ・一点更新を O(log N)" },
      { title: "SortedContainers", path: "data-structure/sorted-containers/", desc: "SortedList / SortedSet / SortedDict" }
    ]
  },
  {
    title: "文字列",
    path: "string/",
    desc: "文字列アルゴリズム",
    children: [
      { title: "Suffix Array", path: "string/suffix-array/", desc: "接尾辞を辞書順に並べた配列" }
    ]
  },
  {
    title: "探索",
    path: "search/",
    desc: "値や境界を効率よく探す",
    children: [
      { title: "Binary Search", path: "search/binary-search/", desc: "ソート済み配列の探索を O(log N)" }
    ]
  },
  {
    title: "グラフ",
    path: "graph/",
    desc: "グラフ探索と最短経路",
    children: [
      { title: "BFS（幅優先探索）", path: "graph/bfs/", desc: "重みなしグラフの最短距離を O(N+M)" },
      { title: "DFS（深さ優先探索）", path: "graph/dfs/", desc: "行けるところまで進むグラフ探索" },
      { title: "0-1 BFS", path: "graph/01-bfs/", desc: "重みが 0 か 1 のグラフの最短距離を O(N+M)" },
      { title: "ダイクストラ法", path: "graph/dijkstra/", desc: "非負重みの最短経路を O((N+M) log N)" },
      { title: "ベルマン-フォード法", path: "graph/bellman-ford/", desc: "負の重みを含む最短経路・負閉路の検出" }
    ]
  },
  {
    title: "ライブラリ",
    path: "library/",
    desc: "コンテストで使う自作コード(参照URL付き)"
  }
];
