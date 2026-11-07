import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { AppState, Language, ReportStatus, Settings, Verdict } from '../types';
import * as engine from '../services/engine';
import type { EngineEvent } from '../services/engine';
import { clearState, loadState, saveState } from '../services/storage';
import { totalPoints } from '../services/selectors';
import { translate, type TranslationKey } from '../i18n/translations';
import { appNow, uid } from '../utils/time';
import { DEMO_STEPS } from '../data/demoSteps';

export interface Toast {
  id: string;
  kind: 'points' | 'success' | 'info';
  title: string;
  detail?: string;
}

interface AppContextValue {
  state: AppState;
  now: Date;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  lang: Language;
  toasts: Toast[];
  dismissToast: (id: string) => void;
  pushToast: (t: Omit<Toast, 'id'>) => void;
  celebrationQueue: string[];
  dismissCelebration: () => void;
  storageOk: boolean;
  actions: {
    createProfile: (nickname: string, avatarId: string) => void;
    useDemoProfile: () => void;
    updateProfile: (nickname: string, avatarId: string) => void;
    setSettings: (patch: Partial<Settings>) => void;
    completeLesson: (lessonId: string, answers: Record<string, string>) => void;
    answerScenario: (
      scenarioId: string,
      choiceId: string,
      verdict?: Verdict,
    ) => { rating: 'safe' | 'okay' | 'unsafe'; pointsAwarded: number; firstTime: boolean };
    joinGroup: (groupId: string) => void;
    leaveGroup: () => void;
    invite: () => string;
    submitReport: (input: { content: string; category: string; reason: string }) => void;
    setReportStatus: (id: string, status: ReportStatus) => void;
    deleteReports: () => void;
    recordShare: (stickerId: string, method: 'download' | 'share' | 'copy') => void;
    markStickersSeen: (ids: string[]) => void;
    resetDemo: () => void;
    startGuidedDemo: (freshData: boolean) => void;
    stopGuidedDemo: () => void;
    setGuidedMinimized: (m: boolean) => void;
    markDemoStep: (stepId: string) => void;
  };
}

const AppContext = createContext<AppContextValue | null>(null);

const TEXT_SIZES: Record<Settings['textSize'], string> = { md: '100%', lg: '112.5%', xl: '127%' };

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState());
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [celebrationQueue, setCelebrationQueue] = useState<string[]>([]);
  const [storageOk, setStorageOk] = useState(true);
  const [tick, setTick] = useState(0);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Keep "now" fresh (greeting, simulated report status) without reloading.
  useEffect(() => {
    const id = window.setInterval(() => setTick((x) => x + 1), 30_000);
    return () => window.clearInterval(id);
  }, []);
  const now = useMemo(() => appNow(state.settings.dayOffset), [state.settings.dayOffset, tick, state]);
  const getNow = () => appNow(stateRef.current.settings.dayOffset);

  // Persist every change.
  useEffect(() => {
    setStorageOk(saveState(state));
  }, [state]);

  // Accessibility settings applied to the whole document.
  useEffect(() => {
    document.documentElement.style.fontSize = TEXT_SIZES[state.settings.textSize];
    document.documentElement.lang = state.settings.language === 'zh' ? 'zh-Hans' : 'en';
  }, [state.settings.textSize, state.settings.language]);

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) => translate(state.settings.language, key, vars),
    [state.settings.language],
  );

  const pushToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = uid('toast');
    // Auto-dismiss timing lives in ToastLayer, so the clock only runs while a toast is actually visible.
    setToasts((xs) => [...xs.slice(-1), { ...toast, id }]);
  }, []);
  const dismissToast = useCallback((id: string) => setToasts((xs) => xs.filter((x) => x.id !== id)), []);

  const handleEvents = useCallback(
    (events: EngineEvent[]) => {
      const points = events.filter((e): e is Extract<EngineEvent, { type: 'points' }> => e.type === 'points');
      const totalAwarded = points.reduce((sum, p) => sum + p.amount, 0);
      const weekly = events.filter((e) => e.type === 'weekly-complete').length;
      if (totalAwarded > 0) {
        const detail = points.map((p) => p.label).join(' · ');
        pushToast({
          kind: 'points',
          title: `+${totalAwarded} points`,
          detail: detail.length > 90 ? `${detail.slice(0, 88)}…` : detail,
        });
      } else if (weekly) {
        pushToast({ kind: 'success', title: 'Weekly group challenge complete!' });
      }
      const stickers = events.filter((e) => e.type === 'sticker').map((e) => (e as { stickerId: string }).stickerId);
      if (stickers.length) setCelebrationQueue((q) => [...q, ...stickers]);
    },
    [pushToast],
  );

  const run = useCallback(
    (fn: (s: AppState, now: Date) => engine.EngineResult) => {
      const result = fn(stateRef.current, getNow());
      stateRef.current = result.state;
      setState(result.state);
      handleEvents(result.events);
      return result;
    },
    [handleEvents],
  );

  const update = useCallback((fn: (s: AppState) => AppState) => {
    const next = fn(stateRef.current);
    stateRef.current = next;
    setState(next);
  }, []);

  const actions = useMemo<AppContextValue['actions']>(
    () => ({
      createProfile: (nickname, avatarId) =>
        update((s) =>
          engine.setProfile(s, { nickname: nickname.trim(), avatarId, createdAt: getNow().toISOString(), isDemoProfile: false }),
        ),
      useDemoProfile: () => update((s) => engine.createDemoState(appNow(s.settings.dayOffset), s.settings)),
      updateProfile: (nickname, avatarId) =>
        update((s) => (s.profile ? engine.setProfile(s, { ...s.profile, nickname: nickname.trim(), avatarId }) : s)),
      setSettings: (patch) => update((s) => ({ ...s, settings: { ...s.settings, ...patch } })),
      completeLesson: (lessonId, answers) => {
        run((s, n) => engine.completeLesson(s, lessonId, answers, n));
      },
      answerScenario: (scenarioId, choiceId, verdict) => {
        const r = engine.answerScenario(stateRef.current, scenarioId, choiceId, verdict, getNow());
        stateRef.current = r.state;
        setState(r.state);
        handleEvents(r.events);
        return { rating: r.rating, pointsAwarded: r.pointsAwarded, firstTime: r.firstTime };
      },
      joinGroup: (groupId) => {
        run((s, n) => engine.joinGroup(s, groupId, n));
      },
      leaveGroup: () => update((s) => engine.leaveGroup(s)),
      invite: () => {
        const r = engine.simulateInvite(stateRef.current, getNow());
        stateRef.current = r.state;
        setState(r.state);
        handleEvents(r.events);
        return r.friendName;
      },
      submitReport: (input) => update((s) => engine.submitReport(s, input, appNow(s.settings.dayOffset))),
      setReportStatus: (id, status) => update((s) => engine.setReportStatus(s, id, status)),
      deleteReports: () => update((s) => ({ ...s, reports: [] })),
      recordShare: (stickerId, method) => update((s) => engine.recordShare(s, stickerId, method, appNow(s.settings.dayOffset))),
      markStickersSeen: (ids) => update((s) => engine.markStickersSeen(s, ids)),
      resetDemo: () => {
        clearState();
        const fresh = engine.createInitialState();
        stateRef.current = fresh;
        setState(fresh);
        setCelebrationQueue([]);
        setToasts([]);
      },
      startGuidedDemo: (freshData) => {
        update((s) => {
          const base = freshData || !s.profile ? engine.createDemoState(appNow(0), { ...s.settings, dayOffset: 0 }) : s;
          base.settings.seenHelp = true;
          return {
            ...base,
            guidedDemo: {
              active: true,
              // Phones: start as a compact one-line bar so it never hides the app.
              minimized: typeof window !== 'undefined' && window.innerWidth < 1024,
              startedAt: appNow(base.settings.dayOffset).toISOString(),
              startPoints: totalPoints(base),
              completed: {},
            },
          };
        });
        if (freshData) setCelebrationQueue([]);
      },
      stopGuidedDemo: () => update((s) => ({ ...s, guidedDemo: { ...s.guidedDemo, active: false } })),
      setGuidedMinimized: (m) => update((s) => ({ ...s, guidedDemo: { ...s.guidedDemo, minimized: m } })),
      markDemoStep: (stepId) =>
        update((s) =>
          s.guidedDemo.completed[stepId]
            ? s
            : { ...s, guidedDemo: { ...s.guidedDemo, completed: { ...s.guidedDemo.completed, [stepId]: new Date().toISOString() } } },
        ),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [run, update, handleEvents],
  );

  // Auto-complete guided demo steps from real state changes.
  useEffect(() => {
    const gd = state.guidedDemo;
    if (!gd.active || !gd.startedAt) return;
    for (const step of DEMO_STEPS) {
      if (!gd.completed[step.id] && step.isDone?.(state, gd.startedAt)) actions.markDemoStep(step.id);
    }
  }, [state, actions]);

  const value: AppContextValue = {
    state,
    now,
    t,
    lang: state.settings.language,
    toasts,
    dismissToast,
    pushToast,
    celebrationQueue,
    dismissCelebration: () => setCelebrationQueue((q) => q.slice(1)),
    storageOk,
    actions,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
