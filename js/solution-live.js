/* 优德习正 · 扫码测评（活码）解决方案生成器
 * 输入：lead = { name, grade, overall, weak:[维度中文名或dim key], dims:[{name,rate,dim,icon}] }
 * 输出：一段可直接注入页面、可打印的「给家长的解决方案书」HTML 字符串
 * 10 个维度与 triage.js 一一对应，why/steps 紧扣用户评估框架。
 */
window.UDXZ_SOLUTION_LIVE = (function () {
  "use strict";
  var ADVICE = {
    nei: {
      title: "内动力",
      why: "内动力是学习的发动机。孩子不是不想好，而是「为谁学」没理顺——把学习当成家长的事，动力就外挂了。",
      steps: [
        "把「你要学」换成「你想达成什么」：让孩子自己说出目标（想考哪所高中、想学会什么）。",
        "放大「掌控感」：让孩子自己安排学习，家长只划边界不包办。",
        "用「进步可见」代替「结果评价」：记录每一次小突破，让努力有回响。",
        "链接意义：把枯燥练习和孩子真正在乎的事连起来（如喜欢篮球→用比赛统计练数学）。"
      ]
    },
    think: {
      title: "思维模式·思考",
      why: "思维方式决定孩子怎么消化知识。只会记答案的孩子遇到新题就卡；会思考的孩子能把方法迁移。老师的教育方式要匹配孩子的思维层级——有的需先搭脚手架，有的可直接放手。",
      steps: [
        "多问「你是怎么想的」，少给标准答案，逼出思维过程。",
        "错题不只改结果，要追问「哪一步想歪了」，把错误变成思维样本。",
        "区分听课/记忆/学习方式：观察孩子是听会、看会还是做会，用他最顺的方式教。",
        "培养「先理解再记忆」：长句子先拆主干再补定语，避免死记硬背。"
      ]
    },
    rule: {
      title: "规则意识",
      why: "规则意识不是听话，而是「我能管住自己」的自控力。没有规则底线的自由，孩子容易在学习和生活里失控。",
      steps: [
        "家规由亲子共同制定，孩子参与才有认同感。",
        "规则要少而清晰（如屏幕时间、作息），违反有可预期的小后果。",
        "守规时即时肯定，把「遵守」和「被信任」挂钩。",
        "家长带头守规则，不双标。"
      ]
    },
    drive: {
      title: "自驱方式",
      why: "自驱是「没人盯也能往前走」。被盯出来的成绩一松手就掉，自驱出来的习惯才长久。",
      steps: [
        "给任务留白：让孩子自己决定顺序和节奏，哪怕慢一点。",
        "建立每日固定节奏，让「到时间就做」成为肌肉记忆。",
        "容错：做错比不做强，先完成再完美。",
        "让孩子当小老师讲给你听，讲得出才是真会。"
      ]
    },
    interest: {
      title: "兴趣与奖励",
      why: "兴趣是坚持的燃料，奖励制度是让燃料持续燃烧的开关。没有奖励闭环，兴趣容易三分钟热度。",
      steps: [
        "帮孩子找到至少一项能沉浸其中的兴趣（非电子产品优先）。",
        "设置「努力可见」的奖励制度：完成阶段目标给约定奖励，而非随意给。",
        "奖励重精神+体验（陪伴、选择权），少纯物质。",
        "把兴趣和学习打通：用兴趣项目练专注、练坚持、练规划。"
      ]
    },
    self: {
      title: "自我意识",
      why: "自我意识是「认识自己」的能力。孩子只有先看清自己（想要什么、怕什么、为什么冒险），才能管住自己、规划自己。这是所有习惯的地基。",
      steps: [
        "日常多聊「你当时怎么想的」「你最想做的是什么」，帮孩子命名自己的情绪和动机。",
        "用具体事件做镜子：聊最印象深的事（逃课打球/看电视），问「为什么冒这个险、好在哪、害在哪」。",
        "鼓励表达：观察孩子是爱问还是爱答、愿不愿和不熟的人说话，顺势练表达。",
        "不评判地倾听，让孩子敢把真实想法说出来。"
      ]
    },
    char: {
      title: "性格与动手",
      why: "性格决定学习风格的天花板——内向的孩子需要表达的安全感，外向的需要收束的练习。而动手能力是「做中学」的入口，很多孩子听懂了却不会做，缺的就是动手这一环。",
      steps: [
        "先识别性格底色：偏内/偏外/中性，匹配沟通与学习方式（内向多给书面表达，外向多给讨论）。",
        "给「不敢表达」的孩子低压力表达机会，逐步扩圈。",
        "增加动手环节：实验、手工、模型、习题演算，把「听懂」变成「做出」。",
        "用体验式内容（模仿/竞技/创造/设计/探索）替代纯听讲，动手即理解。"
      ]
    },
    family: {
      title: "家庭联结",
      why: "家庭联结是孩子安全感的来源。孩子心里有父母、理解父母的辛苦，才愿意听进父母的话，也更有力量面对学习。",
      steps: [
        "让孩子「看见」父母：讲讲工作内容、带娃体验一天你的工作。",
        "记住彼此生日，建立家庭仪式感。",
        "常聊「爸爸妈妈在你心里是什么样」，让孩子表达对父母的真实感受。",
        "父母意见一致：对孩子评价、要求先达成共识，不让孩子钻空子。"
      ]
    },
    comp: {
      title: "理解·记忆·听课",
      why: "初中分化从「能不能读懂长句子、跟不跟得住课」开始。理解靠方法，记忆靠结构，听课靠主动。三者弱，知识就进不去。",
      steps: [
        "练长句拆解：定语多的句子先抓主干再补细节，读懂再记。",
        "记忆用「结构法」：画思维导图、归类，少机械重复。",
        "听课变主动：预习找疑点、课上盯难点、课后复盘，三步闭环。",
        "做题先总结规律，再联想相关知识，把孤立知识点连成网。"
      ]
    },
    math: {
      title: "数学状态",
      why: "数学卡壳常不是笨，而是「情绪+习惯+思维」三层叠加：一听就烦是情绪，一听就错是不习惯读题，想学听不懂是思维能力没接上。要分层判断。",
      steps: [
        "先分病因：是「不喜欢老师/情绪抵触」，还是「不读题/习惯差」，还是「真听不懂/思维弱」。",
        "情绪层：换让孩子喜欢的老师风格，先恢复对数学的好感。",
        "习惯层：强制「圈关键词、慢读题」，把语文阅读带进数学。",
        "思维层：学系统学习法，从「会做」到「知道为什么做」，补思维能力。"
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
        if (t.indexOf(w) >= 0) return k;   // 标题包含弱项词
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
