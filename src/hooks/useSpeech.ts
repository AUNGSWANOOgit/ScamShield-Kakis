import { useCallback, useEffect, useState } from 'react';

/**
 * Read-aloud using the browser's built-in Web Speech API (works offline on most phones,
 * no server or API key). Slightly slower speaking rate for older listeners.
 */
export const speechSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

let currentId: string | null = null;
const listeners = new Set<(id: string | null) => void>();
const notify = () => listeners.forEach((l) => l(currentId));

function pickVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang === 'en-SG') ??
    voices.find((v) => v.lang === 'en-GB') ??
    voices.find((v) => v.lang?.startsWith('en'))
  );
}

export function stopSpeaking() {
  if (!speechSupported()) return;
  window.speechSynthesis.cancel();
  currentId = null;
  notify();
}

export function useSpeech(id: string) {
  const [active, setActive] = useState<string | null>(currentId);
  useEffect(() => {
    listeners.add(setActive);
    return () => {
      listeners.delete(setActive);
    };
  }, []);
  // Stop reading when the component that started it goes away (e.g. page change).
  useEffect(() => () => {
    if (currentId === id) stopSpeaking();
  }, [id]);

  const speak = useCallback(
    (text: string) => {
      if (!speechSupported()) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text.replace(/[\u{1F300}-\u{1FAFF}☀-➿]/gu, ''));
      const voice = pickVoice();
      if (voice) u.voice = voice;
      u.lang = voice?.lang ?? 'en-GB';
      u.rate = 0.88;
      u.onend = u.onerror = () => {
        if (currentId === id) {
          currentId = null;
          notify();
        }
      };
      currentId = id;
      notify();
      window.speechSynthesis.speak(u);
    },
    [id],
  );

  return { speaking: active === id, speak, stop: stopSpeaking, supported: speechSupported() };
}
