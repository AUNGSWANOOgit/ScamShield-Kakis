// ---------- Shared domain types ----------

export type Language = 'en' | 'zh';
export type TextSize = 'md' | 'lg' | 'xl';

export interface Profile {
  nickname: string;
  avatarId: string;
  createdAt: string; // ISO
  isDemoProfile: boolean;
}

export interface Settings {
  language: Language;
  textSize: TextSize;
  /** Presenter tool: shifts the app clock forward by N days to demonstrate daily/weekly resets. */
  dayOffset: number;
  /** Whether the simple "How to use this app" guide has been shown once. */
  seenHelp: boolean;
}

export type PointsReason =
  | 'lesson_complete'
  | 'quiz_correct'
  | 'scenario_answer'
  | 'daily_challenge'
  | 'weekly_challenge';

export interface PointsEntry {
  id: string;
  amount: number;
  reason: PointsReason;
  label: string;
  at: string; // ISO timestamp
  /** Community group the user belonged to when the points were earned (counts as group contribution). */
  groupId: string | null;
}

export type ActivityType = 'lesson' | 'scenario';

export interface ActivityEntry {
  type: ActivityType;
  refId: string;
  at: string; // ISO
}

export interface LessonProgress {
  completed: boolean;
  firstCompletedAt?: string;
  timesCompleted: number;
  /** question id -> whether the FIRST attempt (first completion) was correct */
  firstAttempt: Record<string, boolean>;
  lastScore: number; // correct answers in latest run
}

export type Verdict = 'genuine' | 'suspicious' | 'uncertain';
export type ChoiceRating = 'safe' | 'okay' | 'unsafe';

export interface ScenarioProgress {
  firstChoiceId: string;
  firstRating: ChoiceRating;
  firstVerdictGuess?: Verdict;
  pointsAwarded: number;
  attempts: number;
  lastAnsweredAt: string;
}

export type ReportStatus = 'Submitted' | 'Under Review' | 'Reviewed';

export interface DemoReport {
  id: string;
  content: string;
  category: string;
  reason: string;
  submittedAt: string;
  /** Presenter can manually advance the simulated status. */
  manualStatus?: ReportStatus;
}

export interface Invite {
  id: string;
  friendName: string;
  at: string;
}

export interface CommunityState {
  groupId: string | null;
  joinedAt: string | null;
  invites: Invite[];
  /** Number of times the user has viewed the community page (used by Guided Demo). */
}

export interface StickerUnlock {
  unlockedAt: string;
  seen: boolean;
}

export interface GuidedDemoState {
  active: boolean;
  minimized: boolean;
  startedAt: string | null;
  startPoints: number;
  /** step id -> completed ISO */
  completed: Record<string, string>;
}

export interface AppState {
  version: number;
  profile: Profile | null;
  settings: Settings;
  ledger: PointsEntry[];
  activity: ActivityEntry[];
  lessons: Record<string, LessonProgress>;
  scenarios: Record<string, ScenarioProgress>;
  dailyChallenges: Record<string, string>; // dateKey -> completed ISO
  weeklyChallenges: Record<string, Record<string, string>>; // weekKey -> challengeId -> ISO
  stickers: Record<string, StickerUnlock>;
  community: CommunityState;
  reports: DemoReport[];
  stickerShares: { stickerId: string; method: 'download' | 'share' | 'copy'; at: string }[];
  guidedDemo: GuidedDemoState;
}

// ---------- Content types ----------

export interface LessonCard {
  title: string;
  body: string[];
  illustration: IllustrationKey;
  tip?: string;
}

export type IllustrationKey =
  | 'ai-brain'
  | 'fake-video'
  | 'voice-wave'
  | 'not-trust'
  | 'magnifier'
  | 'impersonation'
  | 'pressure-clock'
  | 'money-request'
  | 'check-source'
  | 'pause'
  | 'phone-verify'
  | 'lock-info'
  | 'report-help';

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctId: string;
  explanation: string;
}

export interface Lesson {
  id: string;
  number: number;
  title: string;
  zhTitle: string;
  summary: string;
  minutes: number;
  color: 'teal' | 'navy' | 'sun';
  cards: LessonCard[];
  quiz: QuizQuestion[];
}

export type ScenarioChannel = 'whatsapp' | 'facebook' | 'sms' | 'video-call' | 'voice-note' | 'video-post' | 'group-chat';

export interface ScenarioMessage {
  from: 'them' | 'me' | 'system';
  text?: string;
  /** Renders a mock voice note bubble with this duration label */
  voice?: string;
  /** Renders a mock image placeholder with this caption */
  image?: { caption: string; kind: 'flood' | 'profit' | 'parcel' | 'product' };
  time?: string;
}

export interface ScenarioChoice {
  id: string;
  label: string;
  rating: ChoiceRating;
  feedback: string;
}

export interface Scenario {
  id: string;
  title: string;
  category: string;
  channel: ScenarioChannel;
  sender: { name: string; subtitle: string; initials: string; color: string };
  intro: string;
  messages: ScenarioMessage[];
  /** Video / post overlay used for video-post / video-call channels */
  media?: { headline: string; caption: string; badge?: string; person: string };
  actualVerdict: Verdict;
  verdictExplanation: string;
  choices: ScenarioChoice[];
  warningSigns: string[];
  keyLesson: string;
}

export type StickerCollection = 'daily' | 'achievement' | 'community';
export type Rarity = 'Common' | 'Rare' | 'Epic';

export interface StickerDef {
  id: string;
  name: string;
  collection: StickerCollection;
  rarity: Rarity;
  criteria: string;
  howEarned: string;
  greeting: string; // message to copy alongside sharing
  design: StickerDesign;
}

export type FlowerKind =
  | 'plum'
  | 'peony'
  | 'sunflower'
  | 'lotus'
  | 'orchid'
  | 'hibiscus'
  | 'chrysanthemum'
  | 'rose'
  | 'daisy';

/**
 * Greeting-image style sticker (like the "good morning" pictures seniors forward in chats):
 * full-bleed blossom + bokeh background, bilingual headline, wish line, a short safety tip and a blessing.
 */
export interface StickerDesign {
  flower: FlowerKind;
  scene?: 'sunrise' | 'kopi' | 'garden';
  bokeh: string[]; // background colours (first = base top, second = base bottom, rest = bokeh lights)
  zhTitle: string;
  enScript: string;
  zhWish: string;
  tip: string;
  blessing: string;
  titleColor?: string;
  scriptColor?: string;
  wishColor?: string;
}

export interface GroupMember {
  name: string;
  avatarId: string;
  weeklyPoints: number;
  role?: string;
}

export interface CommunityGroup {
  id: string;
  name: string;
  area: string;
  description: string;
  color: string;
  baseTotalPoints: number;
  baseWeeklyPoints: number;
  milestones: number[];
  members: GroupMember[];
  meetingNote: string;
}
