/* 規約類ページの言語切り替え。日本語版と英語版は同じ HTML に両方入っていて、
   <html lang> を差し替えるだけで CSS が出し分ける（style.css の .lang-block）。

   優先順位: URL の ?lang= → 前回の選択（localStorage）→ ブラウザの言語。
   ?lang= を見るのは、アプリ側から表示言語を渡せるようにしておくため
   （日本語端末で英語表示にしている利用者が、規約だけ日本語になるのを防げる）。 */
(function () {
  "use strict";

  var KEY = "meshinavi-lang";
  var root = document.documentElement;

  function normalize(value) {
    return String(value || "").toLowerCase().indexOf("ja") === 0 ? "ja" : "en";
  }

  function initial() {
    var param = new URLSearchParams(window.location.search).get("lang");
    if (param) return normalize(param);
    try {
      var saved = window.localStorage.getItem(KEY);
      if (saved === "ja" || saved === "en") return saved;
    } catch (e) {
      /* プライベートブラウズなどで localStorage が使えない場合は無視する。 */
    }
    return normalize(navigator.language || "ja");
  }

  function apply(lang) {
    root.lang = lang;

    var title = document.body.getAttribute("data-title-" + lang);
    if (title) document.title = title;

    var buttons = document.querySelectorAll(".lang-toggle button");
    for (var i = 0; i < buttons.length; i++) {
      var isActive = buttons[i].getAttribute("data-lang") === lang;
      buttons[i].classList.toggle("is-active", isActive);
      buttons[i].setAttribute("aria-pressed", isActive ? "true" : "false");
    }
  }

  function select(lang) {
    apply(lang);
    try {
      window.localStorage.setItem(KEY, lang);
    } catch (e) {
      /* 保存できなくても、そのページ内での切り替えは効く。 */
    }
  }

  apply(initial());

  document.addEventListener("click", function (event) {
    var button = event.target.closest(".lang-toggle button");
    if (button) select(button.getAttribute("data-lang"));
  });
})();
