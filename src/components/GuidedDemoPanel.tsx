import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, ChevronDown, ChevronUp, Info, Presentation, RotateCcw, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEMO_STEPS } from '../data/demoSteps';
import { ProgressBar, ConfirmDialog } from './ui';

/**
 * Guided Presentation Demo panel.
 * - Shows the 7-step journey; the presenter performs every action themselves.
 * - Steps tick automatically when the real action happens (no fake/auto-played interactions).
 * - Highlights the next relevant control with a pulsing ring.
 */
export function GuidedDemoPanel() {
  const { state, actions, t } = useApp();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [showWhy, setShowWhy] = useState(false);
  const [confirmRestart, setConfirmRestart] = useState(false);
  const gd = state.guidedDemo;
  const current = DEMO_STEPS.find((s) => !gd.completed[s.id]);
  const doneCount = DEMO_STEPS.filter((s) => gd.completed[s.id]).length;
  const currentIndex = current ? DEMO_STEPS.indexOf(current) : DEMO_STEPS.length;

  // Visit-based steps complete when the presenter navigates to the page.
  useEffect(() => {
    if (current?.visit && pathname === current.visit) {
      const id = window.setTimeout(() => actions.markDemoStep(current.id), 700);
      return () => window.clearTimeout(id);
    }
  }, [current, pathname, actions]);

  // Pulse-highlight the element for the current step.
  useEffect(() => {
    if (!current?.target) return;
    const apply = () => {
      document.querySelectorAll('.demo-highlight').forEach((el) => {
        if (el.getAttribute('data-demo') !== current.target) el.classList.remove('demo-highlight');
      });
      document.querySelectorAll(`[data-demo="${current.target}"]`).forEach((el) => el.classList.add('demo-highlight'));
    };
    apply();
    const id = window.setInterval(apply, 700);
    return () => {
      window.clearInterval(id);
      document.querySelectorAll('.demo-highlight').forEach((el) => el.classList.remove('demo-highlight'));
    };
  }, [current, pathname]);

  useEffect(() => setShowWhy(false), [current?.id]);

  const minimized = gd.minimized;

  return (
    <>
      <aside
        className="demo-panel-pos fixed inset-x-2 z-50 rounded-3xl border-2 border-sun-300 bg-white shadow-lift lg:inset-x-auto lg:right-6 lg:w-[23rem]"
        aria-label={t('demo.title')}
        data-testid="guided-demo"
      >
        <div className={`flex items-center gap-2 bg-sun-100 px-3 py-2 ${minimized ? 'rounded-3xl' : 'rounded-t-3xl'}`}>
          <button
            className="flex min-w-0 flex-1 items-center gap-2 text-left"
            onClick={() => actions.setGuidedMinimized(!minimized)}
            aria-expanded={!minimized}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sun-400 text-sm font-extrabold text-navy-950">
              {current ? `${currentIndex + 1}/${DEMO_STEPS.length}` : <Check size={18} />}
            </span>
            <span className="min-w-0">
              <span className="hidden items-center gap-1 text-xs font-bold uppercase tracking-wide text-sun-800 sm:flex">
                <Presentation size={14} /> {t('demo.title')}
              </span>
              <span className="line-clamp-2 text-sm font-extrabold leading-tight text-navy-900">{current ? current.title : 'Demo complete 🎉'}</span>
            </span>
          </button>
          {current && pathname !== current.route && (
            <button
              className="flex h-11 shrink-0 items-center whitespace-nowrap rounded-full bg-sun-400 px-3 text-sm font-extrabold text-navy-950 hover:bg-sun-300"
              onClick={() => navigate(current.route)}
              data-testid="demo-go"
            >
              {t('demo.goThere')}
            </button>
          )}
          <button
            className="flex h-11 w-9 shrink-0 items-center justify-center rounded-full hover:bg-sun-200"
            onClick={() => actions.setGuidedMinimized(!minimized)}
            aria-label={minimized ? 'Expand guided demo' : 'Minimise guided demo'}
          >
            {minimized ? <ChevronUp /> : <ChevronDown />}
          </button>
          <button
            className="flex h-11 w-9 shrink-0 items-center justify-center rounded-full hover:bg-sun-200"
            onClick={actions.stopGuidedDemo}
            aria-label={t('demo.exit')}
          >
            <X />
          </button>
        </div>

        {!minimized && (
          <div className="max-h-[40vh] overflow-y-auto p-3 lg:max-h-[60vh] lg:p-4" style={{ maxHeight: undefined }}>
            <ProgressBar value={(doneCount / DEMO_STEPS.length) * 100} color="bg-sun-400" label="Guided demo progress" height="h-2" />

            {current ? (
              <div className="mt-3 rounded-2xl bg-navy-50 p-3">
                <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Step {currentIndex + 1}</p>
                <p className="text-navy-800">{current.instruction}</p>
                {showWhy && (
                  <p className="mt-2 rounded-xl bg-white p-2 text-sm text-navy-700 ring-1 ring-navy-100">
                    <strong>What this demonstrates: </strong>
                    {current.demonstrates}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap gap-2">
                  <button className="btn-ghost min-h-[2.75rem] px-3 py-2 text-sm" onClick={() => setShowWhy((v) => !v)} aria-expanded={showWhy}>
                    <Info size={18} /> Why this matters
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-3 rounded-2xl bg-teal-50 p-3 text-center">
                <p className="text-lg font-extrabold text-teal-800">Demo complete 🎉</p>
                <p className="text-navy-700">The rest of the app is free to explore.</p>
              </div>
            )}

            <ol className="mt-3 hidden space-y-1 lg:block">
              {DEMO_STEPS.map((s, i) => {
                const done = Boolean(gd.completed[s.id]);
                const isCurrent = s.id === current?.id;
                return (
                  <li key={s.id} className={`flex items-center gap-2 rounded-xl px-2 py-1 ${isCurrent ? 'bg-sun-50' : ''}`}>
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        done ? 'bg-teal-600 text-white' : isCurrent ? 'bg-sun-400 text-navy-950' : 'bg-navy-100 text-navy-600'
                      }`}
                    >
                      {done ? <Check size={16} /> : i + 1}
                    </span>
                    <span className={`text-sm ${done ? 'text-navy-500 line-through' : 'font-semibold text-navy-800'}`}>{s.title}</span>
                  </li>
                );
              })}
            </ol>

            <button className="btn-outline mt-3 min-h-[2.75rem] w-full py-2 text-sm" onClick={() => setConfirmRestart(true)}>
              <RotateCcw size={18} /> {t('demo.restart')}
            </button>
          </div>
        )}
      </aside>

      <ConfirmDialog
        open={confirmRestart}
        title="Restart the guided demo?"
        message="This reloads the fresh 'Auntie Mary' demo profile (70 points, Lesson 1 done, Good Morning Monday still locked) and restarts the 7 steps."
        confirmLabel="Restart with fresh demo data"
        cancelLabel={t('common.cancel')}
        onCancel={() => setConfirmRestart(false)}
        onConfirm={() => {
          setConfirmRestart(false);
          actions.startGuidedDemo(true);
          navigate('/home');
        }}
      />
    </>
  );
}
