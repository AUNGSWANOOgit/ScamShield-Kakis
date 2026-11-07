import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AVATARS } from '../data/avatars';
import { Avatar } from '../components/Avatar';
import { TextSizePicker } from './ProfilePage';

export function OnboardingPage() {
  const { t, actions } = useApp();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [avatarId, setAvatarId] = useState(AVATARS[0].id);
  const [touched, setTouched] = useState(false);
  const valid = nickname.trim().length >= 2;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    actions.createProfile(nickname, avatarId);
    navigate('/home');
  };

  return (
    <div className="pt-safe min-h-screen bg-[#f4f7fb]">
      <div className="mx-auto max-w-xl px-4 pb-12 pt-4">
        <button className="btn-ghost -ml-3" onClick={() => navigate('/')}>
          <ChevronLeft /> {t('common.back')}
        </button>
        <form onSubmit={submit} className="card mt-2 animate-floatUp">
          <h1 className="text-2xl font-extrabold">{t('onboard.title')}</h1>

          <div className="mt-5 flex justify-center">
            <Avatar id={avatarId} size={112} className="shadow-card" />
          </div>

          <label htmlFor="nickname" className="label mt-5">
            {t('onboard.nickname')}
          </label>
          <input
            id="nickname"
            className="input text-lg"
            value={nickname}
            maxLength={24}
            autoComplete="nickname"
            placeholder={t('onboard.nicknamePh')}
            onChange={(e) => setNickname(e.target.value)}
            onBlur={() => setTouched(true)}
            aria-invalid={touched && !valid}
            aria-describedby="nickname-help"
          />
          <p id="nickname-help" className={`mt-2 text-sm ${touched && !valid ? 'font-semibold text-red-700' : 'text-navy-600'}`}>
            {touched && !valid ? 'Please enter at least 2 characters.' : 'Use a nickname — not your full real name.'}
          </p>

          <fieldset className="mt-5">
            <legend className="label">{t('onboard.avatar')}</legend>
            <div className="grid grid-cols-3 gap-3">
              {AVATARS.map((a) => (
                <label
                  key={a.id}
                  className={`flex cursor-pointer flex-col items-center rounded-2xl border-2 p-2 transition ${
                    avatarId === a.id ? 'border-teal-500 bg-teal-50' : 'border-transparent bg-navy-50 hover:border-navy-200'
                  }`}
                >
                  <input type="radio" name="avatar" value={a.id} checked={avatarId === a.id} onChange={() => setAvatarId(a.id)} className="sr-only" />
                  <Avatar id={a.id} size={64} />
                  <span className="sr-only">{a.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-5">
            <p className="label">{t('common.textSize')}</p>
            <TextSizePicker />
          </div>

          <button type="submit" className="btn-sun mt-6 w-full py-4 text-xl" data-testid="onboard-go">
            {t('onboard.go')}
          </button>
          <p className="mt-4 flex items-start gap-2 text-sm text-navy-600">
            <ShieldCheck size={20} className="shrink-0 text-teal-600" /> {t('onboard.privacy')}
          </p>
        </form>
      </div>
    </div>
  );
}
