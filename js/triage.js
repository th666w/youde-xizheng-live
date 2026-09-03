/* 优德习正 · 习惯与学习力深度初筛（扫码即用）
 * 10 个核心维度各 1 题 = 10 题，每题 5 档。正向计分：越高=状态越好。
 * 整体分与各维度分用百分比表示（rate = 平均得分 / 5 × 100）。
 * 薄弱维度：rate < 70% 视为需重点关注。
 * 维度对照用户评估框架：内动力 / 思维模式·思考 / 规则意识 / 自驱方式 /
 *   兴趣与奖励 / 自我意识 / 性格与动手 / 家庭联结 / 理解·记忆·听课 / 数学状态
 */
window.UDXZ_TRIAGE = {
  dims: [
    { id: "nei", name: "内动力", icon: "🔋" },
    { id: "think", name: "思维模式·思考", icon: "🧠" },
    { id: "rule", name: "规则意识", icon: "📏" },
    { id: "drive", name: "自驱方式", icon: "🚀" },
    { id: "interest", name: "兴趣与奖励", icon: "🎯" },
    { id: "self", name: "自我意识", icon: "🪞" },
    { id: "char", name: "性格与动手", icon: "🤲" },
    { id: "family", name: "家庭联结", icon: "🏠" },
    { id: "comp", name: "理解·记忆·听课", icon: "📖" },
    { id: "math", name: "数学状态", icon: "➗" },
  ],
  options: [
    { v: 5, label: "总是" },
    { v: 4, label: "经常" },
    { v: 3, label: "有时" },
    { v: 2, label: "很少" },
    { v: 1, label: "从不" },
  ],
  questions: [
    { dim: "nei", q: "孩子做事情，更多是出于自己想做，而不是被催着、逼着才动" },
    { dim: "think", q: "遇到问题时，孩子习惯先自己想「为什么、怎么办」，而不是直接要答案" },
    { dim: "rule", q: "孩子能遵守家里的约定（作息、屏幕时间、家规），较少讨价还价或破坏规则" },
    { dim: "drive", q: "没有家长提醒时，孩子也能自己安排并推进学习" },
    { dim: "interest", q: "孩子有真正投入的兴趣爱好，且家里用合理的奖励制度鼓励坚持" },
    { dim: "self", q: "孩子能清楚说出自己的感受、想要什么、以及做一件事的原因" },
    { dim: "char", q: "孩子愿意动手实践、尝试新事物，不排斥「做中学」（而非只看不练）" },
    { dim: "family", q: "孩子了解并亲近父母（知道父母辛苦、生日，心里有父母的位置）" },
    { dim: "comp", q: "孩子能读懂较长的文字、抓住要点并记住，听课能跟住节奏" },
    { dim: "math", q: "孩子对数学不抵触，能听懂会做，遇到不会的愿意想办法" },
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
