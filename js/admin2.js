/* 优德习正 · 线索后台逻辑
 * 通过 CloudBase 云函数 HTTP 触发地址读取 leads，列表展示，点开生成解决方案书。
 * 云函数地址取 config.js；管理密码由管理员在配置框粘贴（存本浏览器）。
 */
(function () {
  "use strict";
  var CFG = window.UDXZ_CONFIG || {};
  var $ = function (s) { return document.querySelector(s); };
  var cbHttp = (localStorage.getItem("udxz_cb_http") || CFG.cloudbaseHttp || "").replace(/\/$/, "").trim();
  var adminPwd = (localStorage.getItem("udxz_cb_pwd") || CFG.adminPwd || "").trim();
  if (cbHttp && adminPwd) $("#setupBox").style.display = "none";

  $("#saveUrlBtn").addEventListener("click", function () {
    var u = $("#cbHttpInput").value.trim();
    var k = $("#cbPwdInput").value.trim();
    if (!u) { alert("请填写云函数 HTTP 触发地址"); return; }
    if (!k) { alert("请填写后台管理密码"); return; }
    localStorage.setItem("udxz_cb_http", u);
    localStorage.setItem("udxz_cb_pwd", k);
    cbHttp = u.replace(/\/$/, "");
    adminPwd = k;
    $("#setupBox").style.display = "none";
    loadLeads();
  });
  $("#loadBtn").addEventListener("click", loadLeads);
  $("#refreshBtn").addEventListener("click", loadLeads);
  $("#closeBtn").addEventListener("click", function () { $("#modal").classList.remove("show"); });
  $("#printBtn").addEventListener("click", function () { window.print(); });

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function fmtTs(v) {
    try {
      var d = new Date(v);
      if (isNaN(d.getTime())) return String(v);
      var p = function (n) { return String(n).padStart(2, "0"); };
      return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes());
    } catch (e) { return String(v); }
  }

  function loadLeads() {
    if (!cbHttp || !adminPwd) { alert("请先在上方配置云函数地址与管理密码"); return; }
    $("#listArea").innerHTML = '<div class="empty">加载中…</div>';
    // CloudBase HTTP 访问服务：只暴露一个根 URL，密码放 queryString，函数内部 GET 才校验
    fetch(cbHttp + "/?pwd=" + encodeURIComponent(adminPwd), { headers: {} })
      .then(function (r) {
        if (!r.ok) return r.text().then(function (t) { throw new Error(t || r.status); });
        return r.json();
      })
      .then(function (d) {
        if (!d.success) throw new Error(d.error || "读取失败");
        renderList(d.leads || []);
      })
      .catch(function (e) {
        $("#listArea").innerHTML = '<div class="empty">读取失败：' + esc(e.message || e) + '<br>请确认云函数地址正确、管理密码一致，且该函数已部署并启用 HTTP 访问服务</div>';
      });
  }

  function weakArr(l) {
    if (Array.isArray(l.weak)) return l.weak.filter(Boolean);
    return String(l.weak || "").split("、").map(function (s) { return s.trim(); }).filter(Boolean);
  }

  function renderList(leads) {
    if (!leads.length) {
      $("#statRow").style.display = "none";
      $("#listArea").innerHTML = '<div class="empty">还没有线索，家长扫码提交后会出现在这里</div>';
      return;
    }
    var weakCount = {};
    leads.forEach(function (l) {
      weakArr(l).forEach(function (w) { if (w) weakCount[w] = (weakCount[w] || 0) + 1; });
    });
    var topWeak = Object.keys(weakCount).sort(function (a, b) { return weakCount[b] - weakCount[a]; }).slice(0, 3)
      .map(function (k) { return k + "(" + weakCount[k] + ")"; }).join("、") || "—";
    $("#statRow").style.display = "flex";
    $("#statRow").innerHTML =
      '<div class="stat"><div class="n">' + leads.length + '</div><div class="l">累计线索</div></div>' +
      '<div class="stat"><div class="n" style="font-size:14px;line-height:1.8">' + topWeak + '</div><div class="l">高频薄弱项</div></div>';

    var rows = leads.map(function (l, i) {
      var weakTags = weakArr(l)
        .map(function (w) { return '<span class="weak-tag">' + esc(w) + '</span>'; }).join("");
      return '<tr>' +
        '<td>' + (i + 1) + '</td>' +
        '<td>' + esc(fmtTs(l.ts || l.created_at)) + '</td>' +
        '<td>' + esc(l.name) + '</td>' +
        '<td>' + esc(l.phone) + '</td>' +
        '<td>' + esc(l.grade || "—") + '</td>' +
        '<td>' + esc(l.overall != null ? l.overall + "%" : "—") + '</td>' +
        '<td>' + weakTags + '</td>' +
        '<td><button class="btn btn-primary" data-i="' + i + '" style="padding:5px 12px;font-size:12px">查看/方案</button></td>' +
      '</tr>';
    }).join("");
    $("#listArea").innerHTML =
      '<table class="leads"><thead><tr><th>#</th><th>提交时间</th><th>姓名</th><th>手机</th><th>年级</th><th>整体分</th><th>薄弱项</th><th>操作</th></tr></thead><tbody>' + rows + '</tbody></table>';
    $("#listArea").querySelectorAll("button[data-i]").forEach(function (b) {
      b.addEventListener("click", function () { openDetail(leads[Number(this.getAttribute("data-i"))]); });
    });
  }

  function openDetail(l) {
    var lead = {
      name: l.name, grade: l.grade, overall: l.overall,
      weak: weakArr(l)
    };
    var infoHtml =
      '<div style="display:flex;flex-wrap:wrap;gap:10px 24px;background:#f8fafc;border:1px solid #eef2f7;border-radius:12px;padding:14px 16px;margin:14px 0;font-size:14px">' +
        infoItem("姓名", l.name) + infoItem("手机", l.phone) + infoItem("年级", l.grade) +
        infoItem("最想改善", l.improve) + infoItem("学校/班级", l.school) + infoItem("来源", l.source) +
        (l.note ? infoItem("备注", l.note) : "") +
      '</div>';
    var solHtml = window.UDXZ_SOLUTION_LIVE.build(lead);
    $("#modalTitle").textContent = "线索详情 · " + (l.name || "");
    $("#modalBody").innerHTML = infoHtml + solHtml;
    $("#modal").classList.add("show");
  }

  function infoItem(k, v) { return '<div><span style="color:#94a3b8">' + esc(k) + '：</span><b>' + esc(v || "—") + '</b></div>'; }

  if (cbHttp && adminPwd) loadLeads();
})();
