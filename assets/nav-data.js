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
  }
];
