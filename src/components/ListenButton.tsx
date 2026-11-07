import { Square, Volume2 } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';

/** Big, clearly labelled "Listen" button that reads text aloud. Hidden if the browser cannot speak. */
export function ListenButton({ id, text, className = '' }: { id: string; text: string; className?: string }) {
  const { speaking, speak, stop, supported } = useSpeech(id);
  if (!supported) return null;
  return (
    <button
      type="button"
      onClick={() => (speaking ? stop() : speak(text))}
      className={`inline-flex min-h-[3rem] items-center gap-2 rounded-full border-2 px-4 font-bold transition ${
        speaking ? 'border-sun-500 bg-sun-100 text-navy-900' : 'border-navy-200 bg-white text-navy-800 hover:border-teal-400'
      } ${className}`}
      aria-pressed={speaking}
      data-testid="listen"
    >
      {speaking ? <Square size={20} fill="currentColor" /> : <Volume2 size={22} />}
      {speaking ? 'Stop' : 'Listen'}
    </button>
  );
}
