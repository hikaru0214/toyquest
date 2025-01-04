$(function () {
    // ボタンをクリックしたらモーダル表示
  $(".modalBtn").on("click", function () {
    $(".modalBg").fadeIn();
  });
  // ×ボタンクリックでモーダル閉じる
  $(".modalClose").on("click", function () {
    $(".modalBg").fadeOut();
  });
});