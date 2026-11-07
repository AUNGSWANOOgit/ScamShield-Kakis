import type { AppState, ChoiceRating, PointsReason, Profile, Verdict } from '../types';
import { getLesson } from '../data/lessons';
import { getScenario } from '../data/scenarios';
import { MOCK_FRIEND_NAMES, WEEKLY_CHALLENGES, getGroup } from '../data/community';
import { STICKERS } from '../data/stickers';
import { POINTS, scenarioPoints } from './scoring';
import { STICKER_RULES } from './stickerRules';
import { dailyStatus, totalPoints, weeklyProgress } from './selectors';
import { addDays, dateKey, uid, weekKey } from '../utils/time';

/**
 * GAME ENGINE — pure functions: (state, input, now) => { state, events }.
 * UI never edits points/stickers directly; it calls these and shows the returned events.
 */

export const STATE_VERSION = 1;

export type EngineEvent =
  | { type: 'points'; amount: number; label: string }
  | { type: 'sticker'; stickerId: string }
  | { type: 'daily-complete' }
  | { type: 'weekly-complete'; challengeId: string; title: string };

export interface EngineResult {
  state: AppState;
  events: EngineEvent[];
}

export function createInitialState(): AppState {
  return {
    version: STATE_VERSION,
    profile: null,
    settings: { language: 'en', textSize: 'lg', dayOffset: 0, seenHelp: false },
    ledger: [],
    activity: [],
    lessons: {},
    scenarios: {},
    dailyChallenges: {},
    weeklyChallenges: {},
    stickers: {},
    community: { groupId: null, joinedAt: null, invites: [] },
    reports: [],
    stickerShares: [],
    guidedDemo: { active: false, minimized: false, startedAt: null, startPoints: 0, completed: {} },
  };
}

// JSON clone (state is plain JSON) — works on older phone browsers without structuredClone.
const clone = (s: AppState): AppState => JSON.parse(JSON.stringify(s)) as AppState;

function award(s: AppState, amount: number, reason: PointsReason, label: string, now: Date, events: EngineEvent[]) {
  if (amount <= 0) return;
  s.ledger.push({ id: uid('pt'), amount, reason, label, at: now.toISOString(), groupId: s.community.groupId });
  events.push({ type: 'points', amount, label });
}

/**
 * Re-checks daily challenge, weekly challenges and sticker rules.
 * Loops because one reward can trigger another (e.g. weekly bonus pushes the group over a milestone).
 */
export function evaluate(s: AppState, now: Date, events: EngineEvent[]): AppState {
  for (let pass = 0; pass < 6; pass++) {
    let changed = false;

    // Daily challenge: one lesson + one Identify answer on the same day.
    const dk = dateKey(now);
    const daily = dailyStatus(s, now);
    if (!s.dailyChallenges[dk] && daily.lessonDone && daily.scenarioDone) {
      s.dailyChallenges[dk] = now.toISOString();
      award(s, POINTS.DAILY_CHALLENGE, 'daily_challenge', 'Daily challenge completed', now, events);
      events.push({ type: 'daily-complete' });
      changed = true;
    }

    // Weekly group challenges (require group membership).
    if (s.community.groupId) {
      const wk = weekKey(now);
      for (const c of weeklyProgress(s, now)) {
        if (c.reached && !s.weeklyChallenges[wk]?.[c.id]) {
          s.weeklyChallenges[wk] = { ...(s.weeklyChallenges[wk] ?? {}), [c.id]: now.toISOString() };
          const def = WEEKLY_CHALLENGES.find((w) => w.id === c.id)!;
          award(s, POINTS.WEEKLY_CHALLENGE, 'weekly_challenge', `Weekly challenge: ${def.title}`, now, events);
          events.push({ type: 'weekly-complete', challengeId: c.id, title: def.title });
          changed = true;
        }
      }
    }

    // Stickers
    for (const st of STICKERS) {
      if (s.stickers[st.id]) continue;
      const rule = STICKER_RULES[st.id];
      if (rule && rule(s, now)) {
        s.stickers[st.id] = { unlockedAt: now.toISOString(), seen: false };
        events.push({ type: 'sticker', stickerId: st.id });
        changed = true;
      }
    }

    if (!changed) break;
  }
  return s;
}

// ---------------- Actions ----------------

export function setProfile(state: AppState, profile: Profile): AppState {
  return { ...clone(state), profile };
}

export function completeLesson(state: AppState, lessonId: string, answers: Record<string, string>, now: Date): EngineResult {
  const lesson = getLesson(lessonId);
  if (!lesson) return { state, events: [] };
  const s = clone(state);
  const events: EngineEvent[] = [];
  const prev = s.lessons[lessonId];
  const results = Object.fromEntries(lesson.quiz.map((q) => [q.id, answers[q.id] === q.correctId]));
  const score = Object.values(results).filter(Boolean).length;

  if (!prev?.completed) {
    s.lessons[lessonId] = {
      completed: true,
      firstCompletedAt: now.toISOString(),
      timesCompleted: 1,
      firstAttempt: results,
      lastScore: score,
    };
    award(s, POINTS.LESSON_COMPLETE, 'lesson_complete', `Completed: ${lesson.title}`, now, events);
    if (score > 0) award(s, score * POINTS.QUIZ_CORRECT, 'quiz_correct', `${score} correct quiz answer${score > 1 ? 's' : ''}`, now, events);
  } else {
    s.lessons[lessonId] = { ...prev, timesCompleted: prev.timesCompleted + 1, lastScore: score };
  }
  s.activity.push({ type: 'lesson', refId: lessonId, at: now.toISOString() });
  return { state: evaluate(s, now, events), events };
}

export function answerScenario(
  state: AppState,
  scenarioId: string,
  choiceId: string,
  verdictGuess: Verdict | undefined,
  now: Date,
): EngineResult & { rating: ChoiceRating; pointsAwarded: number; firstTime: boolean } {
  const sc = getScenario(scenarioId);
  const choice = sc?.choices.find((c) => c.id === choiceId);
  if (!sc || !choice) return { state, events: [], rating: 'unsafe', pointsAwarded: 0, firstTime: false };
  const s = clone(state);
  const events: EngineEvent[] = [];
  const prev = s.scenarios[scenarioId];
  let pointsAwarded = 0;
  if (!prev) {
    pointsAwarded = scenarioPoints(choice.rating);
    s.scenarios[scenarioId] = {
      firstChoiceId: choiceId,
      firstRating: choice.rating,
      firstVerdictGuess: verdictGuess,
      pointsAwarded,
      attempts: 1,
      lastAnsweredAt: now.toISOString(),
    };
    award(s, pointsAwarded, 'scenario_answer', `Identify: ${sc.title}`, now, events);
  } else {
    s.scenarios[scenarioId] = { ...prev, attempts: prev.attempts + 1, lastAnsweredAt: now.toISOString() };
  }
  s.activity.push({ type: 'scenario', refId: scenarioId, at: now.toISOString() });
  return { state: evaluate(s, now, events), events, rating: choice.rating, pointsAwarded, firstTime: !prev };
}

export function joinGroup(state: AppState, groupId: string, now: Date): EngineResult {
  if (!getGroup(groupId)) return { state, events: [] };
  const s = clone(state);
  s.community.groupId = groupId;
  s.community.joinedAt = now.toISOString();
  const events: EngineEvent[] = [];
  return { state: evaluate(s, now, events), events };
}

export function leaveGroup(state: AppState): AppState {
  const s = clone(state);
  s.community.groupId = null;
  s.community.joinedAt = null;
  return s;
}

export function simulateInvite(state: AppState, now: Date): EngineResult & { friendName: string } {
  const s = clone(state);
  const used = new Set(s.community.invites.map((i) => i.friendName));
  const friendName = MOCK_FRIEND_NAMES.find((n) => !used.has(n)) ?? `Friend ${s.community.invites.length + 1}`;
  s.community.invites.push({ id: uid('inv'), friendName, at: now.toISOString() });
  const events: EngineEvent[] = [];
  return { state: evaluate(s, now, events), events, friendName };
}

export function referralCode(state: AppState): string {
  const name = (state.profile?.nickname ?? 'FRIEND').replace(/[^a-z]/gi, '').toUpperCase().slice(0, 5) || 'FRIEND';
  const area = (getGroup(state.community.groupId)?.area ?? 'SG').toUpperCase().slice(0, 4);
  const created = state.profile?.createdAt ?? '';
  let hash = 0;
  for (const ch of name + created) hash = (hash * 31 + ch.charCodeAt(0)) % 9000;
  return `${area}-${name}-${1000 + hash}`;
}

/** Demo reports: stored locally, never transmitted, never earn points. */
export function submitReport(state: AppState, input: { content: string; category: string; reason: string }, now: Date): AppState {
  const s = clone(state);
  s.reports.unshift({ id: uid('rpt'), ...input, submittedAt: now.toISOString() });
  return s;
}

export function setReportStatus(state: AppState, id: string, status: AppState['reports'][number]['manualStatus']): AppState {
  const s = clone(state);
  const r = s.reports.find((x) => x.id === id);
  if (r) r.manualStatus = status;
  return s;
}

export function recordShare(state: AppState, stickerId: string, method: 'download' | 'share' | 'copy', now: Date): AppState {
  const s = clone(state);
  s.stickerShares.push({ stickerId, method, at: now.toISOString() });
  return s;
}

export function markStickersSeen(state: AppState, ids: string[]): AppState {
  const s = clone(state);
  for (const id of ids) if (s.stickers[id]) s.stickers[id].seen = true;
  return s;
}

/**
 * Preconfigured presenter profile ("Auntie Mary").
 * Built by REPLAYING real engine actions at earlier timestamps, so all numbers are
 * consistent with recorded activity (70 points, Lesson 1 done, 2 Identify answers, Tampines group).
 * Good Morning Monday stays locked so the Guided Demo can unlock it live.
 */
export function createDemoState(now: Date, settings?: AppState['settings']): AppState {
  let s = createInitialState();
  if (settings) s.settings = { ...settings };
  s.settings.seenHelp = true; // don't interrupt the presenter
  s.profile = { nickname: 'Auntie Mary', avatarId: 'auntie', createdAt: addDays(now, -3).toISOString(), isDemoProfile: true };
  const at = (daysAgo: number, hour: number) => {
    const d = addDays(now, -daysAgo);
    d.setHours(hour, 15, 0, 0);
    return d;
  };
  s = joinGroup(s, 'tampines', at(3, 9)).state;
  s = answerScenario(s, 'daughter-dinner', 'a', 'genuine', at(2, 10)).state;
  s = answerScenario(s, 'parcel-sms', 'b', 'suspicious', at(2, 10)).state;
  s = completeLesson(s, 'what-is-deepfake', { q1: 'b', q2: 'b', q3: 'c' }, at(1, 10)).state;
  s = markStickersSeen(s, Object.keys(s.stickers));
  return s;
}

export function pointsTotal(s: AppState) {
  return totalPoints(s);
}
