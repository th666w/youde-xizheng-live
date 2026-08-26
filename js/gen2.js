/* 生成台逻辑：自动算出活码主页地址，生成海报二维码（无需 key） */
(function () {
  "use strict";
  function liveUrl() {
    var base = location.origin + location.pathname.replace(/gen\.html$/, "") + "index.html";
    // 关键：必须带上预览鉴权参数 ?eo_token=...&eo_time=...，否则扫出来会 401
    return base + (location.search || "");
  }
  var url = liveUrl();
  var box = document.getElementById("qrBox");
  try {
    var qr = qrcode(0, "M");
    qr.addData(url);
    qr.make();
    box.innerHTML = qr.createImgTag(6, 8);
    document.getElementById("qrUrl").textContent = url;
  } catch (e) {
    box.textContent = "二维码生成失败，请刷新重试。";
  }
})();
