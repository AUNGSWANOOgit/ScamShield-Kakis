import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle2, ChevronRight, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LESSONS } from '../data/lessons';
import { PageHeader, ProgressBar } from '../components/ui';
import { LessonIllustration } from '../components/Illustration';
import { lessonsCompleted } from '../services/selectors';
import { POINTS } from '../services/scoring';

const COLOR: Record<string, string> = {
  teal: 'from-teal-50 to-white',
  navy: 'from-navy-50 to-white',
  sun: 'from-sun-50 to-white',
};

export function LearnPage() {
  const { state, t, lang } = useApp();
  const done = lessonsCompleted(state);
  return (
    <div>
      <PageHeader title={t('learn.title')} subtitle={t('learn.subtitle')} icon={<BookOpen />} />
      <div className="card mb-5 flex items-center gap-4">
        <div className="flex-1">
          <p className="font-bold">
            {done}/{LESSONS.length} {t('learn.completed').toLowerCase()}
          </p>
          <ProgressBar value={(done / LESSONS.length) * 100} className="mt-2" label="Lessons completed" />
        </div>
        <p className="max-w-[11rem] text-sm text-navy-600">
          +{POINTS.LESSON_COMPLETE} per lesson, +{POINTS.QUIZ_CORRECT} per correct quiz answer (first time).
        </p>
      </div>
      {lang === 'zh' && (
        <p className="mb-4 rounded-2xl bg-sun-50 p-3 text-navy-700 ring-1 ring-sun-200">本演示的课程内容目前仅提供英文版。</p>
      )}
      <ul className="space-y-4">
        {LESSONS.map((l) => {
          const p = state.lessons[l.id];
          return (
            <li key={l.id} className={`card bg-gradient-to-br ${COLOR[l.color]} p-0`}>
              <div className="grid gap-0 sm:grid-cols-[13rem_1fr]">
                <div className="flex items-center justify-center p-3 sm:p-4">
                  <LessonIllustration name={l.cards[0].illustration} className="h-32" />
                </div>
                <div className="p-5 pt-0 sm:pt-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="chip bg-white text-navy-700 ring-1 ring-navy-100">Lesson {l.number}</span>
                    <span className="chip bg-white text-navy-600 ring-1 ring-navy-100">
                      <Clock size={16} /> {l.minutes} min
                    </span>
                    {p?.completed && (
                      <span className="chip bg-teal-100 text-teal-800">
                        <CheckCircle2 size={16} /> {t('learn.completed')}
                      </span>
                    )}
                  </div>
                  <h2 className="mt-2 text-xl font-extrabold">{lang === 'zh' ? `${l.zhTitle} · ${l.title}` : l.title}</h2>
                  <p className="mt-1 text-navy-600">{l.summary}</p>
                  {p?.completed && (
                    <p className="mt-2 text-sm font-semibold text-navy-600">
                      First quiz score: {Object.values(p.firstAttempt).filter(Boolean).length}/{l.quiz.length} · Completed {p.timesCompleted}×
                    </p>
                  )}
                  <Link
                    to={`/learn/${l.id}`}
                    className={`${p?.completed ? 'btn-outline' : 'btn-teal'} mt-4 w-full sm:w-auto`}
                    data-demo={`lesson-${l.id}`}
                    data-testid={`start-${l.id}`}
                  >
                    {p?.completed ? t('learn.review') : t('learn.start')} <ChevronRight />
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
