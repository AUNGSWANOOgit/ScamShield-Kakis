import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Presentation, RotateCcw, Save, Type, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AVATARS } from '../data/avatars';
import { Avatar } from '../components/Avatar';
import { ConfirmDialog, PageHeader } from '../components/ui';
import type { TextSize } from '../types';

export function TextSizePicker() {
  const { state, actions } = useApp();
  const options: { id: TextSize; label: string; px: string }[] = [
    { id: 'md', label: 'Standard', px: 'text-base' },
    { id: 'lg', label: 'Large', px: 'text-lg' },
    { id: 'xl', label: 'Extra large', px: 'text-xl' },
  ];
  return (
    <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Text size">
      {options.map((o) => (
        <button
          type="button"
          key={o.id}
          role="radio"
          aria-checked={state.settings.textSize === o.id}
          onClick={() => actions.setSettings({ textSize: o.id })}
          className={`flex min-h-[4rem] flex-col items-center justify-center rounded-2xl border-2 px-2 py-2 font-bold ${
            state.settings.textSize === o.id ? 'border-teal-500 bg-teal-50 text-teal-900' : 'border-navy-200 bg-white text-navy-700'
          }`}
          data-testid={`textsize-${o.id}`}
        >
          <span className={`${o.px} leading-none`}>Aa</span>
          <span className="mt-1 text-sm">{o.label}</span>
        </button>
      ))}
    </div>
  );
}

export function ProfilePage() {
  const { state, actions, t, pushToast, now } = useApp();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(state.profile?.nickname ?? '');
  const [avatarId, setAvatarId] = useState(state.profile?.avatarId ?? AVATARS[0].id);
  const [confirmReset, setConfirmReset] = useState(false);
  const dirty = nickname.trim() !== state.profile?.nickname || avatarId !== state.profile?.avatarId;
  const valid = nickname.trim().length >= 2;

  return (
    <div>
      <PageHeader title={t('profile.title')} icon={<User />} />

      <section className="card">
        <h2 className="text-xl font-extrabold">My profile</h2>
        <div className="mt-4 flex items-center gap-4">
          <Avatar id={avatarId} size={84} />
          <div className="min-w-0 flex-1">
            <label htmlFor="p-nick" className="label">
              {t('onboard.nickname')}
            </label>
            <input id="p-nick" className="input" value={nickname} maxLength={24} onChange={(e) => setNickname(e.target.value)} />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-6 gap-2" role="radiogroup" aria-label={t('onboard.avatar')}>
          {AVATARS.map((a) => (
            <button
              key={a.id}
              role="radio"
              aria-checked={avatarId === a.id}
              aria-label={a.label}
              onClick={() => setAvatarId(a.id)}
              className={`flex items-center justify-center rounded-2xl p-1 ${avatarId === a.id ? 'bg-teal-100 ring-2 ring-teal-500' : 'bg-navy-50'}`}
            >
              <Avatar id={a.id} size={44} />
            </button>
          ))}
        </div>
        <button
          className="btn-primary mt-4 w-full sm:w-auto"
          disabled={!dirty || !valid}
          onClick={() => {
            actions.updateProfile(nickname, avatarId);
            pushToast({ kind: 'success', title: 'Profile saved' });
          }}
        >
          <Save /> {t('profile.save')}
        </button>
        {!valid && <p className="mt-2 text-sm font-semibold text-red-700">Please enter at least 2 characters.</p>}
      </section>

      <section className="card mt-5">
        <h2 className="flex items-center gap-2 text-xl font-extrabold">
          <Type /> Display
        </h2>
        <p className="label mt-3">{t('common.textSize')}</p>
        <TextSizePicker />
        <p className="label mt-5">{t('common.language')}</p>
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label={t('common.language')}>
          {(
            [
              ['en', 'English'],
              ['zh', '简体中文'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              role="radio"
              aria-checked={state.settings.language === id}
              onClick={() => actions.setSettings({ language: id })}
              className={`min-h-[3.5rem] rounded-2xl border-2 text-lg font-bold ${
                state.settings.language === id ? 'border-teal-500 bg-teal-50 text-teal-900' : 'border-navy-200 bg-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm text-navy-600">Chinese covers menus, buttons and headings. Lesson content is in English in this demo.</p>
      </section>

      <section className="card mt-5 border-2 border-dashed border-sun-300">
        <h2 className="flex items-center gap-2 text-xl font-extrabold">
          <Presentation /> Presenter tools
        </h2>
        <p className="mt-1 text-navy-600">For classroom demonstrations. These only change data in this browser.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <button
            className="btn-sun"
            onClick={() => {
              actions.startGuidedDemo(true);
              navigate('/home');
            }}
          >
            <Presentation /> Start guided demo (fresh data)
          </button>
          <button
            className="btn-outline"
            onClick={() => {
              actions.setSettings({ dayOffset: state.settings.dayOffset + 1 });
              pushToast({ kind: 'info', title: 'Simulated: next day', detail: 'Daily challenge has reset.' });
            }}
          >
            <CalendarDays /> Simulate next day
          </button>
        </div>
        {state.settings.dayOffset > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-3 rounded-2xl bg-sun-50 p-3">
            <p className="flex-1 text-navy-800">
              Simulated date: <strong>{now.toLocaleDateString('en-SG', { weekday: 'long', day: 'numeric', month: 'short' })}</strong> (+
              {state.settings.dayOffset} day{state.settings.dayOffset > 1 ? 's' : ''})
            </p>
            <button className="btn-ghost min-h-[2.75rem] py-1" onClick={() => actions.setSettings({ dayOffset: 0 })}>
              Back to today
            </button>
          </div>
        )}
      </section>

      <section className="card mt-5">
        <h2 className="flex items-center gap-2 text-xl font-extrabold">
          <RotateCcw /> {t('profile.reset')}
        </h2>
        <p className="mt-1 text-navy-600">Clears your profile, points, stickers, group and demo reports from this device.</p>
        <button className="btn mt-4 w-full bg-red-600 text-white hover:bg-red-700 sm:w-auto" onClick={() => setConfirmReset(true)} data-testid="reset-demo">
          <RotateCcw /> {t('profile.reset')}
        </button>
      </section>

      <ConfirmDialog
        open={confirmReset}
        title={t('profile.reset')}
        message={t('profile.resetConfirm')}
        confirmLabel={t('profile.reset')}
        cancelLabel={t('common.cancel')}
        danger
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          setConfirmReset(false);
          actions.resetDemo();
          navigate('/', { replace: true });
        }}
      />
    </div>
  );
}
