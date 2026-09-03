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
    { dim: "nei", q: "孩子写作业、做事，常常是自己想做完、想做好，而不是非得家长在旁边盯着才动" },
    { dim: "think", q: "碰到不会的题，孩子会先自己琢磨「为什么、怎么解」，而不是直接翻答案或喊家长讲" },
    { dim: "rule", q: "定好的规矩（如几点睡、少看手机），孩子基本能遵守，不会反复讨价还价" },
    { dim: "drive", q: "没人提醒时，孩子也能自己把当天的学习安排下去并做完" },
    { dim: "interest", q: "孩子有真正喜欢、肯花时间的爱好，家里也有「做到了就奖励」的明确办法" },
    { dim: "self", q: "孩子能说清自己当下什么感受、想要什么、为什么想做或不想做某件事" },
    { dim: "char", q: "孩子愿意动手试（实验/手工/演算），不怕「做中学」，不只会听和看" },
    { dim: "family", q: "孩子懂父母的辛苦、记得父母生日，心里把爸妈放在重要位置" },
    { dim: "comp", q: "较长的句子或段落孩子能读懂并记住要点，上课能跟住老师讲的内容" },
    { dim: "math", q: "孩子对数学不反感，能听懂、会做基础题，卡住了也愿意自己再想想" },
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
