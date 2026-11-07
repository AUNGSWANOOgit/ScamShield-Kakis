import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, Gift, Presentation, ScanSearch, UserRound } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HeroIllustration } from '../components/Illustration';
import { LanguageToggle, TextSizeButton } from '../components/Layout';

export function WelcomePage() {
  const { t, actions } = useApp();
  const navigate = useNavigate();

  const features = [
    { icon: BookOpen, title: t('welcome.learn'), desc: t('welcome.learnDesc'), color: 'bg-teal-100 text-teal-700' },
    { icon: ScanSearch, title: t('welcome.practise'), desc: t('welcome.practiseDesc'), color: 'bg-navy-100 text-navy-700' },
    { icon: Gift, title: t('welcome.earn'), desc: t('welcome.earnDesc'), color: 'bg-sun-100 text-sun-700' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-800 via-navy-800 to-[#f4f7fb] to-[62%]">
      <div className="pt-safe mx-auto max-w-5xl px-4 pb-10 sm:px-6">
        <div className="flex h-16 items-center gap-2 text-white">
          <img src="./favicon.svg" alt="" className="h-10 w-10" />
          <span className="text-lg font-extrabold">{t('app.name')}</span>
          <TextSizeButton className="ml-auto" />
          <LanguageToggle />
        </div>

        <section className="grid items-center gap-6 pt-4 md:grid-cols-2 md:pt-10">
          <div className="animate-floatUp text-white">
            <h1 className="text-[2.1rem] font-extrabold leading-[1.1] sm:text-5xl">{t('welcome.headline')}</h1>
            <p className="mt-4 text-xl text-navy-100">{t('welcome.subtitle')}</p>
            <p className="mt-3 text-lg text-navy-200">{t('welcome.intro')}</p>
          </div>
          <HeroIllustration className="mx-auto w-full max-w-sm drop-shadow-xl md:max-w-md" />
        </section>

        <section className="mt-2 grid gap-3 sm:mx-auto sm:max-w-md md:mx-0 md:max-w-none md:grid-cols-2">
          <button className="btn-sun w-full py-4 text-xl" onClick={() => navigate('/onboarding')} data-testid="start-learning">
            {t('welcome.start')}
          </button>
          <button
            className="btn-outline w-full py-4 text-xl"
            onClick={() => {
              actions.useDemoProfile();
              navigate('/home');
            }}
            data-testid="demo-user"
          >
            <UserRound /> {t('welcome.demo')}
          </button>
        </section>

        <section className="mt-6 grid gap-3 md:grid-cols-3">
          {features.map(({ icon: Icon, title, desc, color }, i) => (
            <div key={title} className="card flex items-start gap-4 animate-floatUp" style={{ animationDelay: `${i * 80}ms` }}>
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${color}`}>
                <Icon size={30} />
              </div>
              <div>
                <h2 className="text-xl font-extrabold">{title}</h2>
                <p className="mt-1 text-navy-600">{desc}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-6 flex flex-col items-center gap-3 text-center">
          <button
            className="flex min-h-[3rem] items-center gap-2 rounded-full border-2 border-dashed border-sun-400 bg-sun-50 px-5 font-bold text-sun-800 hover:bg-sun-100"
            onClick={() => {
              actions.startGuidedDemo(true);
              navigate('/home');
            }}
            data-testid="welcome-presentation-demo"
          >
            <Presentation size={20} /> {t('demo.button')}
          </button>
          <Link to="/about-project" className="min-h-[3rem] px-3 py-3 font-semibold text-navy-700 underline underline-offset-4">
            {t('nav.about')}
          </Link>
          <p className="max-w-lg text-sm text-navy-600">{t('welcome.disclaimer')}</p>
        </section>
      </div>
    </div>
  );
}
