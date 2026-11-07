import { describe, expect, it } from 'vitest';
import {
  answerScenario,
  completeLesson,
  createDemoState,
  createInitialState,
  joinGroup,
  simulateInvite,
  submitReport,
} from './engine';
import {
  dailyStatus,
  groupTotal,
  quizStats,
  reportStatus,
  streak,
  totalPoints,
  weeklyProgress,
} from './selectors';
import { getGroup } from '../data/community';
import { addDays } from '../utils/time';

const NOW = new Date(2026, 10, 6, 10, 0, 0); // Fri 6 Nov 2026, 10:00 local

function freshUser() {
  const s = createInitialState();
  s.profile = { nickname: 'Tester', avatarId: 'uncle', createdAt: NOW.toISOString(), isDemoProfile: false };
  return s;
}

describe('lessons', () => {
  it('awards lesson + quiz points once only', () => {
    let s = freshUser();
    const r1 = completeLesson(s, 'what-is-deepfake', { q1: 'b', q2: 'b', q3: 'a' }, NOW);
    s = r1.state;
    expect(totalPoints(s)).toBe(20 + 2 * 10);
    expect(s.stickers['deepfake-detective']).toBeDefined();
    const r2 = completeLesson(s, 'what-is-deepfake', { q1: 'b', q2: 'b', q3: 'c' }, NOW);
    expect(totalPoints(r2.state)).toBe(40);
    expect(r2.state.lessons['what-is-deepfake'].timesCompleted).toBe(2);
    expect(quizStats(r2.state)).toMatchObject({ answered: 3, correct: 2 });
  });
});

describe('identify scenarios', () => {
  it('scores first attempt only: safe 10, okay 5, unsafe 0', () => {
    let s = freshUser();
    s = answerScenario(s, 'grandson-voice', 'b', 'suspicious', NOW).state;
    expect(totalPoints(s)).toBe(10);
    s = answerScenario(s, 'grandson-voice', 'b', 'suspicious', NOW).state; // replay
    expect(totalPoints(s)).toBe(10);
    s = answerScenario(s, 'bank-new-device', 'c', 'uncertain', NOW).state; // okay
    expect(totalPoints(s)).toBe(15);
    s = answerScenario(s, 'parcel-sms', 'a', 'genuine', NOW).state; // unsafe
    expect(totalPoints(s)).toBe(15);
  });
});

describe('daily challenge', () => {
  it('completes with one lesson + one scenario in a day, unlocks Good Morning Monday, once per day', () => {
    let s = freshUser();
    s = completeLesson(s, 'spotting-suspicious', { q1: 'b', q2: 'b', q3: 'b' }, NOW).state;
    expect(dailyStatus(s, NOW).completed).toBe(false);
    const r = answerScenario(s, 'grandson-voice', 'b', undefined, NOW);
    s = r.state;
    expect(dailyStatus(s, NOW).completed).toBe(true);
    expect(r.events.some((e) => e.type === 'sticker' && e.stickerId === 'good-morning-monday')).toBe(true);
    const pts = totalPoints(s);
    s = answerScenario(s, 'parcel-sms', 'b', undefined, NOW).state;
    expect(totalPoints(s)).toBe(pts + 10); // no second daily bonus
    // Next day: repeatable, unlocks Happy Tuesday
    const tomorrow = addDays(NOW, 1);
    s = completeLesson(s, 'spotting-suspicious', {}, tomorrow).state; // replay counts
    s = answerScenario(s, 'grandson-voice', 'b', undefined, tomorrow).state;
    expect(s.stickers['happy-tuesday']).toBeDefined();
    expect(streak(s, tomorrow)).toBe(2);
  });
});

describe('community', () => {
  it('counts contributions only after joining and completes weekly challenges', () => {
    let s = freshUser();
    s = answerScenario(s, 'grandson-voice', 'b', undefined, NOW).state; // before joining
    s = joinGroup(s, 'bedok', NOW).state;
    const g = getGroup('bedok')!;
    expect(groupTotal(s, g)).toBe(g.baseTotalPoints);
    const ids = ['parcel-sms', 'whatsapp-otp', 'investment-group', 'flood-image'];
    const choices: Record<string, string> = { 'parcel-sms': 'b', 'whatsapp-otp': 'b', 'investment-group': 'c', 'flood-image': 'b' };
    for (const id of ids) s = answerScenario(s, id, choices[id], undefined, NOW).state;
    // 5 identify answers this week -> weekly challenge + Scam Spotter
    const wk = weeklyProgress(s, NOW).find((w) => w.id === 'wk-identify')!;
    expect(wk.completedAt).toBeDefined();
    expect(s.stickers['weekly-mission']).toBeDefined();
    expect(s.stickers['scam-spotter']).toBeDefined();
    expect(groupTotal(s, g)).toBeGreaterThan(g.baseTotalPoints);
  });

  it('simulated invite unlocks Friendly Inviter', () => {
    const s = simulateInvite(freshUser(), NOW).state;
    expect(s.community.invites).toHaveLength(1);
    expect(s.stickers['friendly-inviter']).toBeDefined();
  });
});

describe('reports', () => {
  it('stores locally, awards no points, and progresses simulated status', () => {
    const s = submitReport(freshUser(), { content: 'x', category: 'SMS', reason: 'y' }, NOW);
    expect(totalPoints(s)).toBe(0);
    const r = s.reports[0];
    expect(reportStatus(r, NOW)).toBe('Submitted');
    expect(reportStatus(r, new Date(NOW.getTime() + 90_000))).toBe('Under Review');
    expect(reportStatus(r, new Date(NOW.getTime() + 240_000))).toBe('Reviewed');
  });
});

describe('demo profile + guided journey', () => {
  it('seeds consistent data and the guided journey unlocks Good Morning Monday', () => {
    let s = createDemoState(NOW);
    expect(totalPoints(s)).toBe(70);
    expect(s.stickers['deepfake-detective']?.seen).toBe(true);
    expect(s.stickers['good-morning-monday']).toBeUndefined();
    expect(s.community.groupId).toBe('tampines');
    expect(streak(s, NOW)).toBe(2);

    const r1 = completeLesson(s, 'spotting-suspicious', { q1: 'b', q2: 'b', q3: 'b' }, NOW);
    s = r1.state;
    expect(totalPoints(s)).toBe(120);
    expect(r1.events.some((e) => e.type === 'sticker' && e.stickerId === 'rising-star')).toBe(true);

    const r2 = answerScenario(s, 'grandson-voice', 'b', 'suspicious', NOW);
    s = r2.state;
    expect(r2.events.some((e) => e.type === 'sticker' && e.stickerId === 'good-morning-monday')).toBe(true);
    expect(totalPoints(s)).toBe(160);
    expect(streak(s, NOW)).toBe(3);
    // Group still has a visible milestone to work towards
    const g = getGroup('tampines')!;
    expect(groupTotal(s, g)).toBe(1940);
    expect(s.stickers['team-champion']).toBeUndefined();
  });
});
