import { useNavigate } from 'react-router-dom';
import { Building2, CheckCircle2, ChevronLeft, FlaskConical, HeartHandshake, Info, Lightbulb, Wand2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/ui';

const LENSES = [
  {
    icon: FlaskConical,
    title: 'STEM',
    color: 'bg-teal-100 text-teal-700',
    points: ['Interactive learning exercises with instant feedback', 'Accessible, mobile-first technology (large text, high contrast, bilingual UI)', 'Safe educational simulations — no real scam content or data'],
  },
  {
    icon: Building2,
    title: 'Business / Governance',
    color: 'bg-navy-100 text-navy-700',
    points: ['Free, community-based access for seniors', 'Low-cost digital rewards (stickers) instead of costly prizes', 'Proposed partnerships (e.g. community centres) and responsible content handling'],
  },
  {
    icon: HeartHandshake,
    title: 'Social Sciences / Humanities',
    color: 'bg-sun-100 text-sun-700',
    points: ['Community participation through neighbourhood groups', 'Social motivation via shared, non-competitive goals', 'Builds on familiar habits — sending greeting images', 'Gamified habit formation with daily and weekly challenges'],
  },
];

const REAL = ['Navigation & onboarding', 'Lessons & quizzes', 'Points, streaks & achievements', 'Sticker unlocking', 'Sticker PNG download & phone sharing', 'Community group selection', 'Local progress tracking (this browser)', 'Demo reset & guided demo'];
const SIMULATED = ['Deepfake/scam verification', 'Real-world reporting to authorities', 'Other members & leaderboards (mock data)', 'Referrals & invitations', 'Community reward partnerships', 'External content moderation'];

export function AboutPage({ standalone = false }: { standalone?: boolean }) {
  const { t } = useApp();
  const navigate = useNavigate();
  const body = (
    <div>
      {standalone && (
        <button className="btn-ghost -ml-3 mb-2" onClick={() => navigate('/')}>
          <ChevronLeft /> {t('common.back')}
        </button>
      )}
      <PageHeader title={t('nav.about')} subtitle="Community-Based Deepfake Awareness Platform for Seniors — university innovation project demo." icon={<Info />} />

      <blockquote className="card border-l-8 border-sun-400 text-xl font-semibold leading-relaxed text-navy-800">
        &ldquo;Our platform combines repeated learning, community participation and meaningful digital rewards to encourage sustained engagement with
        online safety.&rdquo;
      </blockquote>

      <section className="mt-5 grid gap-4 md:grid-cols-3">
        {LENSES.map(({ icon: Icon, title, color, points }) => (
          <div key={title} className="card">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${color}`}>
              <Icon />
            </div>
            <h2 className="mt-3 text-xl font-extrabold">{title}</h2>
            <ul className="mt-2 space-y-2">
              {points.map((p) => (
                <li key={p} className="flex gap-2 text-navy-700">
                  <CheckCircle2 size={18} className="mt-1 shrink-0 text-teal-600" /> {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="card mt-5 bg-sun-50 ring-1 ring-sun-200">
        <h2 className="flex items-center gap-2 text-xl font-extrabold">
          <Lightbulb className="text-sun-600" /> Evidence &amp; next steps
        </h2>
        <p className="mt-2 text-lg text-navy-800">
          This is a prototype. We do <strong>not</strong> claim the platform has been proven effective. Its impact on seniors&rsquo; knowledge,
          confidence and safe behaviour would need to be evaluated through a pilot with seniors — for example, comparing scam-awareness
          before and after several weeks of use, alongside engagement and accessibility feedback.
        </p>
        <p className="mt-2 text-navy-700">
          The learning goal is safe decision-making (pause, verify, report) — not perfect deepfake detection, which even experts cannot always
          achieve by eye.
        </p>
      </section>

      <section className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="card">
          <h2 className="flex items-center gap-2 text-xl font-extrabold">
            <CheckCircle2 className="text-teal-600" /> Working in this demo
          </h2>
          <ul className="mt-2 space-y-1.5 text-navy-700">
            {REAL.map((r) => (
              <li key={r}>• {r}</li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h2 className="flex items-center gap-2 text-xl font-extrabold">
            <Wand2 className="text-sun-600" /> Simulated (would need a backend)
          </h2>
          <ul className="mt-2 space-y-1.5 text-navy-700">
            {SIMULATED.map((r) => (
              <li key={r}>• {r}</li>
            ))}
          </ul>
        </div>
      </section>

      <p className="mt-5 text-center text-sm text-navy-600">
        No accounts, servers, external APIs or tracking. All progress is stored only in this browser (localStorage). All people, groups and
        messages are fictional.
      </p>
    </div>
  );
  if (!standalone) return body;
  return (
    <div className="pt-safe min-h-screen bg-[#f4f7fb]">
      <div className="mx-auto max-w-4xl px-4 pb-12 pt-4">{body}</div>
    </div>
  );
}
