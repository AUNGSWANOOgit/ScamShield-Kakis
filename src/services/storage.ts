import type { AppState } from '../types';
import { createInitialState, STATE_VERSION } from './engine';

export const STORAGE_KEY = 'safeseniors-sg-demo-v1';

/** Load persisted demo progress. Falls back to a fresh state if missing, corrupt, or from an old version. */
export function loadState(): AppState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed || parsed.version !== STATE_VERSION) return createInitialState();
    // Merge with defaults so newly added fields are always present.
    const base = createInitialState();
    return {
      ...base,
      ...parsed,
      settings: { ...base.settings, ...parsed.settings },
      community: { ...base.community, ...parsed.community },
      guidedDemo: { ...base.guidedDemo, ...parsed.guidedDemo },
    };
  } catch {
    return createInitialState();
  }
}

export function saveState(state: AppState): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    // Storage may be full or blocked (e.g. some private browsing modes). The demo keeps working in memory.
    return false;
  }
}

export function clearState() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
