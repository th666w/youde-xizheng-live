/* 优德习正 · 习惯初筛（轻量版，适合活动现场扫码）
 * 4 个维度 × 3 题 = 12 题，每题 5 档。正向计分：越高=习惯越好。
 * 整体分与各维度分用百分比表示（rate = 平均得分 / 5 × 100）。
 * 薄弱维度：rate < 70% 视为需重点关注。
 */
window.UDXZ_TRIAGE = {
  dims: [
    { id: "tuo", name: "拖拉磨蹭", icon: "🐢" },
    { id: "zhuan", name: "专注力", icon: "🎯" },
    { id: "zi", name: "自主学习", icon: "📚" },
    { id: "qin", name: "亲子沟通", icon: "💬" },
  ],
  options: [
    { v: 5, label: "总是" },
    { v: 4, label: "经常" },
    { v: 3, label: "有时" },
    { v: 2, label: "很少" },
    { v: 1, label: "从不" },
  ],
  questions: [
    { dim: "tuo", q: "孩子能自觉开始写作业，不需要家长反复催促" },
    { dim: "tuo", q: "写作业时能一口气做完再玩，不边写边玩" },
    { dim: "tuo", q: "起床、收拾书包等日常事务能按时自行完成" },

    { dim: "zhuan", q: "写作业时不容易被手机、电视或玩具分心" },
    { dim: "zhuan", q: "能连续专注学习 20 分钟以上而不分神" },
    { dim: "zhuan", q: "听课或看书时能跟上节奏，较少走神" },

    { dim: "zi", q: "能自己安排学习顺序，不用家长全程陪着" },
    { dim: "zi", q: "遇到难题愿意先自己思考，再向人求助" },
    { dim: "zi", q: "会主动复习、整理错题，不必家长提醒" },

    { dim: "qin", q: "和孩子沟通时较少发生争吵或冷战" },
    { dim: "qin", q: "孩子愿意主动和我说学校里发生的事" },
    { dim: "qin", q: "我们对「如何培养好习惯」有比较一致的看法" },
  ],

  // answers: { [questionIndex]: 1..5 }
  score(answers) {
    const T = window.UDXZ_TRIAGE;
    const dimScores = {};
    T.dims.forEach((d) => (dimScores[d.id] = { sum: 0, n: 0 }));
    let totalSum = 0, totalN = 0;
    T.questions.forEach((item, i) => {
      const v = Number(answers[i]);
      if (!v) return;
      dimScores[item.dim].sum += v;
      dimScores[item.dim].n += 1;
      totalSum += v;
      totalN += 1;
    });
    const dimResult = T.dims.map((d) => {
      const ds = dimScores[d.id];
      const rate = ds.n ? Math.round((ds.sum / (ds.n * 5)) * 100) : 0;
      return { id: d.id, name: d.name, icon: d.icon, rate };
    });
    const overall = totalN ? Math.round((totalSum / (totalN * 5)) * 100) : 0;
    const weak = dimResult
      .filter((d) => d.rate < 70)
      .sort((a, b) => a.rate - b.rate)
      .map((d) => d.name);
    return { overall, dims: dimResult, weak };
  },
};
