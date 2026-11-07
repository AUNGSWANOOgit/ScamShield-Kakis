import type { AppState } from '../types';
import { totalPoints } from '../services/selectors';

export interface DemoStep {
  id: string;
  title: string;
  instruction: string;
  demonstrates: string;
  route: string;
  /** CSS selector value for data-demo="..." element to highlight */
  target?: string;
  /** Automatic completion check based on real app state (visit-based steps are marked by the router). */
  isDone?: (s: AppState, startedAt: string) => boolean;
  visit?: string; // route that completes this step when visited while it is the current step
}

const after = (iso: string, startedAt: string) => new Date(iso).getTime() >= new Date(startedAt).getTime();

/**
 * Guided Presentation Demo (~2–3 minutes). The presenter clicks through the real app;
 * steps complete automatically when the real action happens. Nothing is auto-played.
 */
export const DEMO_STEPS: DemoStep[] = [
  {
    id: 'dashboard',
    title: 'Open the dashboard',
    instruction: 'Show the personalised greeting, points, streak and today’s challenge.',
    demonstrates: 'Personalised, senior-friendly home screen with large buttons and live progress.',
    route: '/home',
    target: 'daily-card',
    visit: '/home',
  },
  {
    id: 'lesson',
    title: 'Complete a short lesson',
    instruction: 'Tap "Learn", open Lesson 2, flip through the cards, and answer the 3-question quiz.',
    demonstrates: 'Bite-sized learning cards with instant quiz feedback and points.',
    route: '/learn',
    target: 'lesson-spotting-suspicious',
    isDone: (s, st) => s.activity.some((a) => a.type === 'lesson' && after(a.at, st)),
  },
  {
    id: 'identify',
    title: 'Answer a scam-identification question',
    instruction: 'Open "Identify", look at the example, and choose what you would do.',
    demonstrates: 'Realistic, fictional scenarios that teach safe decisions — not perfect fake detection.',
    route: '/identify',
    target: 'identify-start',
    isDone: (s, st) => s.activity.some((a) => a.type === 'scenario' && after(a.at, st)),
  },
  {
    id: 'points',
    title: 'Earn points',
    instruction: 'Point out the "+points" messages and the updated total on the dashboard.',
    demonstrates: 'Simple, consistent points rules that reward learning (never unverified reports).',
    route: '/home',
    target: 'points-card',
    isDone: (s) => s.guidedDemo.startPoints < totalPoints(s),
  },
  {
    id: 'sticker',
    title: 'Unlock "Good Morning Monday"',
    instruction: 'Completing a lesson + an Identify question today finishes the daily challenge and unlocks the sticker.',
    demonstrates: 'Familiar greeting-style stickers as meaningful rewards seniors already like to send.',
    route: '/identify',
    isDone: (s) => Boolean(s.stickers['good-morning-monday']),
  },
  {
    id: 'share',
    title: 'Download or share the sticker',
    instruction: 'Open Rewards, tap the sticker, then "Share" (phone) or "Download PNG" (laptop).',
    demonstrates: 'Real PNG export and the phone share sheet — rewards travel into family chats.',
    route: '/rewards',
    target: 'sticker-good-morning-monday',
    isDone: (s, st) => s.stickerShares.some((x) => after(x.at, st)),
  },
  {
    id: 'community',
    title: 'View the community group’s progress',
    instruction: 'Open "Community" to show how your points helped the group and the weekly challenges.',
    demonstrates: 'Collaborative group goals and milestones that motivate continued practice.',
    route: '/community',
    target: 'group-progress',
    visit: '/community',
  },
];
