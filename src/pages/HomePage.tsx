import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HelpGuide } from '../components/HelpGuide';
import { BookOpen, Check, ChevronRight, CircleHelp, Flag, Flame, Gift, Info, ScanSearch, Sparkles, TrendingUp, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Avatar } from '../components/Avatar';
import { ProgressBar } from '../components/ui';
import { StickerImage } from '../components/StickerImage';
import {
  dailyStatus,
  lessonsCompleted,
  milestoneInfo,
  nextLesson,
  streak,
  totalPoints,
  groupTotal,
  weeklyProgress,
} from '../services/selectors';
import { DAILY_STICKER_ORDER, STICKERS, getSticker } from '../data/stickers';
import { LESSONS } from '../data/lessons';
import { getGroup } from '../data/community';
import { greetingKey } from '../utils/time';

export function HomePage() {
  const { state, now, t, actions } = useApp();
  const navigate = useNavigate();
  // Show the simple guide automatically the first time; reopen any time from the help button.
  const [helpOpen, setHelpOpen] = useState(!state.settings.seenHelp);
  const closeHelp = () => {
    setHelpOpen(false);
    if (!state.settings.seenHelp) actions.setSettings({ seenHelp: true });
  };
  const pts = totalPoints(state);
  const daily = dailyStatus(state, now);
  const next = nextLesson(state);
  const group = getGroup(state.community.groupId);
  const stickersUnlocked = Object.keys(state.stickers).length;
  const nextDailySticker = getSticker(DAILY_STICKER_ORDER[Math.min(daily.totalCompleted, DAILY_STICKER_ORDER.length - 1)]);
  const allDailyDone = daily.totalCompleted >= DAILY_STICKER_ORDER.length;
  const weekly = weeklyProgress(state, now);
  const nextWeekly = weekly.find((w) => !w.completedAt) ?? weekly[0];
  const gTotal = group ? groupTotal(state, group) : 0;
  const ms = group ? milestoneInfo(gTotal, group.milestones) : null;

  const tiles = [
    { to: '/learn', icon: BookOpen, title: t('nav.learn'), desc: t('home.learnDesc'), cls: 'bg-teal-600 text-white', demo: 'tile-learn' },
    { to: '/identify', icon: ScanSearch, title: `${t('nav.identify')} & ${t('nav.report')}`, desc: t('home.identifyDesc'), cls: 'bg-navy-800 text-white', demo: 'tile-identify' },
    { to: '/community', icon: Users, title: t('nav.community'), desc: t('home.communityDesc'), cls: 'bg-white text-navy-900 ring-2 ring-navy-100', demo: 'tile-community' },
    { to: '/rewards', icon: Gift, title: t('nav.rewards'), desc: t('home.rewardsDesc'), cls: 'bg-sun-300 text-navy-950', demo: 'tile-rewards' },
  ];

  return (
    <div className="space-y-5">
      {/* Greeting & points */}
      <section className="card animate-floatUp bg-gradient-to-br from-white to-teal-50" data-demo="points-card">
        <div className="flex items-center gap-4">
          <Avatar id={state.profile?.avatarId ?? 'auntie'} size={68} />
          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold leading-tight sm:text-3xl" data-testid="greeting">
              {t(greetingKey(now))}, {state.profile?.nickname}!
            </h1>
            <p className="mt-1 text-lg font-semibold text-teal-700" data-testid="points-earned">
              {t('home.pointsEarned', { n: pts })}
            </p>
          </div>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat icon={<Flame className="text-sun-600" />} label={t('home.streak')} value={`${streak(state, now)}`} />
          <Stat icon={<Gift className="text-teal-600" />} label={t('home.stickers')} value={`${stickersUnlocked}/${STICKERS.length}`} />
          <Stat icon={<BookOpen className="text-navy-600" />} label={t('home.lessons')} value={`${lessonsCompleted(state)}/${LESSONS.length}`} />
          <Link to="/community" className="rounded-2xl bg-white p-3 ring-1 ring-navy-100 hover:ring-teal-300">
            <dt className="flex items-center gap-1 text-sm font-semibold text-navy-600">
              <Users size={18} className="text-teal-600" /> {t('home.group')}
            </dt>
            <dd className="mt-0.5 truncate font-extrabold text-navy-900">{group ? group.area : t('home.noGroup')}</dd>
          </Link>
        </dl>
      </section>

      <button
        onClick={() => setHelpOpen(true)}
        className="flex min-h-[3.5rem] w-full items-center gap-3 rounded-3xl bg-teal-50 px-4 py-3 text-left text-lg font-bold text-teal-900 ring-1 ring-teal-200"
        data-testid="help-open"
      >
        <CircleHelp size={28} className="shrink-0" /> {t('home.help')}
        <ChevronRight className="ml-auto shrink-0" />
      </button>

      {/* Daily challenge */}
      <section className="card" data-demo="daily-card" data-testid="daily-card">
        <div className="flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold uppercase tracking-wide text-sun-700">{t('home.daily')} · +30</p>
            <h2 className="mt-1 text-xl font-extrabold">{daily.completed ? t('home.dailyDone') : t('home.dailyHint')}</h2>
          </div>
          {nextDailySticker && !allDailyDone && (
            <StickerImage sticker={nextDailySticker} locked={!daily.completed} className="h-20 w-20 shrink-0 sm:h-24 sm:w-24" />
          )}
        </div>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          <ChallengeItem done={daily.lessonDone} label={t('home.dailyStep1')} onClick={() => navigate(next ? `/learn/${next.id}` : '/learn')} />
          <ChallengeItem done={daily.scenarioDone} label={t('home.dailyStep2')} onClick={() => navigate('/identify')} />
        </ul>
        <p className="mt-3 text-sm text-navy-600">Resets every day at midnight. Lesson replays count.</p>
      </section>

      {/* Main navigation tiles */}
      <section aria-label={t('home.whatToDo')}>
        <h2 className="mb-3 text-xl font-extrabold">{t('home.whatToDo')}</h2>
        <div className="grid grid-cols-2 gap-3">
          {tiles.map(({ to, icon: Icon, title, desc, cls, demo }) => (
            <Link key={to} to={to} data-demo={demo} className={`flex min-h-[8rem] flex-col justify-between rounded-3xl p-4 shadow-card transition active:scale-[0.98] ${cls}`}>
              <Icon size={36} />
              <span>
                <span className="block text-lg font-extrabold leading-tight sm:text-xl">{title}</span>
                <span className="block text-sm opacity-80 sm:text-base">{desc}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Next lesson */}
        <section className="card flex flex-col">
          <p className="text-sm font-bold uppercase tracking-wide text-teal-700">{t('home.nextLesson')}</p>
          {next ? (
            <>
              <h2 className="mt-1 text-xl font-extrabold">
                {next.number}. {next.title}
              </h2>
              <p className="mt-1 flex-1 text-navy-600">{next.summary}</p>
              <Link to={`/learn/${next.id}`} className="btn-teal mt-4 w-full" data-demo={`lesson-${next.id}`}>
                {t('learn.start')} <ChevronRight />
              </Link>
            </>
          ) : (
            <>
              <p className="mt-1 flex-1 text-lg text-navy-700">{t('home.allLessonsDone')}</p>
              <Link to="/identify" className="btn-teal mt-4 w-full">
                {t('nav.identify')} <ChevronRight />
              </Link>
            </>
          )}
        </section>

        {/* Weekly group challenge */}
        <section className="card flex flex-col">
          <p className="text-sm font-bold uppercase tracking-wide text-navy-600">{t('home.weekly')}</p>
          {group && nextWeekly ? (
            <>
              <h2 className="mt-1 text-xl font-extrabold">{nextWeekly.title}</h2>
              <p className="mt-1 text-navy-600">{group.name}</p>
              <div className="mt-3 flex items-center gap-3">
                <ProgressBar value={nextWeekly.pct} label={nextWeekly.title} />
                <span className="shrink-0 font-bold text-navy-700">
                  {nextWeekly.current}/{nextWeekly.target}
                </span>
              </div>
              {ms?.next && (
                <p className="mt-3 text-sm text-navy-600">
                  <Sparkles size={16} className="mr-1 inline text-sun-600" />
                  {ms.remaining} points to the group&rsquo;s next milestone ({ms.next.toLocaleString()}).
                </p>
              )}
              <Link to="/community" className="btn-outline mt-4 w-full">
                {t('nav.community')} <ChevronRight />
              </Link>
            </>
          ) : (
            <>
              <p className="mt-1 flex-1 text-lg text-navy-700">Join a neighbourhood group to take part in weekly challenges together.</p>
              <Link to="/community" className="btn-outline mt-4 w-full">
                {t('home.noGroup')} <ChevronRight />
              </Link>
            </>
          )}
        </section>
      </div>

      {/* Secondary links */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SmallLink to="/report" icon={<Flag />} title={t('nav.report')} desc={t('home.reportDesc')} />
        <SmallLink to="/progress" icon={<TrendingUp />} title={t('nav.progress')} desc={`${pts} ${t('common.points')}`} />
        <SmallLink to="/about" icon={<Info />} title={t('nav.about')} desc={t('home.aboutDesc')} />
      </section>
      <HelpGuide open={helpOpen} onClose={closeHelp} />
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-3 ring-1 ring-navy-100">
      <dt className="flex items-center gap-1 text-sm font-semibold text-navy-600">
        {icon} {label}
      </dt>
      <dd className="mt-0.5 text-xl font-extrabold text-navy-900">{value}</dd>
    </div>
  );
}

function ChallengeItem({ done, label, onClick }: { done: boolean; label: string; onClick: () => void }) {
  return (
    <li>
      <button
        onClick={onClick}
        className={`flex min-h-[3.5rem] w-full items-center gap-3 rounded-2xl px-4 py-2 text-left text-lg font-bold transition ${
          done ? 'bg-teal-50 text-teal-800' : 'bg-navy-50 text-navy-800 hover:bg-navy-100'
        }`}
      >
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${done ? 'bg-teal-600 text-white' : 'border-2 border-navy-300 bg-white'}`}>
          {done && <Check size={18} />}
        </span>
        <span className="flex-1">{label}</span>
        {!done && <ChevronRight className="text-navy-500" />}
      </button>
    </li>
  );
}

function SmallLink({ to, icon, title, desc }: { to: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Link to={to} className="card flex min-h-[4.5rem] min-w-0 items-center gap-3 p-4 hover:ring-2 hover:ring-teal-200">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-navy-50 text-navy-700">{icon}</span>
      <span className="min-w-0">
        <span className="block font-extrabold">{title}</span>
        <span className="block truncate text-sm text-navy-600">{desc}</span>
      </span>
      <ChevronRight className="ml-auto shrink-0 text-navy-300" />
    </Link>
  );
}
