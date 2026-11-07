import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PartyPopper, Share2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getSticker } from '../data/stickers';
import { Modal } from './ui';
import { StickerImage } from './StickerImage';
import { StickerShareModal } from './StickerShareModal';
import type { StickerDef } from '../types';

const COLORS = ['#ffbf4a', '#159f90', '#2c55a0', '#ef4444', '#f472b6', '#63d7c6'];

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 42 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 1.8 + Math.random() * 1.6,
        color: COLORS[i % COLORS.length],
        rotate: Math.random() * 360,
      })),
    [],
  );
  return (
    <div aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}vw`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}

/** Shows sticker-unlock celebrations one at a time from the queue. */
export function CelebrationLayer() {
  const { celebrationQueue, dismissCelebration, actions, t } = useApp();
  const navigate = useNavigate();
  const [sharing, setSharing] = useState<StickerDef | null>(null);
  const currentId = celebrationQueue[0];
  const sticker = currentId ? getSticker(currentId) : undefined;

  const close = () => {
    if (currentId) actions.markStickersSeen([currentId]);
    dismissCelebration();
  };

  return (
    <>
      {sticker && !sharing && (
        <>
          <Confetti key={sticker.id} />
          <Modal open onClose={close} labelledBy="celebrate-title">
            <div className="flex flex-col items-center text-center" data-testid="celebration">
              <div className="chip bg-sun-100 text-sun-800">
                <PartyPopper size={18} /> {t('rewards.unlocked')}
              </div>
              <StickerImage key={sticker.id} sticker={sticker} className="mt-3 h-56 w-56 animate-pop sm:h-64 sm:w-64" />
              <h2 id="celebrate-title" className="mt-2 text-2xl font-extrabold">
                {sticker.name}
              </h2>
              <p className="mt-2 text-lg text-navy-700">{sticker.howEarned}</p>
              {celebrationQueue.length > 1 && (
                <p className="mt-1 text-sm font-semibold text-teal-700">+{celebrationQueue.length - 1} more to celebrate!</p>
              )}
            </div>
            <div className="mt-5 grid gap-3">
              <button className="btn-teal w-full text-lg" onClick={() => setSharing(sticker)}>
                <Share2 /> {t('rewards.share')}
              </button>
              <button
                className="btn-primary w-full text-lg"
                onClick={() => {
                  close();
                  navigate('/rewards');
                }}
              >
                {t('rewards.viewCollection')}
              </button>
              <button className="btn-ghost w-full" onClick={close}>
                {t('common.continue')}
              </button>
            </div>
          </Modal>
        </>
      )}
      <StickerShareModal
        sticker={sharing}
        onClose={() => {
          setSharing(null);
          close();
        }}
      />
    </>
  );
}

const TOAST_MS = 7000; // long enough to read slowly

/** Messages wait while a sticker celebration is open, so they never cover the reward on a phone. */
export function ToastLayer() {
  const { toasts, dismissToast, celebrationQueue } = useApp();
  if (celebrationQueue.length > 0) return null;
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[90] flex flex-col items-center gap-2 px-3 lg:items-end lg:px-6"
      style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 0.75rem)' }}
      aria-live="polite"
    >
      {toasts.slice(-1).map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={() => dismissToast(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast: t, onDismiss }: { toast: ReturnType<typeof useApp>['toasts'][number]; onDismiss: () => void }) {
  useEffect(() => {
    const id = window.setTimeout(onDismiss, TOAST_MS);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <button
      onClick={onDismiss}
      className={`pointer-events-auto flex w-full max-w-sm animate-floatUp items-center gap-3 rounded-2xl px-4 py-3 text-left shadow-lift ${
        t.kind === 'points' ? 'bg-sun-300 text-navy-950' : t.kind === 'success' ? 'bg-teal-600 text-white' : 'bg-navy-800 text-white'
      }`}
    >
      <span className="text-2xl" aria-hidden="true">
        {t.kind === 'points' ? '⭐' : t.kind === 'success' ? '🎉' : 'ℹ️'}
      </span>
      <span>
        <span className="block text-lg font-extrabold leading-tight">{t.title}</span>
        {t.detail && <span className="block text-sm opacity-90">{t.detail}</span>}
      </span>
    </button>
  );
}
