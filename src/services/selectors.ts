import type { AppState, CommunityGroup, DemoReport, ReportStatus } from '../types';
import { LESSONS } from '../data/lessons';
import { SCENARIOS } from '../data/scenarios';
import { GROUPS, WEEKLY_CHALLENGES, getGroup } from '../data/community';
import { calendarDaysBetween, dateKey, isSameDay, isSameWeek, weekKey, addDays } from '../utils/time';

/** All statistics are DERIVED from the stored ledger/activity, so every screen stays consistent. */

export const totalPoints = (s: AppState) => s.ledger.reduce((sum, e) => sum + e.amount, 0);

export const weeklyPoints = (s: AppState, now: Date) =>
  s.ledger.filter((e) => isSameWeek(new Date(e.at), now)).reduce((sum, e) => sum + e.amount, 0);

export const groupContribution = (s: AppState, groupId: string) =>
  s.ledger.filter((e) => e.groupId === groupId).reduce((sum, e) => sum + e.amount, 0);

export const groupWeeklyContribution = (s: AppState, groupId: string, now: Date) =>
  s.ledger
    .filter((e) => e.groupId === groupId && isSameWeek(new Date(e.at), now))
    .reduce((sum, e) => sum + e.amount, 0);

export const groupTotal = (s: AppState, g: CommunityGroup) => g.baseTotalPoints + groupContribution(s, g.id);

export const groupWeeklyTotal = (s: AppState, g: CommunityGroup, now: Date) =>
  g.baseWeeklyPoints + groupWeeklyContribution(s, g.id, now);

export function milestoneInfo(total: number, milestones: number[]) {
  const next = milestones.find((m) => m > total) ?? null;
  const prevCandidates = milestones.filter((m) => m <= total);
  const prev = prevCandidates.length ? prevCandidates[prevCandidates.length - 1] : 0;
  const pct = next ? Math.round(((total - prev) / (next - prev)) * 100) : 100;
  return { next, prev, pct, remaining: next ? next - total : 0, reachedCount: prevCandidates.length };
}

/** Did the user's contributions push their group past a milestone it had not reached from mock points alone? */
export function userHelpedMilestone(s: AppState, groupId: string, onlyThisWeek?: Date): boolean {
  const g = getGroup(groupId);
  if (!g) return false;
  const total = groupContribution(s, groupId);
  if (total <= 0) return false;
  const before = onlyThisWeek
    ? g.baseTotalPoints + total - groupWeeklyContribution(s, groupId, onlyThisWeek)
    : g.baseTotalPoints;
  const after = g.baseTotalPoints + total;
  return g.milestones.some((m) => m > before && m <= after);
}

export const leaderboard = (s: AppState) =>
  GROUPS.map((g) => ({ group: g, total: groupTotal(s, g) })).sort((a, b) => b.total - a.total);

export const lessonsCompleted = (s: AppState) => LESSONS.filter((l) => s.lessons[l.id]?.completed).length;

export const nextLesson = (s: AppState) => LESSONS.find((l) => !s.lessons[l.id]?.completed) ?? null;

export function quizStats(s: AppState) {
  let answered = 0;
  let correct = 0;
  for (const l of LESSONS) {
    const p = s.lessons[l.id];
    if (!p?.completed) continue;
    for (const v of Object.values(p.firstAttempt)) {
      answered += 1;
      if (v) correct += 1;
    }
  }
  return { answered, correct, accuracy: answered ? Math.round((correct / answered) * 100) : 0 };
}

export function scenarioStats(s: AppState) {
  const entries = Object.values(s.scenarios);
  const safe = entries.filter((e) => e.firstRating === 'safe').length;
  const okay = entries.filter((e) => e.firstRating === 'okay').length;
  const unsafe = entries.filter((e) => e.firstRating === 'unsafe').length;
  return { tried: entries.length, total: SCENARIOS.length, safe, okay, unsafe };
}

export function dailyStatus(s: AppState, now: Date) {
  const today = s.activity.filter((a) => isSameDay(new Date(a.at), now));
  const lessonDone = today.some((a) => a.type === 'lesson');
  const scenarioDone = today.some((a) => a.type === 'scenario');
  const completed = Boolean(s.dailyChallenges[dateKey(now)]);
  return { lessonDone, scenarioDone, completed, totalCompleted: Object.keys(s.dailyChallenges).length };
}

export function weeklyProgress(s: AppState, now: Date) {
  const groupId = s.community.groupId;
  const g = getGroup(groupId);
  const thisWeek = s.activity.filter((a) => isSameWeek(new Date(a.at), now));
  const done = s.weeklyChallenges[weekKey(now)] ?? {};
  return WEEKLY_CHALLENGES.map((c) => {
    let current = 0;
    if (c.id === 'wk-lessons') current = thisWeek.filter((a) => a.type === 'lesson').length;
    if (c.id === 'wk-identify') current = thisWeek.filter((a) => a.type === 'scenario').length;
    if (c.id === 'wk-group-points') current = g ? groupWeeklyTotal(s, g, now) : 0;
    if (c.id === 'wk-milestone') current = groupId && userHelpedMilestone(s, groupId, now) ? 1 : 0;
    const clamped = Math.min(current, c.target);
    return {
      ...c,
      current: clamped,
      rawCurrent: current,
      reached: current >= c.target,
      completedAt: done[c.id] as string | undefined,
      pct: Math.round((clamped / c.target) * 100),
    };
  });
}

/** Consecutive days (ending today, or yesterday if nothing yet today) with any learning activity. */
export function streak(s: AppState, now: Date): number {
  const days = new Set(s.activity.map((a) => dateKey(new Date(a.at))));
  let cursor = now;
  if (!days.has(dateKey(cursor))) {
    cursor = addDays(now, -1);
    if (!days.has(dateKey(cursor))) return 0;
  }
  let count = 0;
  while (days.has(dateKey(cursor))) {
    count += 1;
    cursor = addDays(cursor, -1);
  }
  return count;
}

/** Points earned per day for the last N days (oldest first). */
export function pointsByDay(s: AppState, now: Date, days = 7) {
  const out: { date: Date; points: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = addDays(now, -i);
    const pts = s.ledger.filter((e) => isSameDay(new Date(e.at), d)).reduce((sum, e) => sum + e.amount, 0);
    out.push({ date: d, points: pts });
  }
  return out;
}

/** Simulated review workflow: Submitted → Under Review (after 1 min) → Reviewed (after 3 min), or presenter override. */
export function reportStatus(r: DemoReport, now: Date): ReportStatus {
  if (r.manualStatus) return r.manualStatus;
  const mins = (now.getTime() - new Date(r.submittedAt).getTime()) / 60000;
  if (mins >= 3) return 'Reviewed';
  if (mins >= 1) return 'Under Review';
  return 'Submitted';
}

export const daysSinceJoined = (s: AppState, now: Date) =>
  s.community.joinedAt ? calendarDaysBetween(new Date(s.community.joinedAt), now) : 0;
