import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { BookOpen, Flag, Gift, House, Info, Presentation, ScanSearch, TrendingUp, User, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Avatar } from './Avatar';
import { totalPoints } from '../services/selectors';
import { GuidedDemoPanel } from './GuidedDemoPanel';
import { CelebrationLayer, ToastLayer } from './Celebration';
import type { TranslationKey } from '../i18n/translations';

export const MAIN_NAV: { to: string; key: TranslationKey; short?: TranslationKey; icon: typeof House; demo?: string }[] = [
  { to: '/home', key: 'nav.home', icon: House, demo: 'nav-home' },
  { to: '/learn', key: 'nav.learn', icon: BookOpen, demo: 'nav-learn' },
  { to: '/identify', key: 'nav.identify', icon: ScanSearch, demo: 'nav-identify' },
  { to: '/community', key: 'nav.community', short: 'nav.communityShort', icon: Users, demo: 'nav-community' },
  { to: '/rewards', key: 'nav.rewards', icon: Gift, demo: 'nav-rewards' },
];

const MORE_NAV: { to: string; key: TranslationKey; icon: typeof House }[] = [
  { to: '/report', key: 'nav.report', icon: Flag },
  { to: '/progress', key: 'nav.progress', icon: TrendingUp },
  { to: '/profile', key: 'nav.profile', icon: User },
  { to: '/about', key: 'nav.about', icon: Info },
];

const SIZE_ORDER = ['md', 'lg', 'xl'] as const;
const SIZE_LABEL = { md: 'Standard', lg: 'Large', xl: 'Extra large' } as const;

/** One tap cycles text size: Standard → Large → Extra large. */
export function TextSizeButton({ className = '' }: { className?: string }) {
  const { state, actions, pushToast } = useApp();
  const cur = state.settings.textSize;
  return (
    <button
      onClick={() => {
        const next = SIZE_ORDER[(SIZE_ORDER.indexOf(cur) + 1) % SIZE_ORDER.length];
        actions.setSettings({ textSize: next });
        pushToast({ kind: 'info', title: `Text size: ${SIZE_LABEL[next]}` });
      }}
      className={`flex h-11 min-w-[2.9rem] shrink-0 items-center justify-center whitespace-nowrap rounded-full border-2 border-white/30 px-2 font-extrabold text-white hover:bg-white/10 ${className}`}
      aria-label={`Text size: ${SIZE_LABEL[cur]}. Tap to change.`}
      data-testid="textsize-button"
    >
      <span className="text-sm">A</span>
      <span className="text-lg">A</span>
    </button>
  );
}

export function LanguageToggle({ className = '' }: { className?: string }) {
  const { state, actions } = useApp();
  const zh = state.settings.language === 'zh';
  return (
    <button
      onClick={() => actions.setSettings({ language: zh ? 'en' : 'zh' })}
      className={`flex h-11 min-w-[3rem] shrink-0 items-center justify-center whitespace-nowrap rounded-full border-2 border-white/30 px-3 text-sm font-bold text-white hover:bg-white/10 ${className}`}
      aria-label={zh ? 'Switch to English' : '切换到中文 (Switch to Chinese)'}
    >
      {zh ? 'EN' : '中文'}
    </button>
  );
}

function TopBar() {
  const { state, t, actions } = useApp();
  const pts = totalPoints(state);
  return (
    <header className="pt-safe sticky top-0 z-40 bg-navy-800 text-white shadow-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-3 sm:px-5">
        <Link to="/home" className="flex min-h-[2.75rem] shrink-0 items-center gap-2" aria-label={t('app.name')}>
          <img src="./favicon.svg" alt="" className="h-10 w-10 shrink-0" />
          <span className="hidden truncate text-lg font-extrabold sm:inline">{t('app.name')}</span>
        </Link>
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          {!state.guidedDemo.active && (
            <button
              onClick={() => actions.startGuidedDemo(false)}
              className="hidden h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border-2 border-sun-300/60 px-3 text-sm font-bold text-sun-200 hover:bg-white/10 sm:flex"
              aria-label={t('demo.button')}
              title={t('demo.button')}
              data-testid="demo-button"
            >
              <Presentation size={18} />
              <span className="hidden md:inline">{t('demo.button')}</span>
              <span className="md:hidden">{t('common.demo')}</span>
            </button>
          )}
          <TextSizeButton />
          <LanguageToggle />
          <Link
            to="/progress"
            className="flex h-11 shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-sun-300 px-3 text-base font-extrabold text-navy-950"
            aria-label={`${pts} ${t('common.points')}`}
            data-testid="points-pill"
          >
            ⭐ {pts}
          </Link>
          <Link to="/profile" aria-label={t('nav.profile')} className="shrink-0 rounded-full ring-2 ring-white/40">
            <Avatar id={state.profile?.avatarId ?? 'auntie'} size={42} />
          </Link>
        </div>
      </div>
    </header>
  );
}

function BottomNav() {
  const { t } = useApp();
  return (
    <nav
      className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-navy-100 bg-white/95 backdrop-blur lg:hidden"
      aria-label="Main navigation"
    >
      <ul className="mx-auto grid max-w-xl grid-cols-5">
        {MAIN_NAV.map(({ to, key, short, icon: Icon, demo }) => (
          <li key={to}>
            <NavLink
              to={to}
              data-demo={demo}
              aria-label={t(key)}
              className={({ isActive }) =>
                `flex min-h-[4.25rem] flex-col items-center justify-center gap-0.5 px-0.5 text-[min(0.85rem,15px)] font-bold leading-tight ${
                  isActive ? 'text-teal-700' : 'text-navy-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`flex h-9 w-12 items-center justify-center rounded-full ${isActive ? 'bg-teal-100' : ''}`}>
                    <Icon size={24} strokeWidth={isActive ? 2.6 : 2.1} />
                  </span>
                  <span className="max-w-full truncate">{t(short ?? key)}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function SideNav() {
  const { t } = useApp();
  const link = ({ isActive }: { isActive: boolean }) =>
    `flex min-h-[3.25rem] items-center gap-3 rounded-2xl px-4 text-lg font-bold ${
      isActive ? 'bg-teal-100 text-teal-800' : 'text-navy-700 hover:bg-navy-50'
    }`;
  return (
    <nav className="sticky top-20 hidden w-60 shrink-0 self-start lg:block" aria-label="Main navigation">
      <ul className="space-y-1">
        {MAIN_NAV.map(({ to, key, icon: Icon, demo }) => (
          <li key={to}>
            <NavLink to={to} className={link} data-demo={demo}>
              <Icon size={24} /> {t(key)}
            </NavLink>
          </li>
        ))}
      </ul>
      <hr className="my-4 border-navy-100" />
      <ul className="space-y-1">
        {MORE_NAV.map(({ to, key, icon: Icon }) => (
          <li key={to}>
            <NavLink to={to} className={link}>
              <Icon size={22} /> {t(key)}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function AppLayout() {
  const { state, storageOk } = useApp();
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const demoActive = state.guidedDemo.active;
  return (
    <div className="min-h-screen">
      <TopBar />
      {!storageOk && (
        <div className="bg-sun-100 px-4 py-2 text-center text-sm font-semibold text-sun-900">
          This browser is blocking local storage, so progress will reset when you close the page.
        </div>
      )}
      <div
        className={`mx-auto flex max-w-6xl gap-8 px-4 pt-5 sm:px-5 lg:pt-8 ${
          demoActive && !state.guidedDemo.minimized ? 'lg:max-w-none lg:pr-[25rem]' : ''
        }`}
      >
        <SideNav />
        <main
          id="main"
          className={`min-w-0 flex-1 ${demoActive ? 'pb-48 lg:pb-12' : 'pb-32 lg:pb-12'}`}
        >
          <div className="mx-auto max-w-3xl">
            <Outlet />
          </div>
        </main>
      </div>
      <BottomNav />
      {demoActive && <GuidedDemoPanel />}
      <CelebrationLayer />
      <ToastLayer />
    </div>
  );
}
