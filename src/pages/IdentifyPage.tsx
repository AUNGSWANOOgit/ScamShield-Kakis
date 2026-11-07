import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Flag,
  Info,
  PartyPopper,
  RotateCcw,
  ScanSearch,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SCENARIOS } from '../data/scenarios';
import { PageHeader, ProgressBar, SimBadge } from '../components/ui';
import { ScenarioView } from '../components/ScenarioView';
import { ListenButton } from '../components/ListenButton';
import { scenarioStats } from '../services/selectors';
import type { ChoiceRating, Verdict } from '../types';
import { POINTS } from '../services/scoring';

const RATING_UI: Record<ChoiceRating, { cls: string; icon: typeof CheckCircle2; key: 'identify.safe' | 'identify.okay' | 'identify.unsafe' }> = {
  safe: { cls: 'bg-teal-50 ring-teal-300 text-teal-900', icon: CheckCircle2, key: 'identify.safe' },
  okay: { cls: 'bg-sun-50 ring-sun-300 text-sun-900', icon: CircleHelp, key: 'identify.okay' },
  unsafe: { cls: 'bg-red-50 ring-red-300 text-red-900', icon: XCircle, key: 'identify.unsafe' },
};

const VERDICT_LABEL: Record<Verdict, string> = {
  genuine: 'appears genuine',
  suspicious: 'shows warning signs (suspicious)',
  uncertain: 'is uncertain — you need to verify independently',
};

export function IdentifyPage() {
  const { state, actions, t } = useApp();
  const firstUntried = SCENARIOS.findIndex((s) => !state.scenarios[s.id]);
  const [idx, setIdx] = useState(firstUntried === -1 ? 0 : firstUntried);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [choiceId, setChoiceId] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<{ rating: ChoiceRating; points: number; firstTime: boolean } | null>(null);
  const [roundDone, setRoundDone] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);

  const scenario = SCENARIOS[idx];
  const stats = scenarioStats(state);
  const identifyPoints = useMemo(() => Object.values(state.scenarios).reduce((s, x) => s + x.pointsAwarded, 0), [state.scenarios]);

  const goTo = (i: number) => {
    setIdx(i);
    setVerdict(null);
    setChoiceId(null);
    setOutcome(null);
    setRoundDone(false);
    requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const choose = (id: string) => {
    if (outcome) return;
    const wasAllTried = Object.keys(state.scenarios).length === SCENARIOS.length;
    const res = actions.answerScenario(scenario.id, id, verdict ?? undefined);
    setChoiceId(id);
    setOutcome({ rating: res.rating, points: res.pointsAwarded, firstTime: res.firstTime });
    // Completion celebration the moment every challenge has been tried once.
    if (!wasAllTried && res.firstTime && Object.keys(state.scenarios).length + 1 === SCENARIOS.length) setRoundDone(true);
    requestAnimationFrame(() => feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const next = () => {
    const nextUntried = SCENARIOS.findIndex((s, i) => i > idx && !state.scenarios[s.id]);
    const anyUntried = SCENARIOS.findIndex((s) => !state.scenarios[s.id]);
    goTo(nextUntried !== -1 ? nextUntried : anyUntried !== -1 ? anyUntried : (idx + 1) % SCENARIOS.length);
  };

  const ratingUi = outcome ? RATING_UI[outcome.rating] : null;
  const chosen = scenario.choices.find((c) => c.id === choiceId);

  return (
    <div ref={topRef} className="scroll-mt-20">
      <PageHeader title={t('identify.title')} subtitle={t('identify.subtitle')} icon={<ScanSearch />} />

      <div className="card mb-4 flex items-start gap-3 bg-navy-800 text-white">
        <ShieldCheck className="mt-0.5 shrink-0 text-sun-300" />
        <p className="text-lg">{t('identify.reminder')}</p>
      </div>

      {/* Progress + picker */}
      <div className="card mb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-bold">
            {stats.tried}/{stats.total} tried · {stats.safe} safe first choices
          </p>
          <p className="text-sm text-navy-600">
            {identifyPoints} pts earned here · +{POINTS.SCENARIO_SAFE} safe / +{POINTS.SCENARIO_OKAY} okay (first answer)
          </p>
        </div>
        <ProgressBar value={(stats.tried / stats.total) * 100} className="mt-2" label="Challenges tried" />
        <p className="mt-3 text-sm font-semibold text-navy-600">Tap a number to choose a challenge:</p>
        <div className="mt-2 flex flex-wrap gap-2" role="tablist" aria-label="Choose a challenge">
          {SCENARIOS.map((s, i) => {
            const p = state.scenarios[s.id];
            const dot = p ? (p.firstRating === 'safe' ? 'bg-teal-500' : p.firstRating === 'okay' ? 'bg-sun-400' : 'bg-red-500') : 'bg-navy-200';
            return (
              <button
                key={s.id}
                role="tab"
                aria-selected={i === idx}
                onClick={() => goTo(i)}
                className={`flex h-12 min-w-[3rem] shrink-0 items-center justify-center gap-1.5 rounded-2xl px-3 font-bold ${
                  i === idx ? 'bg-navy-800 text-white' : 'bg-navy-50 text-navy-700 hover:bg-navy-100'
                }`}
                aria-label={`Challenge ${i + 1}: ${s.title}${p ? ' (tried)' : ''}`}
              >
                {i + 1}
                <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
              </button>
            );
          })}
        </div>
      </div>

      {roundDone && (
        <div className="card mb-4 animate-pop bg-gradient-to-br from-sun-100 to-white text-center" data-testid="identify-complete">
          <PartyPopper className="mx-auto text-sun-600" size={44} />
          <h2 className="mt-2 text-2xl font-extrabold">{t('identify.allDone')}</h2>
          <p className="mt-1 text-lg text-navy-700">
            Safe first choices: <strong>{stats.safe}</strong> · Okay: <strong>{stats.okay}</strong> · Risky: <strong>{stats.unsafe}</strong>
          </p>
          <p className="mt-1 text-navy-600">You earned {identifyPoints} points in Identify. Keep practising — replays count for daily and weekly challenges.</p>
        </div>
      )}

      {/* Scenario */}
      <article className="card" aria-labelledby="scenario-title">
        <div className="flex flex-wrap items-center gap-2">
          <SimBadge>{t('identify.simBadge')}</SimBadge>
          <span className="chip bg-navy-50 text-navy-700">{scenario.category}</span>
        </div>
        <h2 id="scenario-title" className="mt-3 text-2xl font-extrabold">
          {idx + 1}. {scenario.title}
        </h2>
        <p className="mt-1 text-lg text-navy-700">{scenario.intro}</p>
        <ListenButton
          id={`scenario-${scenario.id}`}
          text={[
            scenario.intro,
            `Message from ${scenario.sender.name}.`,
            ...(scenario.media ? [scenario.media.headline] : []),
            ...scenario.messages.map((m) => m.text ?? m.image?.caption ?? ''),
          ].join(' ')}
          className="mt-3"
        />

        <div className="mt-4">
          <ScenarioView scenario={scenario} />
        </div>

        {/* Step 1: assessment */}
        <section className="mt-6" data-demo="identify-start">
          <h3 className="text-xl font-extrabold">1. {t('identify.howLooks')}</h3>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {(['genuine', 'suspicious', 'uncertain'] as Verdict[]).map((v) => (
              <button
                key={v}
                onClick={() => !outcome && setVerdict(v)}
                disabled={Boolean(outcome)}
                aria-pressed={verdict === v}
                className={`min-h-[3.25rem] rounded-2xl border-2 px-3 py-2 text-lg font-bold transition ${
                  verdict === v ? 'border-navy-800 bg-navy-800 text-white' : 'border-navy-200 bg-white hover:border-navy-400'
                }`}
                data-testid={`verdict-${v}`}
              >
                {v === 'genuine' ? '🙂 ' : v === 'suspicious' ? '🚩 ' : '🤔 '}
                {t(`identify.${v}`)}
              </button>
            ))}
          </div>
          {verdict && (
            <p className="mt-3 flex animate-floatUp gap-2 rounded-2xl bg-navy-50 p-3 text-navy-800">
              <Info className="mt-0.5 shrink-0 text-navy-600" />
              <span>
                {verdict === scenario.actualVerdict ? 'Good observation. ' : 'Thanks — let’s look closer. '}
                This example {VERDICT_LABEL[scenario.actualVerdict]}. {scenario.verdictExplanation}
              </span>
            </p>
          )}
        </section>

        {/* Step 2: decision */}
        <section className={`mt-6 transition ${verdict ? '' : 'pointer-events-none opacity-40'}`} aria-disabled={!verdict}>
          <h3 className="text-xl font-extrabold">2. {t('identify.whatWouldYouDo')}</h3>
          {!verdict && <p className="mt-1 text-navy-600">Answer question 1 first.</p>}
          <div className="mt-3 grid gap-3">
            {scenario.choices.map((c) => {
              const isChosen = c.id === choiceId;
              const reveal = Boolean(outcome);
              const ring =
                reveal && (isChosen || c.rating === 'safe')
                  ? c.rating === 'safe'
                    ? 'border-teal-500 bg-teal-50'
                    : c.rating === 'okay'
                      ? 'border-sun-400 bg-sun-50'
                      : 'border-red-400 bg-red-50'
                  : 'border-navy-200 bg-white hover:border-teal-400';
              return (
                <button
                  key={c.id}
                  disabled={!verdict || reveal}
                  onClick={() => choose(c.id)}
                  className={`flex min-h-[3.5rem] items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-lg font-semibold transition ${ring} ${
                    reveal && !isChosen && c.rating !== 'safe' ? 'opacity-50' : ''
                  }`}
                  data-testid={`choice-${c.id}`}
                >
                  <span className="flex-1">{c.label}</span>
                  {reveal && c.rating === 'safe' && <CheckCircle2 className="shrink-0 text-teal-600" aria-label="Safe" />}
                  {reveal && isChosen && c.rating === 'unsafe' && <XCircle className="shrink-0 text-red-600" aria-label="Unsafe" />}
                  {reveal && isChosen && c.rating === 'okay' && <CircleHelp className="shrink-0 text-sun-600" aria-label="Okay" />}
                </button>
              );
            })}
          </div>
        </section>

        {/* Feedback */}
        {outcome && ratingUi && chosen && (
          <section ref={feedbackRef} className="mt-6 scroll-mt-24 animate-floatUp space-y-4" data-testid="scenario-feedback" aria-live="polite">
            <div className={`rounded-2xl p-4 ring-2 ${ratingUi.cls}`}>
              <p className="flex items-center gap-2 text-xl font-extrabold">
                <ratingUi.icon /> {t(ratingUi.key)}
              </p>
              <p className="mt-1 text-lg">{chosen.feedback}</p>
              <ListenButton
                id={`feedback-${scenario.id}`}
                text={[t(ratingUi.key), chosen.feedback, 'Things to notice:', ...scenario.warningSigns, 'Remember:', scenario.keyLesson].join('. ')}
                className="mt-3"
              />
              <p className="mt-2 font-bold">
                {outcome.firstTime
                  ? outcome.points > 0
                    ? `+${outcome.points} points`
                    : 'No points this time — but now you know what to look for.'
                  : 'Practice round — points are given on your first answer only.'}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4 ring-1 ring-navy-100">
              <p className="flex items-center gap-2 text-lg font-extrabold">
                <AlertTriangle className="text-sun-600" /> {t('identify.warningSigns')}
              </p>
              <ul className="mt-2 space-y-1.5">
                {scenario.warningSigns.map((w) => (
                  <li key={w} className="flex gap-2 text-lg text-navy-800">
                    <span aria-hidden="true">•</span> {w}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-navy-800 p-4 text-white">
              <p className="text-sm font-bold uppercase tracking-wide text-sun-300">{t('identify.keyLesson')}</p>
              <p className="mt-1 text-lg font-semibold">{scenario.keyLesson}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button className="btn-teal text-lg" onClick={next} data-testid="scenario-next">
                {t('identify.next')} <ChevronRight />
              </button>
              <button className="btn-outline" onClick={() => goTo(idx)}>
                <RotateCcw size={20} /> {t('identify.tryAgain')}
              </button>
            </div>
          </section>
        )}
      </article>

      <Link to="/report" className="card mt-4 flex items-center gap-3 hover:ring-2 hover:ring-teal-200">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sun-100 text-sun-700">
          <Flag />
        </span>
        <span className="flex-1">
          <span className="block text-lg font-extrabold">{t('report.title')}</span>
          <span className="block text-navy-600">{t('report.subtitle')}</span>
        </span>
        <ChevronRight className="text-navy-300" />
      </Link>
    </div>
  );
}
