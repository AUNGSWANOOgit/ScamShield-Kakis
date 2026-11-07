import type { CommunityGroup } from '../types';

/**
 * MOCK community data. All groups and members are fictional demo profiles.
 * Base totals represent other (mock) members' contributions; the local user's
 * contribution is added on top from their real points ledger.
 */
export const GROUPS: CommunityGroup[] = [
  {
    id: 'tampines',
    name: 'Tampines Digital Champions',
    area: 'Tampines',
    description: 'Friendly learners who meet after morning taiji to share scam alerts and tips.',
    color: '#159f90',
    baseTotalPoints: 1780,
    baseWeeklyPoints: 60,
    milestones: [500, 1000, 1500, 2000, 2500, 3000, 4000],
    meetingNote: 'Mock meet-up: Saturdays 9am, Tampines Hub (demo only)',
    members: [
      { name: 'Uncle Ah Seng', avatarId: 'uncle', weeklyPoints: 20, role: 'Group Leader' },
      { name: 'Madam Rosnah', avatarId: 'flower', weeklyPoints: 20 },
      { name: 'Mr Kumar', avatarId: 'glasses', weeklyPoints: 10 },
      { name: 'Auntie Lily', avatarId: 'auntie', weeklyPoints: 10 },
      { name: 'Mr Tan', avatarId: 'cap', weeklyPoints: 0 },
    ],
  },
  {
    id: 'jurong',
    name: 'Jurong Scam Busters',
    area: 'Jurong',
    description: 'Retired teachers and neighbours who love quizzes and friendly challenges.',
    color: '#f98508',
    baseTotalPoints: 2140,
    baseWeeklyPoints: 90,
    milestones: [500, 1000, 1500, 2000, 2500, 3000, 4000],
    meetingNote: 'Mock meet-up: Wednesdays 3pm, Jurong West CC (demo only)',
    members: [
      { name: 'Teacher Wong', avatarId: 'glasses', weeklyPoints: 40, role: 'Group Leader' },
      { name: 'Auntie Siew Lan', avatarId: 'auntie', weeklyPoints: 30 },
      { name: 'Mr Ravi', avatarId: 'cap', weeklyPoints: 20 },
      { name: 'Madam Fatimah', avatarId: 'flower', weeklyPoints: 0 },
    ],
  },
  {
    id: 'bedok',
    name: 'Bedok Cyber Buddies',
    area: 'Bedok',
    description: 'A cosy group for beginners. Learn at your own pace with buddy support.',
    color: '#4c74bd',
    baseTotalPoints: 1320,
    baseWeeklyPoints: 40,
    milestones: [500, 1000, 1500, 2000, 2500, 3000, 4000],
    meetingNote: 'Mock meet-up: Fridays 10am, Bedok Library (demo only)',
    members: [
      { name: 'Auntie Mei', avatarId: 'flower', weeklyPoints: 20, role: 'Buddy Leader' },
      { name: 'Uncle Bala', avatarId: 'uncle', weeklyPoints: 10 },
      { name: 'Mr Lim', avatarId: 'cap', weeklyPoints: 10 },
    ],
  },
];

export const getGroup = (id: string | null | undefined) => GROUPS.find((g) => g.id === id);

export interface WeeklyChallengeDef {
  id: string;
  title: string;
  description: string;
  target: number;
  unit: string;
}

/** Weekly group challenges. Reset every Monday (local time). +50 points each, once per week. */
export const WEEKLY_CHALLENGES: WeeklyChallengeDef[] = [
  { id: 'wk-lessons', title: 'Complete 3 lessons', description: 'Finish any 3 lessons this week (replays count).', target: 3, unit: 'lessons' },
  { id: 'wk-identify', title: 'Answer 5 Identify questions', description: 'Practise 5 Identify & Decide challenges this week.', target: 5, unit: 'answers' },
  { id: 'wk-group-points', title: 'Earn 250 points together', description: 'Your group’s combined points this week (members’ points are mock data).', target: 250, unit: 'points' },
  { id: 'wk-milestone', title: 'Help unlock a group milestone', description: 'Help your group reach its next points milestone and unlock the Team Champion sticker.', target: 1, unit: 'milestone' },
];

/** Fictional friend names used for simulated referrals. */
export const MOCK_FRIEND_NAMES = ['Auntie Rose', 'Uncle Kok Wah', 'Madam Siti', 'Mr Gopal', 'Auntie Hui Min', 'Uncle Jamal'];
