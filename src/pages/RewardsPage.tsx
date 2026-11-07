import { useState } from 'react';
import { Gift } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { COLLECTION_LABELS, STICKERS } from '../data/stickers';
import { PageHeader, ProgressBar } from '../components/ui';
import { StickerImage } from '../components/StickerImage';
import { StickerShareModal } from '../components/StickerShareModal';
import type { StickerCollection, StickerDef } from '../types';
import { POINTS } from '../services/scoring';

type Filter = 'all' | StickerCollection;

export function RewardsPage() {
  const { state, actions, t } = useApp();
  const [filter, setFilter] = useState<Filter>('all');
  const [open, setOpen] = useState<StickerDef | null>(null);
  const unlockedCount = Object.keys(state.stickers).length;
  const list = STICKERS.filter((s) => filter === 'all' || s.collection === filter);

  const openSticker = (s: StickerDef) => {
    setOpen(s);
    if (state.stickers[s.id] && !state.stickers[s.id].seen) actions.markStickersSeen([s.id]);
  };

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: STICKERS.length },
    ...(['daily', 'achievement', 'community'] as StickerCollection[]).map((c) => ({
      id: c,
      label: COLLECTION_LABELS[c],
      count: STICKERS.filter((s) => s.collection === c).length,
    })),
  ];

  return (
    <div>
      <PageHeader title={t('rewards.title')} subtitle={t('rewards.subtitle')} icon={<Gift />} />

      <div className="card mb-4">
        <p className="text-lg font-bold">
          {unlockedCount}/{STICKERS.length} {t('rewards.collected')}
        </p>
        <ProgressBar value={(unlockedCount / STICKERS.length) * 100} className="mt-2" color="bg-sun-400" label="Stickers collected" />
        <p className="mt-2 text-sm text-navy-600">Tap any sticker to see how to unlock it, or to share and download it.</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Sticker collections">
        {filters.map((f) => (
          <button
            key={f.id}
            role="tab"
            aria-selected={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={`min-h-[3rem] shrink-0 rounded-full px-4 font-bold ${
              filter === f.id ? 'bg-navy-800 text-white' : 'bg-white text-navy-700 ring-1 ring-navy-100'
            }`}
          >
            {f.label} <span className="opacity-70">({f.count})</span>
          </button>
        ))}
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4" data-testid="sticker-grid">
        {list.map((s) => {
          const u = state.stickers[s.id];
          return (
            <li key={s.id}>
              <button
                onClick={() => openSticker(s)}
                className="card relative flex h-full w-full flex-col items-center p-3 text-center transition hover:-translate-y-0.5 hover:shadow-lift"
                data-demo={`sticker-${s.id}`}
                data-testid={`sticker-${s.id}`}
                aria-label={`${s.name}${u ? '' : ' (locked)'}`}
              >
                {u && !u.seen && (
                  <span className="absolute right-2 top-2 z-[1] rounded-full bg-red-500 px-2 py-0.5 text-xs font-extrabold text-white">
                    {t('common.new')}
                  </span>
                )}
                <StickerImage sticker={s} locked={!u} className="aspect-square w-full" />
                <span className="mt-2 font-extrabold leading-tight">{s.name}</span>
                <span className="mt-1 text-sm leading-snug text-navy-600">{u ? `${s.rarity} · Tap to share` : s.criteria}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <section className="card mt-5">
        <h2 className="text-xl font-extrabold">How to earn points</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {[
            ['Complete a lesson (first time)', POINTS.LESSON_COMPLETE],
            ['Correct quiz answer (first time)', POINTS.QUIZ_CORRECT],
            ['Safe choice in Identify (first answer)', POINTS.SCENARIO_SAFE],
            ['Complete today’s challenge', POINTS.DAILY_CHALLENGE],
            ['Complete a weekly group challenge', POINTS.WEEKLY_CHALLENGE],
          ].map(([label, pts]) => (
            <li key={label as string} className="flex items-center justify-between rounded-2xl bg-navy-50 px-4 py-3">
              <span className="font-semibold">{label}</span>
              <span className="font-extrabold text-teal-700">+{pts}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-navy-600">
          Demo reports never earn points, because their content is not verified. In a real rollout, partners could offer community rewards
          (proposal only — not part of this demo).
        </p>
      </section>

      <StickerShareModal sticker={open} onClose={() => setOpen(null)} />
    </div>
  );
}
