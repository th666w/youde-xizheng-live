/* 优德习正 · 扫码测评（活码）解决方案生成器
 * 输入：lead = { name, grade, overall, weak:[维度中文名或dim key], dims:[{name,rate,dim,icon}] }
 * 输出：一段可直接注入页面、可打印的「给家长的解决方案书」HTML 字符串
 */
window.UDXZ_SOLUTION_LIVE = (function () {
  "use strict";
  var ADVICE = {
    tuo: {
      title: "拖拉磨蹭",
      why: "拖拉不是懒，而是「启动门槛」太高：任务太模糊、没有拆分，孩子的大脑会本能地回避。",
      steps: [
        "把大任务切成「一口能吃下」的小块——比如「先写 5 分钟数学」，而不是「写完作业」。",
        "用计时器制造游戏感：番茄钟 15/25 分钟，到点就休息，孩子更愿意开始。",
        "先难后易：把最不想做的放第一，后面越来越轻松。",
        "完成即给具体表扬：「你刚才 15 分钟专注写完了口算，真棒」比「你真乖」有用得多。"
      ]
    },
    zhuan: {
      title: "专注力不足",
      why: "专注是肌肉，不是态度。环境干扰多 + 任务超出年龄承受力 = 注意力散掉。",
      steps: [
        "清理桌面干扰：桌上只留当下要用的东西，手机离远一点。",
        "单一任务原则：一次只做一件事，别边听歌边写作业。",
        "分段专注 + 真休息：每段之间动起来（伸展、喝水），不是刷短视频。",
        "逐步拉长专注时长，并把每次小进步记下来，让孩子看见自己变强。"
      ]
    },
    zizhu: {
      title: "自主学习弱",
      why: "孩子不是不会学，而是被「喂」习惯了——凡事代劳，自然就不主动。",
      steps: [
        "把「你快去做」改成「你来定」：给选择权（先做哪科、坐哪学）。",
        "建立固定节奏：每天同一时间做同一件事，习惯成自然。",
        "留容错空间：做错比不做强，先完成再完美。",
        "让孩子当小老师讲给你听，讲得出才是真懂。"
      ]
    },
    goutong: {
      title: "亲子沟通紧张",
      why: "沟通紧张往往不是话说得少，而是「评判多、倾听少」，孩子一开口就防御。",
      steps: [
        "每天 10 分钟「只听不说」专属时间：让孩子主导话题。",
        "用「我信息」代替指责：说「我担心你睡太晚」，而非「你总是熬夜」。",
        "冲突时先降温再谈事，情绪上头时先暂停。",
        "多描述行为、少贴标签，不把一次失误说成「你就是不行」。"
      ]
    }
  };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function matchKeys(weak) {
    return (weak || []).map(function (w) {
      if (ADVICE[w]) return w;
      for (var k in ADVICE) {
        var t = ADVICE[k].title;
        if (t === w) return k;
        if (t.indexOf(w) >= 0) return k;   // 标题包含弱项词（如「专注力不足」含「专注力」）
        if (w.indexOf(t) >= 0) return k;   // 弱项词包含标题
      }
      return null;
    }).filter(Boolean);
  }

  function build(lead) {
    var keys = matchKeys(lead.weak);
    var targets = keys.length ? keys : Object.keys(ADVICE);
    var sections = targets.map(function (k) {
      var a = ADVICE[k];
      return '<div style="margin:18px 0">' +
        '<h3 style="margin:0 0 6px;font-size:17px;color:#1e40af">▍' + esc(a.title) + '</h3>' +
        '<p style="margin:0 0 8px;color:#374151"><b>为什么：</b>' + esc(a.why) + '</p>' +
        '<ol style="margin:0;padding-left:20px;color:#374151">' +
        a.steps.map(function (s) { return '<li style="margin:4px 0">' + esc(s) + '</li>'; }).join("") +
        '</ol></div>';
    }).join("");

    var weakNames = targets.map(function (k) { return ADVICE[k].title; }).join("、");

    return '<div style="font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',\'Microsoft YaHei\',sans-serif;color:#1f2937;max-width:820px;margin:0 auto;padding:8px 4px;line-height:1.7">' +
      '<div style="border-bottom:3px solid #2563eb;padding-bottom:14px;margin-bottom:16px">' +
        '<div style="font-size:13px;color:#2563eb;letter-spacing:2px">优德习正 · 习惯教育</div>' +
        '<h1 style="margin:6px 0 2px;font-size:24px">给 ' + esc(lead.name || "孩子") + ' 的专属习惯改善方案</h1>' +
        '<div style="color:#6b7280;font-size:14px">' + esc(lead.grade || "未填年级") + ' · 整体习惯分 ' + esc(lead.overall != null ? lead.overall + "%" : "—") + ' · 重点：' + esc(weakNames) + '</div>' +
      '</div>' +
      '<p style="background:#eff6ff;border:1px solid #bfdbfe;color:#1e40af;padding:12px 14px;border-radius:10px;font-size:14px;margin:0 0 4px">本方案基于本次扫码初筛自动生成，供老师与家长参考；正式落地建议预约一对一沟通，定制 4 周跟进计划。</p>' +
      sections +
      '<div style="margin-top:20px;border-top:1px dashed #cbd5e1;padding-top:14px;color:#6b7280;font-size:13px">生成时间：' + new Date().toLocaleString("zh-CN") + ' ｜ 优德习正 · 习惯教育</div>' +
    '</div>';
  }

  return { build: build, ADVICE: ADVICE };
})();
