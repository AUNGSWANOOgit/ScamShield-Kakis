import type { AppState } from '../types';
import { DAILY_STICKER_ORDER } from '../data/stickers';
import { GROUPS } from '../data/community';
import { STICKER_THRESHOLDS as T } from './scoring';
import { groupContribution, lessonsCompleted, quizStats, totalPoints, userHelpedMilestone } from './selectors';

type Rule = (s: AppState, now: Date) => boolean;

const dailyCount = (s: AppState) => Object.keys(s.dailyChallenges).length;
const anyWeeklyDone = (s: AppState) => Object.values(s.weeklyChallenges).some((w) => Object.keys(w).length > 0);
const safeFirstAnswers = (s: AppState) => Object.values(s.scenarios).filter((x) => x.firstRating === 'safe').length;

/** Unlock rule for every sticker id. Keep in sync with data/stickers.ts `criteria` text. */
export const STICKER_RULES: Record<string, Rule> = {
  // Daily greetings unlock in order, one per completed daily challenge.
  ...Object.fromEntries(DAILY_STICKER_ORDER.map((id, i) => [id, (s: AppState) => dailyCount(s) >= i + 1])),

  'deepfake-detective': (s) => Boolean(s.lessons['what-is-deepfake']?.completed),
  'scam-spotter': (s) => safeFirstAnswers(s) >= T.SCAM_SPOTTER_SAFE_ANSWERS,
  'quiz-master': (s) => quizStats(s).correct >= T.QUIZ_MASTER_CORRECT,
  'digital-safety-champion': (s) => lessonsCompleted(s) >= 3,
  'rising-star': (s) => totalPoints(s) >= T.RISING_STAR_POINTS,
  'golden-guardian': (s) => totalPoints(s) >= T.GOLDEN_GUARDIAN_POINTS,

  'community-hero': (s) => GROUPS.some((g) => groupContribution(s, g.id) >= T.COMMUNITY_HERO_CONTRIBUTION),
  'team-champion': (s) => GROUPS.some((g) => userHelpedMilestone(s, g.id)),
  'weekly-mission': (s) => anyWeeklyDone(s),
  'friendly-inviter': (s) => s.community.invites.length > 0,
};
