/* 优德习正 · 扫码测评（活码）前端主逻辑
 * 流程：信息收集 → 12 题习惯初筛 → 提交 → 本机锁定（对家长而言"消失"）
 * 收数据：提交到腾讯云 CloudBase 云函数（config.js 的 cloudbaseHttp），机构后台网页读取线索并自动出方案。
 */
(function () {
  "use strict";
  const CFG = window.UDXZ_CONFIG || {};
  const T = window.UDXZ_TRIAGE;
  const LOCK_KEY = "udxz_lead_v1";
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = (s) =>
    String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const app = $("#app");
  let state = { info: null, answers: {}, qi: 0, submitting: false };

  /* ---------- 工具 ---------- */
  function toast(msg, type) {
    let box = $("#toast-box");
    if (!box) {
      box = document.createElement("div");
      box.id = "toast-box";
      box.style.cssText =
        "position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:9999;display:flex;flex-direction:column;gap:8px;align-items:center";
      document.body.appendChild(box);
    }
    const t = document.createElement("div");
    t.style.cssText =
      "background:" +
      (type === "error" ? "#dc2626" : type === "success" ? "#16a34a" : "#111827") +
      ";color:#fff;padding:10px 18px;border-radius:10px;font-size:14px;box-shadow:0 8px 24px rgba(0,0,0,.12)";
    t.textContent = msg;
    box.appendChild(t);
    setTimeout(() => t.remove(), 2400);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise((res) => {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (e) {}
      ta.remove();
      res();
    });
  }

  function fmtTime(ts) {
    const d = new Date(ts);
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
  }

  /* ---------- 渲染：信息收集 ---------- */
  function renderGate() {
    app.innerHTML = `
      <div class="container" style="max-width:560px">
        <div class="card">
          <div class="brand" style="display:flex;align-items:center;gap:10px;margin-bottom:10px;cursor:default">
            <div class="brand-logo">优</div>
            <div><div class="brand-name">${esc(CFG.institution || "优德习正")}</div>
            <div class="brand-sub">${esc(CFG.slogan || "")}</div></div>
          </div>
          <h2 style="font-size:20px;color:var(--gray-900);margin:6px 0 4px">欢迎参加免费习惯测评</h2>
          <p class="muted" style="margin-bottom:16px">填写以下信息后开始，约 2 分钟。结束后老师会为您生成专属分析。</p>
          <div class="form-group"><label>孩子姓名 <span class="req">*</span><input id="f_name" class="form-input" placeholder="如：小明"></label></div>
          <div class="form-group"><label>家长手机号 <span class="req">*</span><input id="f_phone" class="form-input" inputmode="numeric" placeholder="用于回访联系"></label></div>
          <div class="form-row">
            <div class="form-group"><label>孩子年级
              <select id="f_grade" class="form-input"><option value="">请选择</option><option>小学1-2年级</option><option>小学3-4年级</option><option>小学5-6年级</option><option>初一</option><option>初二</option><option>初三</option><option>高中</option></select>
            </label></div>
            <div class="form-group"><label>最想改善
              <select id="f_improve" class="form-input"><option value="">请选择</option><option>拖拉磨蹭</option><option>专注力不足</option><option>自主学习弱</option><option>亲子沟通紧张</option><option>其他</option></select>
            </label></div>
          </div>
          <div class="form-group"><label>学校/班级<input id="f_school" class="form-input" placeholder="选填"></label></div>
          <div class="form-group"><label>来源渠道
            <select id="f_source" class="form-input"><option value="">请选择</option><option>社区活动</option><option>学校推广</option><option>朋友推荐</option><option>线上了解</option><option>其他</option></select>
          </label></div>
          <div class="form-group"><label>备注<input id="f_note" class="form-input" placeholder="选填，如特殊诉求"></label></div>
          <button id="startBtn" class="btn btn-primary btn-block">开始测评 →</button>
          <div id="gateMsg" class="lead-msg" style="color:var(--danger);font-size:13px;min-height:18px;margin-top:8px"></div>
        </div>
      </div>`;
    $("#startBtn").addEventListener("click", function () {
      const name = $("#f_name").value.trim();
      const phone = $("#f_phone").value.trim();
      if (!name) { $("#gateMsg").textContent = "请填写孩子姓名"; return; }
      if (!/^1\d{10}$/.test(phone)) { $("#gateMsg").textContent = "请填写正确的 11 位手机号"; return; }
      state.info = {
        name, phone,
        grade: $("#f_grade").value,
        improve: $("#f_improve").value,
        school: $("#f_school").value.trim(),
        source: $("#f_source").value,
        note: $("#f_note").value.trim(),
      };
      renderQuiz();
    });
  }

  /* ---------- 渲染：答题 ---------- */
  function renderQuiz() {
    const i = state.qi;
    const total = T.questions.length;
    const item = T.questions[i];
    const dim = T.dims.find((d) => d.id === item.dim);
    const chosen = state.answers[i];
    const pct = Math.round(((i) / total) * 100);
    app.innerHTML = `
      <div class="container" style="max-width:720px">
        <div class="quiz-header">
          <div class="progress-wrap"><div class="progress-bar" style="width:${pct}%"></div></div>
          <div class="progress-text"><span>第 ${i + 1} / ${total} 题</span><span>${esc(dim.icon)} ${esc(dim.name)}</span></div>
        </div>
        <div class="quiz-card card">
          <span class="q-dimension">${esc(dim.icon)} ${esc(dim.name)}</span>
          <div class="q-text">${esc(item.q)}？</div>
          <div class="q-options" id="opts">
            ${T.options
              .map(
                (o) => `<button class="q-option ${chosen === o.v ? "selected" : ""}" data-v="${o.v}">
                  <div class="opt-top"><span class="opt-label">${o.label}</span><span class="opt-check">${chosen === o.v ? "✓" : ""}</span></div>
                </button>`
              )
              .join("")}
          </div>
        </div>
        <div class="quiz-nav">
          <button class="btn btn-outline" id="prevBtn" ${i === 0 ? "disabled" : ""}>← 上一题</button>
          <button class="btn btn-primary" id="nextBtn">${i === total - 1 ? "提交测评 ✓" : "下一题 →"}</button>
        </div>
      </div>`;
    $("#opts").querySelectorAll(".q-option").forEach((btn) => {
      btn.addEventListener("click", function () {
        state.answers[i] = Number(this.dataset.v);
        renderQuiz();
      });
    });
    $("#prevBtn").addEventListener("click", () => { if (state.qi > 0) { state.qi--; renderQuiz(); } });
    $("#nextBtn").addEventListener("click", () => {
      if (!state.answers[i]) { toast("请先选择一个选项", "error"); return; }
      if (state.qi < total - 1) { state.qi++; renderQuiz(); }
      else submit();
    });
  }

  /* ---------- 渲染：结果 ---------- */
  function dimBarsHTML(dims) {
    return `<div class="dim-grid">${dims
      .map((d) => {
        const color = d.rate >= 70 ? "var(--success)" : d.rate >= 50 ? "var(--warning)" : "var(--danger)";
        return `<div class="dim-card">
          <div class="d-name">${esc(d.icon)} ${esc(d.name)}</div>
          <div class="d-bar-wrap"><div class="d-bar" style="width:${d.rate}%;background:${color}"></div></div>
          <div class="d-row"><span class="muted" style="font-size:12px">习惯分</span><span class="d-rate" style="color:${color}">${d.rate}%</span></div>
        </div>`;
      })
      .join("")}</div>`;
  }

  function resultBlock(result) {
    const weakHTML = result.weak.length
      ? `<div class="lead-banner" style="background:var(--danger-bg);color:#991b1b;border-color:#fecaca">
           重点关注：${esc(result.weak.join("、"))}（建议老师优先跟进）
         </div>`
      : `<div class="lead-banner lead-banner-ok">暂无显著薄弱项，整体习惯良好 👍</div>`;
    return `
      <div class="report-head">
        <h2>习惯初筛结果</h2>
        <div class="sub">${esc(state.info.name)} · ${esc(state.info.grade || "未填年级")}</div>
        <div class="report-score-row">
          <div class="score-block"><div class="num">${result.overall}%</div><div class="label">整体习惯分</div></div>
        </div>
      </div>
      ${weakHTML}
      <div class="report-section"><h3><span class="sec-icon">📊</span>各维度表现</h3>${dimBarsHTML(result.dims)}</div>`;
  }

  function contactLine() {
    return CFG.contactText ? `<div class="muted text-center mt-2">${esc(CFG.contactText)}</div>` : "";
  }

  function bannerHTML(status) {
    if (status === "offline")
      return `<div class="lead-banner">⚠️ 当前为离线模式：请点击下方「复制结果发给老师」完成提交</div>`;
    if (status === "sent")
      return `<div class="lead-banner lead-banner-ok">✅ 已成功提交，老师会尽快与您联系</div>`;
    if (status === "failed")
      return `<div class="lead-banner" style="background:var(--danger-bg);color:#991b1b;border-color:#fecaca">⚠️ 提交未成功，请点「复制结果发给老师」发送给老师</div>`;
    // sending
    return `<div class="lead-banner lead-banner-ok">📨 正在提交给老师…</div>`;
  }

  function renderResult(result, status) {
    app.innerHTML = `
      <div class="container" style="max-width:760px">
        <div id="resultBanner">${bannerHTML(status)}</div>
        ${resultBlock(result)}
        <div class="report-actions" style="display:flex;gap:10px;flex-wrap:wrap;margin-top:18px">
          <button class="btn btn-primary" id="copyBtn">📋 复制结果发给老师</button>
        </div>
        ${contactLine()}
        <div class="footer">本测评为初筛参考，正式方案以老师一对一沟通为准。</div>
      </div>`;
    $("#copyBtn").addEventListener("click", () => {
      copyText(buildShareText(result)).then(() => toast("已复制，请发送给老师微信", "success"));
    });
  }

  /* ---------- 已锁定（对家长而言"消失"） ---------- */
  function renderDone(saved) {
    const result = saved.result;
    app.innerHTML = `
      <div class="container" style="max-width:760px">
        <div class="lead-banner lead-banner-ok">您已完成本次测评，感谢参与 🎉</div>
        ${resultBlock(result)}
        <div class="report-actions" style="display:flex;gap:10px;flex-wrap:wrap;margin-top:18px">
          <button class="btn btn-primary" id="copyBtn">📋 复制结果发给老师</button>
        </div>
        ${contactLine()}
        <div class="footer">提交时间：${esc(fmtTime(saved.ts))}</div>
      </div>`;
    $("#copyBtn").addEventListener("click", () => {
      copyText(buildShareText(result, saved.ts)).then(() => toast("已复制，请发送给老师微信", "success"));
    });
  }

  /* ---------- 共享文本 ---------- */
  function buildShareText(result, ts) {
    const info = state.info || (window.__savedInfo) || {};
    const lines = [];
    lines.push("【优德习正·习惯测评线索】");
    lines.push("姓名：" + (info.name || ""));
    lines.push("手机：" + (info.phone || ""));
    lines.push("年级：" + (info.grade || "未填"));
    lines.push("最想改善：" + (info.improve || "未填"));
    lines.push("来源：" + (info.source || "未填"));
    if (info.note) lines.push("备注：" + info.note);
    lines.push("————");
    lines.push("整体习惯分：" + result.overall + "%");
    result.dims.forEach((d) => lines.push(d.name + "：" + d.rate + "%"));
    if (result.weak.length) lines.push("重点关注：" + result.weak.join("、"));
    if (ts) lines.push("提交时间：" + fmtTime(ts));
    lines.push("（来自优德习正扫码测评）");
    return lines.join("\n");
  }

  /* ---------- 提交 ---------- */
  function updateBanner(status) {
    const el = $("#resultBanner");
    if (el) el.innerHTML = bannerHTML(status);
  }

  function sendToSheet(result, info) {
    const base = (CFG.cloudbaseHttp || "").replace(/\/$/, "");
    if (!base) { updateBanner("offline"); return; }
    const payload = {
      ts: new Date().toISOString(),
      name: info.name,
      phone: info.phone,
      grade: info.grade || "",
      improve: info.improve || "",
      school: info.school || "",
      source: info.source || "",
      note: info.note || "",
      overall: result.overall,
      weak: result.weak,
      dims: result.dims.map((d) => ({ name: d.name, rate: d.rate, dim: d.dim, icon: d.icon })),
      answers: state.answers
    };
    // CloudBase HTTP 访问服务：只暴露一个根 URL，函数按 method 区分 POST(提交)/GET(读取)
    fetch(base + "/", {
      method: "POST",
      // 用 text/plain 而非 application/json：避免触发浏览器 CORS 预检 OPTIONS，
      // 从而绕开 CloudBase 体验版被锁的「跨域设置」（会员功能）。云函数 getBody 仍按字符串解析 JSON。
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: JSON.stringify(payload)
    })
      .then((r) => r.json())
      .then((d) => updateBanner(d && d.success ? "sent" : "failed"))
      .catch(() => updateBanner("failed"));
  }

  function submit() {
    if (state.submitting) return;
    state.submitting = true;
    const result = T.score(state.answers);
    const info = state.info;

    // 先锁定 + 乐观渲染，避免弱网/无网时家长看到"卡住"
    const saved = { info, result, ts: Date.now(), sent: false };
    try { localStorage.setItem(LOCK_KEY, JSON.stringify(saved)); } catch (e) {}
    window.__savedInfo = info;
    renderResult(result, CFG.cloudbaseHttp ? "sending" : "offline");
    state.submitting = false;

    if (CFG.cloudbaseHttp) sendToSheet(result, info);
  }

  /* ---------- 启动 ---------- */
  function init() {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(LOCK_KEY) || "null"); } catch (e) {}
    if (saved && saved.result) {
      window.__savedInfo = saved.info;
      state.info = saved.info; // 重开时 state.info 尚未赋值，供结果页读取
      renderDone(saved);
    } else {
      renderGate();
    }
  }
  init();
})();
