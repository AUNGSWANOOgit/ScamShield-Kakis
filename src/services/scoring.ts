/**
 * CENTRAL SCORING RULES — edit values here to change the whole points economy.
 *
 * One-time activities (never re-awarded):
 *  - Completing a lesson for the first time
 *  - Each lesson quiz question answered correctly in the first completed attempt
 *  - Each Identify scenario, scored on the FIRST answer only
 *
 * Repeatable activities (with reset conditions):
 *  - Daily challenge: once per calendar day (local time, resets at midnight)
 *  - Weekly group challenges: each once per week (resets Monday 00:00 local time)
 *
 * Demo reports never earn points (content is unverified).
 */
export const POINTS = {
  LESSON_COMPLETE: 20,
  QUIZ_CORRECT: 10,
  SCENARIO_SAFE: 10,
  SCENARIO_OKAY: 5,
  SCENARIO_UNSAFE: 0,
  DAILY_CHALLENGE: 30,
  WEEKLY_CHALLENGE: 50,
} as const;

export const STICKER_THRESHOLDS = {
  RISING_STAR_POINTS: 100,
  GOLDEN_GUARDIAN_POINTS: 300,
  SCAM_SPOTTER_SAFE_ANSWERS: 5,
  QUIZ_MASTER_CORRECT: 8,
  COMMUNITY_HERO_CONTRIBUTION: 200,
} as const;

export function scenarioPoints(rating: 'safe' | 'okay' | 'unsafe'): number {
  if (rating === 'safe') return POINTS.SCENARIO_SAFE;
  if (rating === 'okay') return POINTS.SCENARIO_OKAY;
  return POINTS.SCENARIO_UNSAFE;
}
