import type { StickerDef } from '../types';

/**
 * Sticker catalogue — greeting-image style (big blossom, bokeh, bilingual text, a safety tip, a blessing).
 * Artwork is generated locally as SVG (see utils/stickerArt.ts), so every sticker is original and exportable as PNG.
 * Unlock rules live in services/stickerRules.ts.
 */
export const STICKERS: StickerDef[] = [
  // ---------------- Daily Greetings ----------------
  {
    id: 'good-morning-monday',
    name: 'Good Morning Monday',
    collection: 'daily',
    rarity: 'Common',
    criteria: 'Complete your 1st daily challenge',
    howEarned: 'You completed a daily challenge — a lesson plus an Identify question in one day!',
    greeting: 'Good Morning Monday! Wishing you a bright and safe week ahead ☀️ Stay sharp, stay safe!',
    design: { flower: 'sunflower', scene: 'sunrise', bokeh: ['#ffb347', '#ff7b54', '#fff3bf', '#ffd43b', '#ffa94d', '#ffffff'], zhTitle: '星期一早安', enScript: 'Good Morning Monday', zhWish: '新的一周 平安喜乐', tip: 'Pause & check before you pay', blessing: 'Stay Safe 🙏' },
  },
  {
    id: 'happy-tuesday',
    name: 'Happy Tuesday',
    collection: 'daily',
    rarity: 'Common',
    criteria: 'Complete 2 daily challenges',
    howEarned: 'Two daily challenges done — you are building a great habit!',
    greeting: 'Happy Tuesday! Enjoy your kopi and have a wonderful day ☕',
    design: { flower: 'rose', scene: 'kopi', bokeh: ['#ffd8a8', '#d9480f', '#fff4e6', '#ffc078', '#ff8787', '#ffffff'], zhTitle: '星期二快乐', enScript: 'Happy Tuesday', zhWish: '喝杯咖啡 开心每一天', tip: 'Never share your OTP with anyone', blessing: 'Have a Nice Day ☕' },
  },
  {
    id: 'wonderful-wednesday',
    name: 'Wonderful Wednesday',
    collection: 'daily',
    rarity: 'Common',
    criteria: 'Complete 3 daily challenges',
    howEarned: 'Three daily challenges — halfway through the greetings collection!',
    greeting: 'Wonderful Wednesday! May your day bloom with joy 🌸',
    design: { flower: 'peony', bokeh: ['#f783ac', '#862e9c', '#fcc2d7', '#ffdeeb', '#e599f7', '#ffffff'], zhTitle: '星期三愉快', enScript: 'Wonderful Wednesday', zhWish: '花开富贵 幸福满满', tip: 'Unsure? Ask family before you act', blessing: 'Be Happy 🌸' },
  },
  {
    id: 'thankful-thursday',
    name: 'Thankful Thursday',
    collection: 'daily',
    rarity: 'Rare',
    criteria: 'Complete 4 daily challenges',
    howEarned: 'Four daily challenges completed. Thank you for staying sharp!',
    greeting: 'Thankful Thursday! Grateful for friends and family like you ❤️',
    design: { flower: 'orchid', bokeh: ['#b197fc', '#5f3dc4', '#e5dbff', '#f3d9fa', '#ffc9de', '#ffffff'], zhTitle: '感恩星期四', enScript: 'Thankful Thursday', zhWish: '感恩有你 一路同行', tip: 'Not sure if it\'s a scam? Call 1799', blessing: 'Thank You 🙏' },
  },
  {
    id: 'happy-friday',
    name: 'Happy Friday',
    collection: 'daily',
    rarity: 'Rare',
    criteria: 'Complete 5 daily challenges',
    howEarned: 'Five daily challenges — what a week of learning!',
    greeting: 'Happy Friday! The weekend is almost here 🎉',
    design: { flower: 'hibiscus', bokeh: ['#74c0fc', '#1864ab', '#ffd43b', '#ff8787', '#a5d8ff', '#ffffff'], zhTitle: '星期五快乐', enScript: 'Happy Friday', zhWish: '周末快到了 开开心心', tip: 'Too good to be true? Probably a scam', blessing: 'Cheers! 🎉' },
  },
  {
    id: 'blessed-weekend',
    name: 'Have a Blessed Weekend',
    collection: 'daily',
    rarity: 'Epic',
    criteria: 'Complete 6 daily challenges',
    howEarned: 'Six daily challenges — you completed the whole greetings collection!',
    greeting: 'Have a blessed weekend! Rest well and enjoy time with your loved ones 🌿',
    design: { flower: 'lotus', scene: 'sunrise', bokeh: ['#ffc078', '#5c7cfa', '#fff3bf', '#ffd8a8', '#bac8ff', '#ffffff'], zhTitle: '周末愉快', enScript: 'Have a Blessed Weekend', zhWish: '身体健康 平安吉祥', tip: 'Rest well & stay safe online', blessing: 'Blessings 🙏' },
  },

  // ---------------- Achievements ----------------
  {
    id: 'deepfake-detective',
    name: 'Deepfake Detective',
    collection: 'achievement',
    rarity: 'Common',
    criteria: 'Complete Lesson 1: What Is a Deepfake?',
    howEarned: 'You learned what deepfakes are and why convincing content still needs checking.',
    greeting: 'I just became a Deepfake Detective! 🔍 Remember: pause and check before you trust or share.',
    design: { flower: 'plum', bokeh: ['#e8a0b4', '#5c3d46', '#ffc9de', '#ffdeeb', '#b2f2bb', '#ffffff'], zhTitle: '防骗小侦探', enScript: 'Deepfake Detective', zhWish: '先停一停 再核实', tip: 'A familiar face or voice can be faked', blessing: 'Well Done! 👍' },
  },
  {
    id: 'scam-spotter',
    name: 'Scam Spotter',
    collection: 'achievement',
    rarity: 'Rare',
    criteria: 'Choose the safest action in 5 Identify challenges (first try)',
    howEarned: 'You made 5 safe decisions in the Identify challenges.',
    greeting: 'I’m a certified Scam Spotter! 🚨 When in doubt, call 1799 to check.',
    design: { flower: 'chrysanthemum', bokeh: ['#4dabf7', '#0b3954', '#ffe066', '#a5d8ff', '#ffd43b', '#ffffff'], zhTitle: '识骗高手', enScript: 'Scam Spotter', zhWish: '不贪心 不慌张', tip: 'Stop. Check. Stay safe.', blessing: 'Bravo! 👏' },
  },
  {
    id: 'quiz-master',
    name: 'Quiz Master',
    collection: 'achievement',
    rarity: 'Epic',
    criteria: 'Answer 8 lesson quiz questions correctly on the first try',
    howEarned: 'You answered 8 quiz questions correctly on your first try. Brilliant!',
    greeting: 'Quiz Master unlocked! 🎓 Learning about online safety is fun!',
    design: { flower: 'rose', bokeh: ['#ffa8a8', '#5f0f40', '#ffc9c9', '#fcc2d7', '#ffe066', '#ffffff'], zhTitle: '答题达人', enScript: 'Quiz Master', zhWish: '活到老 学到老', tip: 'Never too old to learn something new', blessing: 'Excellent! ⭐' },
  },
  {
    id: 'digital-safety-champion',
    name: 'Digital Safety Champion',
    collection: 'achievement',
    rarity: 'Epic',
    criteria: 'Complete all 3 lessons',
    howEarned: 'You completed every lesson. You are a Digital Safety Champion!',
    greeting: 'I’m a Digital Safety Champion! 🏆 Let’s all stay sharp and safe online together.',
    design: { flower: 'peony', bokeh: ['#ff8787', '#7a0b0b', '#ffd43b', '#ffc9c9', '#ffa94d', '#ffffff'], zhTitle: '网络安全冠军', enScript: 'Digital Safety Champion', zhWish: '保护自己 保护家人', tip: 'Learn. Protect. Share.', blessing: 'Champion! 🏆' },
  },
  {
    id: 'rising-star',
    name: 'Rising Star',
    collection: 'achievement',
    rarity: 'Common',
    criteria: 'Earn 100 points',
    howEarned: 'You reached 100 points by learning and practising!',
    greeting: 'Rising Star! ⭐ Every bit of learning keeps us safer online.',
    design: { flower: 'daisy', bokeh: ['#4dabf7', '#1c3d7a', '#d0ebff', '#ffe066', '#a5d8ff', '#ffffff'], zhTitle: '新星闪耀', enScript: 'Rising Star', zhWish: '一百分 继续加油', tip: '100 points of safer habits', blessing: 'Keep Going! 💪' },
  },
  {
    id: 'golden-guardian',
    name: 'Golden Guardian',
    collection: 'achievement',
    rarity: 'Epic',
    criteria: 'Earn 300 points',
    howEarned: 'You reached 300 points — a true guardian of online safety!',
    greeting: 'Golden Guardian unlocked! 🛡️ Proud to protect my friends and family online.',
    design: { flower: 'chrysanthemum', bokeh: ['#ffd43b', '#7c2d12', '#fff3bf', '#ffc078', '#ffe066', '#ffffff'], zhTitle: '金牌守护者', enScript: 'Golden Guardian', zhWish: '三百分 了不起', tip: '300 points of courage', blessing: 'Amazing! 🌟' },
  },

  // ---------------- Community ----------------
  {
    id: 'community-hero',
    name: 'Community Hero',
    collection: 'community',
    rarity: 'Rare',
    criteria: 'Contribute 200 points to your community group',
    howEarned: 'Your learning added 200 points to your community group. Thank you, hero!',
    greeting: 'Community Hero! 🦸 Together we keep our neighbourhood safe from scams.',
    design: { flower: 'orchid', scene: 'garden', bokeh: ['#63e6be', '#0b5c4f', '#c3fae8', '#e5dbff', '#ffd43b', '#ffffff'], zhTitle: '社区英雄', enScript: 'Community Hero', zhWish: '邻里同心 一起防骗', tip: 'Stronger together against scams', blessing: 'Thank You 🙏' },
  },
  {
    id: 'team-champion',
    name: 'Team Champion',
    collection: 'community',
    rarity: 'Epic',
    criteria: 'Help your group reach its next milestone',
    howEarned: 'Your group reached a new milestone — and your points helped make it happen!',
    greeting: 'Our team reached a new milestone! 🎊 Thank you, everyone!',
    design: { flower: 'peony', bokeh: ['#ffc078', '#a61e4d', '#ffd43b', '#ffdeeb', '#ff8787', '#ffffff'], zhTitle: '团队冠军', enScript: 'Team Champion', zhWish: '齐心协力 再创佳绩', tip: 'Our group reached a milestone!', blessing: 'Congrats! 🎊' },
  },
  {
    id: 'weekly-mission',
    name: 'Weekly Mission Completed',
    collection: 'community',
    rarity: 'Rare',
    criteria: 'Complete any weekly group challenge',
    howEarned: 'You completed a weekly group challenge!',
    greeting: 'Weekly Mission Completed! ✅ Learning together every week.',
    design: { flower: 'sunflower', bokeh: ['#69db7c', '#1b4332', '#ffe066', '#d8f5a2', '#ffd43b', '#ffffff'], zhTitle: '本周任务完成', enScript: 'Weekly Mission Completed', zhWish: '每周学习 天天安全', tip: 'Learning together every week', blessing: 'Good Job! 👍' },
  },
  {
    id: 'friendly-inviter',
    name: 'Friendly Inviter',
    collection: 'community',
    rarity: 'Common',
    criteria: 'Invite a friend with your referral code (simulated)',
    howEarned: 'You invited a friend to learn with you (simulated invitation).',
    greeting: 'Come learn with me! 💌 Let’s stay sharp and safe online together.',
    design: { flower: 'rose', bokeh: ['#fcc2d7', '#a61e4d', '#fff0f6', '#ffdeeb', '#ffe066', '#ffffff'], zhTitle: '邀请好友', enScript: 'Friendly Inviter', zhWish: '好朋友 一起学', tip: 'Learning is better together', blessing: 'Join Me! 💌' },
  },
];

export const getSticker = (id: string) => STICKERS.find((s) => s.id === id);

export const COLLECTION_LABELS: Record<string, string> = {
  daily: 'Daily Greetings',
  achievement: 'Achievements',
  community: 'Community',
};

/** The order daily greeting stickers unlock in (one per completed daily challenge). */
export const DAILY_STICKER_ORDER = [
  'good-morning-monday',
  'happy-tuesday',
  'wonderful-wednesday',
  'thankful-thursday',
  'happy-friday',
  'blessed-weekend',
];
