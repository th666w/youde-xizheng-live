/* 优德习正 · 习惯与学习力深度初筛（扫码即用）
 * 设计原则：「隐晦测评」——不问"你自不自律"，而是聊孩子熟悉的游戏/生活场景，
 *   从他的真实选择里自然读出内驱力、思维模式、规则意识等底层特质。
 *   → 孩子答着像聊天，不觉得在被评判；老师看到的却是清晰的维度画像。
 * 10 个核心维度各 1 题 = 10 题，每题 5 个选项（v = 5..1，越高=状态越好）。
 * 维度对照框架：内动力 / 思维模式·思考 / 规则意识 / 自驱方式 /
 *   兴趣与奖励 / 自我意识 / 性格与动手 / 家庭联结 / 理解·记忆·听课 / 数学状态
 * tag = 给孩子看的中性场景标签（不暴露专业维度名，降低防备心）
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
  questions: [
    {
      dim: "nei", tag: "🎮 什么让你入迷",
      q: "有没有一件事，你做着做着就忘了时间？",
      opts: [
        { label: "有，我还给自己定了小目标", desc: "比如上到某个段位、学会一样本领", v: 5 },
        { label: "有，虽然没定目标", desc: "但一做起来就很投入", v: 4 },
        { label: "有，但多半是和朋友一起", desc: "自己一个人的话容易腻", v: 3 },
        { label: "好像没有", desc: "基本是大人安排我做什么就做什么", v: 2 },
        { label: "没有", desc: "做什么都提不起劲", v: 1 },
      ],
    },
    {
      dim: "think", tag: "🧩 你的玩法偏好",
      q: "玩游戏（或者搭积木、下棋、做手工）的时候，你更喜欢哪种玩法？",
      opts: [
        { label: "竞技 / 闯关类", desc: "喜欢研究策略，琢磨怎么一步步打上去", v: 5 },
        { label: "设计 / 创造类", desc: "地图、造型、规则我自己来定", v: 4 },
        { label: "收集 / 养成类", desc: "喜欢慢慢攒，看着东西越来越多", v: 3 },
        { label: "跟着别人玩", desc: "别人怎么玩我就怎么玩", v: 2 },
        { label: "随便玩玩", desc: "没仔细想过这些", v: 1 },
      ],
    },
    {
      dim: "rule", tag: "⚖️ 游戏里的规矩",
      q: "游戏里（或者和同学一起玩的时候）有人开挂、耍赖、不守规矩，你心里更接近哪种想法？",
      opts: [
        { label: "这样赢了也没意思", desc: "按规则赢才算真本事", v: 5 },
        { label: "会提醒他一下", desc: "但不怎么影响我继续玩", v: 4 },
        { label: "有点烦，但懒得管", desc: "自己玩自己的就好", v: 3 },
        { label: "无所谓", desc: "大家都这样我也跟着", v: 2 },
        { label: "规则就是拿来打破的", desc: "能赢就行", v: 1 },
      ],
    },
    {
      dim: "drive", tag: "🚀 卡关时刻",
      q: "游戏里有个很难的关卡，一直打不过去，你通常会怎么做？",
      opts: [
        { label: "自己研究打法", desc: "多试几次，非要打过去", v: 5 },
        { label: "去查攻略学技巧", desc: "学会了再回来接着打", v: 4 },
        { label: "先放一放", desc: "过几天有心情了再试试", v: 3 },
        { label: "找厉害的人帮我过", desc: "自己打太费劲", v: 2 },
        { label: "直接放弃", desc: "换个简单的玩", v: 1 },
      ],
    },
    {
      dim: "interest", tag: "🎁 努力的回报",
      q: "如果努力做成了某件事（比如考好了、学会一样本领），你最想要什么？",
      opts: [
        { label: "做成这件事本身就够爽了", desc: "不太需要额外奖励", v: 5 },
        { label: "想去一个地方玩", desc: "或者做一件一直想做的事", v: 4 },
        { label: "想要喜欢的东西", desc: "皮肤、装备、玩具都行", v: 3 },
        { label: "想多玩一会儿", desc: "多给点玩游戏、刷视频的时间", v: 2 },
        { label: "没想过", desc: "爸妈给什么算什么", v: 1 },
      ],
    },
    {
      dim: "self", tag: "🪞 犯错时刻",
      q: "如果做错了一件事（比如偷偷多玩了会儿被发现），你心里的第一反应更接近哪种？",
      opts: [
        { label: "会想「我当时为什么这么做」", desc: "大致能说出原因", v: 5 },
        { label: "有点后悔", desc: "知道自己哪儿做得不对", v: 4 },
        { label: "先怕被骂", desc: "想着怎么别被发现", v: 3 },
        { label: "觉得没什么大不了", desc: "不用太当回事", v: 2 },
        { label: "说不清楚", desc: "不太想这些", v: 1 },
      ],
    },
    {
      dim: "char", tag: "🤲 学新东西",
      q: "学一样新东西（一道菜、一个手工、一种新玩法），你的第一反应是？",
      opts: [
        { label: "直接上手试", desc: "边做边学，做错了再改", v: 5 },
        { label: "先看别人怎么做", desc: "看懂了自己再动手", v: 4 },
        { label: "要先问清每一步", desc: "确认好了才敢开始", v: 3 },
        { label: "得有人带着一起做", desc: "自己一个人不敢下手", v: 2 },
        { label: "怕做不好", desc: "不太想试", v: 1 },
      ],
    },
    {
      dim: "family", tag: "🏠 关于爸妈",
      q: "关于爸爸妈妈，下面哪句最像你？",
      opts: [
        { label: "我知道他们挺辛苦的", desc: "也记得他们的生日", v: 5 },
        { label: "知道他们辛苦", desc: "只是不太会表达出来", v: 4 },
        { label: "平时没太注意这些", desc: "但他们对我挺好的", v: 3 },
        { label: "他们管我比较多", desc: "我不太想这些", v: 2 },
        { label: "说不清楚", desc: "没认真想过这个问题", v: 1 },
      ],
    },
    {
      dim: "comp", tag: "📖 长段文字",
      q: "游戏里一段很长的剧情或规则说明（或者课本上一段很长的文章），你会怎么处理？",
      opts: [
        { label: "会看完，还能讲出重点", desc: "看完能理清楚，讲给别人听", v: 5 },
        { label: "看的时候能懂", desc: "但要我复述就有点乱", v: 4 },
        { label: "太长了我直接跳过", desc: "边玩边摸索就行", v: 3 },
        { label: "看不进去", desc: "得别人讲给我听", v: 2 },
        { label: "一看长段文字就烦", desc: "根本读不下去", v: 1 },
      ],
    },
    {
      dim: "math", tag: "➗ 遇到难题",
      q: "遇到一道看着就不会的数学题，你的第一反应是？",
      opts: [
        { label: "想再看看，换个方法试试", desc: "多试几种思路", v: 5 },
        { label: "类似的题我会做", desc: "就是这道卡住了，愿意再想想", v: 4 },
        { label: "看着就烦", desc: "不太想动笔", v: 3 },
        { label: "觉得自己数学就是不行", desc: "算了，不做了", v: 2 },
        { label: "直接等老师讲", desc: "或者看看答案怎么写", v: 1 },
      ],
    },
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
