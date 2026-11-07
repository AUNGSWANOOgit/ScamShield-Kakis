import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, BookOpen, CheckCircle2, CircleHelp, Flame, Gift, ScanSearch, TrendingUp, Users, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader, ProgressBar, ProgressRing } from '../components/ui';
import { LESSONS } from '../data/lessons';
import { STICKERS, getSticker } from '../data/stickers';
import { getGroup } from '../data/community';
import {
  groupContribution,
  lessonsCompleted,
  pointsByDay,
  quizStats,
  scenarioStats,
  streak,
  totalPoints,
} from '../services/selectors';
import { formatDay, isSameDay } from '../utils/time';
import { StickerImage } from '../components/StickerImage';

export function ProgressPage() {
  const { state, now, t } = useApp();
  const pts = totalPoints(state);
  const quiz = quizStats(state);
  const sc = scenarioStats(state);
  const group = getGroup(state.community.groupId);
  const contribution = group ? groupContribution(state, group.id) : 0;
  const unlocked = STICKERS.filter((s) => state.stickers[s.id]);

  const badges = [
    { label: 'First lesson', done: lessonsCompleted(state) >= 1, icon: BookOpen },
    { label: 'All lessons', done: lessonsCompleted(state) === LESSONS.length, icon: Award },
    { label: '5 safe choices', done: sc.safe >= 5, icon: ScanSearch },
    { label: '3-day streak', done: streak(state, now) >= 3, icon: Flame },
    { label: 'Joined a group', done: Boolean(group), icon: Users },
    { label: '100 points', done: pts >= 100, icon: TrendingUp },
  ];

  return (
    <div>
      <PageHeader title={t('progress.title')} subtitle={t('progress.subtitle')} icon={<TrendingUp />} />

      <section className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <Tile label="Total points" value={pts} icon={<span aria-hidden="true">⭐</span>} />
        <Tile label={t('home.streak')} value={`${streak(state, now)} days`} icon={<Flame className="text-sun-600" />} />
        <Tile label={t('home.lessons')} value={`${lessonsCompleted(state)}/${LESSONS.length}`} icon={<BookOpen className="text-navy-600" />} />
        <Tile label={t('home.stickers')} value={`${unlocked.length}/${STICKERS.length}`} icon={<Gift className="text-teal-600" />} />
        <Tile label="Identify tried" value={`${sc.tried}/${sc.total}`} icon={<ScanSearch className="text-navy-600" />} />
        <Tile label="Group contribution" value={group ? `${contribution} pts` : '—'} icon={<Users className="text-teal-600" />} />
      </section>

      <PointsChart />

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <section className="card">
          <h2 className="text-xl font-extrabold">Quiz accuracy</h2>
          <p className="text-sm text-navy-600">Lesson quiz questions, first attempt</p>
          <div className="mt-4 flex items-center gap-5">
            <ProgressRing value={quiz.accuracy} size={110} label={`Quiz accuracy ${quiz.accuracy}%`}>
              <span className="text-2xl font-extrabold">{quiz.answered ? `${quiz.accuracy}%` : '—'}</span>
            </ProgressRing>
            <p className="text-lg text-navy-700">
              {quiz.answered ? (
                <>
                  <strong>{quiz.correct}</strong> of <strong>{quiz.answered}</strong> correct
                </>
              ) : (
                'Complete a lesson to see your score.'
              )}
            </p>
          </div>
        </section>

        <section className="card">
          <h2 className="text-xl font-extrabold">Identify decisions</h2>
          <p className="text-sm text-navy-600">Your first answer to each challenge</p>
          <ul className="mt-4 space-y-3">
            <DecisionRow icon={<CheckCircle2 className="text-teal-600" />} label="Safe" value={sc.safe} total={sc.tried} color="bg-teal-500" />
            <DecisionRow icon={<CircleHelp className="text-sun-600" />} label="Okay" value={sc.okay} total={sc.tried} color="bg-sun-400" />
            <DecisionRow icon={<XCircle className="text-red-600" />} label="Risky" value={sc.unsafe} total={sc.tried} color="bg-red-500" />
          </ul>
        </section>
      </div>

      <section className="card mt-5">
        <h2 className="text-xl font-extrabold">Lessons</h2>
        <ul className="mt-3 space-y-3">
          {LESSONS.map((l) => {
            const p = state.lessons[l.id];
            const score = p ? Object.values(p.firstAttempt).filter(Boolean).length : 0;
            return (
              <li key={l.id} className="flex items-center gap-3">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${p?.completed ? 'bg-teal-600 text-white' : 'bg-navy-100 text-navy-600'}`}>
                  {p?.completed ? <CheckCircle2 size={20} /> : l.number}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-bold">{l.title}</span>
                  <span className="block text-sm text-navy-600">
                    {p?.completed ? `Quiz ${score}/${l.quiz.length} · completed ${p.timesCompleted}×` : 'Not started'}
                  </span>
                </span>
                {!p?.completed && (
                  <Link to={`/learn/${l.id}`} className="btn-outline min-h-[2.75rem] px-3 py-1 text-sm">
                    Start
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="card mt-5">
        <h2 className="text-xl font-extrabold">Achievement badges</h2>
        <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {badges.map(({ label, done, icon: Icon }) => (
            <li key={label} className={`flex items-center gap-2 rounded-2xl p-3 ${done ? 'bg-teal-50 text-teal-900' : 'bg-navy-50 text-navy-500'}`}>
              <Icon size={22} />
              <span className="font-bold">{label}</span>
              <span className="sr-only">{done ? 'earned' : 'not yet earned'}</span>
              {done && <CheckCircle2 size={18} className="ml-auto text-teal-600" aria-hidden="true" />}
            </li>
          ))}
        </ul>
      </section>

      <section className="card mt-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold">Stickers collected</h2>
          <Link to="/rewards" className="font-bold text-teal-700 underline underline-offset-4">
            {t('rewards.viewCollection')}
          </Link>
        </div>
        {unlocked.length ? (
          <ul className="mt-3 flex flex-wrap gap-2">
            {unlocked.map((s) => (
              <li key={s.id}>
                <StickerImage sticker={getSticker(s.id)!} className="h-16 w-16" />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-navy-600">No stickers yet — finish a lesson to earn your first one.</p>
        )}
      </section>
    </div>
  );
}

function Tile({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="card p-4">
      <p className="flex items-center gap-1.5 text-sm font-semibold text-navy-600">
        {icon} {label}
      </p>
      <p className="mt-1 text-2xl font-extrabold">{value}</p>
    </div>
  );
}

function DecisionRow({ icon, label, value, total, color }: { icon: React.ReactNode; label: string; value: number; total: number; color: string }) {
  return (
    <li>
      <div className="flex items-center justify-between font-semibold">
        <span className="flex items-center gap-2">
          {icon} {label}
        </span>
        <span>{value}</span>
      </div>
      <ProgressBar value={total ? (value / total) * 100 : 0} color={color} className="mt-1" label={`${label}: ${value}`} />
    </li>
  );
}

/** Single-series bar chart: points per day, last 7 days. Tap/hover a bar for its value; table view for screen readers. */
function PointsChart() {
  const { state, now } = useApp();
  const data = pointsByDay(state, now, 7);
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(30, ...data.map((d) => d.points));
  const W = 560;
  const H = 200;
  const pad = { l: 8, r: 8, t: 28, b: 30 };
  const bw = (W - pad.l - pad.r) / data.length;
  const barW = Math.min(44, bw * 0.55);
  const y = (v: number) => pad.t + (H - pad.t - pad.b) * (1 - v / max);
  const peak = data.reduce((m, d, i) => (d.points > data[m].points ? i : m), 0);
  const weekTotal = data.reduce((s, d) => s + d.points, 0);

  return (
    <section className="card mt-5">
      <h2 className="text-xl font-extrabold">Points earned — last 7 days</h2>
      <p className="text-sm text-navy-600">
        {weekTotal} points this period. Tap a bar to see the day&rsquo;s total.
      </p>
      <div className="relative mt-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Bar chart of points per day. Total ${weekTotal} points.`}>
          <line x1={pad.l} x2={W - pad.r} y1={y(0)} y2={y(0)} stroke="#b3c7ea" strokeWidth="1" />
          {data.map((d, i) => {
            const cx = pad.l + bw * i + bw / 2;
            const h = y(0) - y(d.points);
            const today = isSameDay(d.date, now);
            const r = Math.min(4, h / 2);
            const x0 = cx - barW / 2;
            const top = y(d.points);
            const showLabel = d.points > 0 && (i === peak || today || active === i);
            return (
              <g key={i}>
                {d.points > 0 && (
                  <path
                    d={`M${x0} ${y(0)} V${top + r} Q${x0} ${top} ${x0 + r} ${top} H${x0 + barW - r} Q${x0 + barW} ${top} ${x0 + barW} ${top + r} V${y(0)} Z`}
                    fill={active === i ? '#0e8076' : '#159f90'}
                  />
                )}
                {showLabel && (
                  <text x={cx} y={top - 8} textAnchor="middle" fontSize="15" fontWeight="700" fill="#13284f">
                    {d.points}
                  </text>
                )}
                <text x={cx} y={H - 8} textAnchor="middle" fontSize="14" fontWeight={today ? 800 : 500} fill={today ? '#13284f' : '#4c74bd'}>
                  {today ? 'Today' : formatDay(d.date)}
                </text>
                {/* generous hit target */}
                <rect
                  x={pad.l + bw * i}
                  y={0}
                  width={bw}
                  height={H}
                  fill="transparent"
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  onClick={() => setActive(active === i ? null : i)}
                >
                  <title>{`${formatDay(d.date)}: ${d.points} points`}</title>
                </rect>
              </g>
            );
          })}
        </svg>
        {active !== null && (
          <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 rounded-xl bg-navy-900 px-3 py-1.5 text-sm font-semibold text-white shadow-lift">
            {data[active].date.toLocaleDateString('en-SG', { weekday: 'long', day: 'numeric', month: 'short' })}: {data[active].points} pts
          </div>
        )}
      </div>
      <table className="sr-only">
        <caption>Points per day</caption>
        <thead>
          <tr>
            <th>Day</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td>{d.date.toDateString()}</td>
              <td>{d.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
