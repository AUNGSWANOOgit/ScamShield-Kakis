import { useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, ChevronLeft, ChevronRight, Lightbulb, PartyPopper, X, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LESSONS, getLesson } from '../data/lessons';
import { LessonIllustration } from '../components/Illustration';
import { ConfirmDialog, ProgressBar } from '../components/ui';
import { ListenButton } from '../components/ListenButton';
import { POINTS } from '../services/scoring';

type Phase = 'cards' | 'quiz' | 'done';

export function LessonPage() {
  const { lessonId = '' } = useParams();
  // key = lessonId resets the player when moving to the next lesson.
  return <LessonPlayer key={lessonId} lessonId={lessonId} />;
}

function LessonPlayer({ lessonId }: { lessonId: string }) {
  const lesson = getLesson(lessonId);
  const { state, actions, t } = useApp();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('cards');
  const [cardIdx, setCardIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ firstTime: boolean; correct: number; earned: number } | null>(null);
  const touchX = useRef<number | null>(null);
  const [confirmExit, setConfirmExit] = useState(false);

  if (!lesson) return <Navigate to="/learn" replace />;

  const totalSteps = lesson.cards.length + lesson.quiz.length;
  const stepNow = phase === 'cards' ? cardIdx + 1 : phase === 'quiz' ? lesson.cards.length + qIdx + 1 : totalSteps;
  const card = lesson.cards[cardIdx];
  const q = lesson.quiz[qIdx];
  const nextLessonDef = LESSONS.find((l) => l.number === lesson.number + 1);

  const goCard = (dir: 1 | -1) => {
    if (dir === 1 && cardIdx === lesson.cards.length - 1) {
      setPhase('quiz');
      return;
    }
    setCardIdx((i) => Math.max(0, Math.min(lesson.cards.length - 1, i + dir)));
  };

  const finish = (finalAnswers: Record<string, string>) => {
    const firstTime = !state.lessons[lesson.id]?.completed;
    const correct = lesson.quiz.filter((qq) => finalAnswers[qq.id] === qq.correctId).length;
    const earned = firstTime ? POINTS.LESSON_COMPLETE + correct * POINTS.QUIZ_CORRECT : 0;
    actions.completeLesson(lesson.id, finalAnswers);
    setResult({ firstTime, correct, earned });
    setPhase('done');
  };

  const onCheck = () => {
    if (!selected) return;
    setAnswers((a) => ({ ...a, [q.id]: selected }));
    setChecked(true);
  };

  const onNextQuestion = () => {
    const merged = { ...answers, [q.id]: selected! };
    if (qIdx === lesson.quiz.length - 1) {
      finish(merged);
      return;
    }
    setQIdx((i) => i + 1);
    setSelected(null);
    setChecked(false);
  };

  return (
    <div className="animate-floatUp">
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => (phase === 'done' || (phase === 'cards' && cardIdx === 0) ? navigate('/learn') : setConfirmExit(true))}
          className="flex h-12 shrink-0 items-center gap-1 rounded-full bg-white px-4 font-bold text-navy-800 shadow-card"
          aria-label={t('learn.backToLessons')}
        >
          <X size={22} /> Exit
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-navy-600">
            Lesson {lesson.number}: {lesson.title}
          </p>
          <ProgressBar value={(stepNow / totalSteps) * 100} className="mt-1" label="Lesson progress" />
        </div>
      </div>

      {phase === 'cards' && (
        <section
          className="card"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > 60) goCard(dx < 0 ? 1 : -1);
          }}
          aria-live="polite"
        >
          <p className="text-sm font-bold uppercase tracking-wide text-teal-700">
            {t('learn.card')} {cardIdx + 1} {t('common.of')} {lesson.cards.length}
          </p>
          <div key={cardIdx} className="animate-floatUp">
            <LessonIllustration name={card.illustration} className="my-3" />
            <h1 className="text-2xl font-extrabold leading-snug">{card.title}</h1>
            <ListenButton
              id={`lesson-${lesson.id}-${cardIdx}`}
              text={[card.title, ...card.body, card.tip ? `Tip: ${card.tip}` : ''].join('. ')}
              className="mt-3"
            />
            <div className="mt-3 space-y-3 text-lg leading-relaxed text-navy-800">
              {card.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            {card.tip && (
              <p className="mt-4 flex gap-2 rounded-2xl bg-sun-50 p-3 text-navy-800 ring-1 ring-sun-200">
                <Lightbulb className="shrink-0 text-sun-600" /> <span>{card.tip}</span>
              </p>
            )}
          </div>
          <div className="mt-5 flex justify-center gap-2" aria-hidden="true">
            {lesson.cards.map((_, i) => (
              <span key={i} className={`h-2.5 rounded-full transition-all ${i === cardIdx ? 'w-8 bg-teal-600' : 'w-2.5 bg-navy-200'}`} />
            ))}
          </div>
          <div className="mt-5 grid grid-cols-[auto_1fr] gap-3">
            <button className="btn-outline px-4" onClick={() => goCard(-1)} disabled={cardIdx === 0} aria-label={t('common.back')}>
              <ChevronLeft />
              <span className="hidden sm:inline">{t('common.back')}</span>
            </button>
            <button className="btn-teal text-lg" onClick={() => goCard(1)} data-testid="lesson-next" data-demo="lesson-next">
              {cardIdx === lesson.cards.length - 1 ? t('learn.startQuiz') : t('common.next')} <ChevronRight />
            </button>
          </div>
        </section>
      )}

      {phase === 'quiz' && (
        <section className="card" aria-live="polite">
          <p className="text-sm font-bold uppercase tracking-wide text-sun-700">
            {t('learn.quizTime')} · {qIdx + 1} {t('common.of')} {lesson.quiz.length}
          </p>
          <h1 className="mt-2 text-xl font-extrabold leading-snug sm:text-2xl">{q.question}</h1>
          <ListenButton
            id={`quiz-${lesson.id}-${q.id}`}
            text={[q.question, ...q.options.map((o, i) => `Answer ${i + 1}: ${o.text}`), checked ? q.explanation : ''].join('. ')}
            className="mt-3"
          />
          <div className="mt-4 grid gap-3" role="radiogroup" aria-label={q.question}>
            {q.options.map((o) => {
              const isSel = selected === o.id;
              const isCorrect = o.id === q.correctId;
              let cls = 'border-navy-200 bg-white hover:border-teal-400';
              if (!checked && isSel) cls = 'border-teal-500 bg-teal-50';
              if (checked && isCorrect) cls = 'border-teal-600 bg-teal-50';
              if (checked && isSel && !isCorrect) cls = 'border-red-500 bg-red-50';
              if (checked && !isSel && !isCorrect) cls = 'border-navy-100 bg-white opacity-60';
              return (
                <button
                  key={o.id}
                  role="radio"
                  aria-checked={isSel}
                  disabled={checked}
                  onClick={() => setSelected(o.id)}
                  className={`flex min-h-[3.5rem] items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-lg font-semibold transition ${cls}`}
                  data-testid={`quiz-option-${o.id}`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${
                      isSel ? 'border-teal-600 bg-teal-600 text-white' : 'border-navy-300'
                    }`}
                  >
                    {checked && isCorrect ? <CheckCircle2 size={18} /> : isSel ? '•' : ''}
                  </span>
                  {o.text}
                </button>
              );
            })}
          </div>

          {checked && (
            <div
              className={`mt-4 animate-floatUp rounded-2xl p-4 ${selected === q.correctId ? 'bg-teal-50 ring-1 ring-teal-200' : 'bg-red-50 ring-1 ring-red-200'}`}
              role="status"
            >
              <p className="flex items-center gap-2 text-lg font-extrabold">
                {selected === q.correctId ? (
                  <>
                    <CheckCircle2 className="text-teal-600" /> {t('learn.correct')}
                  </>
                ) : (
                  <>
                    <XCircle className="text-red-600" /> {t('learn.notQuite')}
                  </>
                )}
              </p>
              <p className="mt-1 text-navy-800">{q.explanation}</p>
            </div>
          )}

          <div className="mt-5">
            {!checked ? (
              <button className="btn-teal w-full text-lg" onClick={onCheck} disabled={!selected} data-testid="quiz-check">
                {t('learn.check')}
              </button>
            ) : (
              <button className="btn-primary w-full text-lg" onClick={onNextQuestion} data-testid="quiz-next">
                {qIdx === lesson.quiz.length - 1 ? t('learn.finish') : t('common.next')} <ChevronRight />
              </button>
            )}
          </div>
        </section>
      )}

      {phase === 'done' && result && (
        <section className="card text-center" data-testid="lesson-complete">
          <div className="mx-auto flex h-20 w-20 animate-pop items-center justify-center rounded-full bg-sun-100">
            <PartyPopper size={42} className="text-sun-600" />
          </div>
          <h1 className="mt-3 text-3xl font-extrabold">{t('learn.complete')}</h1>
          <p className="mt-2 text-lg text-navy-700">
            You answered {result.correct} of {lesson.quiz.length} questions correctly.
          </p>
          {result.firstTime ? (
            <div className="mx-auto mt-4 max-w-xs rounded-2xl bg-sun-50 p-4 text-left ring-1 ring-sun-200">
              <p className="flex justify-between font-semibold">
                <span>Lesson completed</span> <span>+{POINTS.LESSON_COMPLETE}</span>
              </p>
              <p className="flex justify-between font-semibold">
                <span>Correct answers</span> <span>+{result.correct * POINTS.QUIZ_CORRECT}</span>
              </p>
              <p className="mt-2 flex justify-between border-t border-sun-200 pt-2 text-xl font-extrabold">
                <span>Total</span> <span>+{result.earned} pts</span>
              </p>
            </div>
          ) : (
            <p className="mx-auto mt-4 max-w-sm rounded-2xl bg-navy-50 p-3 text-navy-700">
              Great revision! Points are only given the first time, but replays still count towards today&rsquo;s challenge.
            </p>
          )}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {nextLessonDef && !state.lessons[nextLessonDef.id]?.completed ? (
              <button className="btn-teal" onClick={() => navigate(`/learn/${nextLessonDef.id}`, { replace: true })}>
                Next lesson <ChevronRight />
              </button>
            ) : (
              <button className="btn-teal" onClick={() => navigate('/identify')} data-demo="go-identify">
                Practise in Identify <ChevronRight />
              </button>
            )}
            <button className="btn-outline" onClick={() => navigate('/home')}>
              {t('nav.home')}
            </button>
          </div>
        </section>
      )}
      <ConfirmDialog
        open={confirmExit}
        title="Leave this lesson?"
        message="You can come back any time. This lesson will start again from the beginning."
        confirmLabel="Leave lesson"
        cancelLabel="Keep learning"
        onCancel={() => setConfirmExit(false)}
        onConfirm={() => navigate('/learn')}
      />
    </div>
  );
}
