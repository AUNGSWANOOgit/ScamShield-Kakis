import { useState } from 'react';
import { AlertTriangle, CheckCircle2, ClipboardPaste, ExternalLink, Flag, Phone, Send, ShieldAlert, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ConfirmDialog, PageHeader } from '../components/ui';
import { reportStatus } from '../services/selectors';
import { formatDateTime } from '../utils/time';
import type { ReportStatus } from '../types';

const CATEGORIES = [
  'WhatsApp / chat message',
  'SMS text message',
  'Phone or video call',
  'Social media post or advert',
  'Website or link',
  'Email',
  'Other',
];

const REASON_CHIPS = [
  'Asks for money',
  'Asks for OTP or password',
  'Urgent or threatening',
  'Unknown or new number',
  'Too good to be true',
  'Pretends to be someone I know',
  'Possible deepfake video or voice',
];

const EXAMPLES = [
  {
    content:
      'URGENT: Your bank account has been suspended due to suspicious activity. Verify your identity within 2 hours at http://secure-bank-verify.example/login or your account will be closed.',
    category: 'SMS text message',
    reason: 'Urgent or threatening. Asks me to log in through a link. Unknown sender.',
  },
  {
    content:
      'Hi Ma, this is my new number. My phone fell into the water. Can you help me pay a bill of $1,500 today? I will return tomorrow. Please don’t call, the line is bad.',
    category: 'WhatsApp / chat message',
    reason: 'Pretends to be someone I know. Asks for money. Says not to call.',
  },
];

/** Very simple, local-only check for things that look like personal data. Nothing is sent anywhere. */
function personalInfoWarnings(text: string): string[] {
  const w: string[] = [];
  if (/\b[STFGM]\d{7}[A-Z]\b/i.test(text)) w.push('an NRIC/FIN number');
  if (/\b(?:\d[ -]?){13,19}\b/.test(text)) w.push('a card or account number');
  if (/(^|[^\d$])[689]\d{3}[ -]?\d{4}(?!\d)/.test(text)) w.push('a phone number');
  if (/[\w.+-]+@[\w-]+\.[\w.]+/.test(text)) w.push('an email address');
  return w;
}

const STATUS_STYLE: Record<ReportStatus, string> = {
  Submitted: 'bg-navy-100 text-navy-800',
  'Under Review': 'bg-sun-100 text-sun-800',
  Reviewed: 'bg-teal-100 text-teal-800',
};

const NEXT_STATUS: Record<ReportStatus, ReportStatus> = {
  Submitted: 'Under Review',
  'Under Review': 'Reviewed',
  Reviewed: 'Reviewed',
};

export function ReportPage() {
  const { state, now, actions, t } = useApp();
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [exampleIdx, setExampleIdx] = useState(0);
  const [confirmClear, setConfirmClear] = useState(false);

  const piWarnings = personalInfoWarnings(content + ' ' + reason);

  const loadExample = () => {
    const ex = EXAMPLES[exampleIdx % EXAMPLES.length];
    setContent(ex.content);
    setCategory(ex.category);
    setReason(ex.reason);
    setExampleIdx((i) => i + 1);
    setErrors([]);
    setSubmitted(false);
  };

  const addReason = (r: string) => setReason((prev) => (prev.includes(r) ? prev : prev ? `${prev.replace(/\.?\s*$/, '')}. ${r}.` : `${r}.`));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: string[] = [];
    if (content.trim().length < 5) errs.push('Please paste the suspicious message or link.');
    if (!category) errs.push('Please choose what kind of content it is.');
    if (reason.trim().length < 3) errs.push('Please tell us briefly why it seems suspicious.');
    if (piWarnings.length) errs.push(`Please remove what looks like ${piWarnings.join(', ')} before submitting.`);
    setErrors(errs);
    if (errs.length) return;
    actions.submitReport({ content: content.trim(), category, reason: reason.trim() });
    setContent('');
    setCategory('');
    setReason('');
    setSubmitted(true);
  };

  return (
    <div>
      <PageHeader title={t('report.title')} subtitle={t('report.subtitle')} icon={<Flag />} />

      <div className="mb-4 rounded-3xl border-2 border-sun-400 bg-sun-50 p-4" role="note" data-testid="report-disclaimer">
        <p className="flex items-start gap-2 text-lg font-extrabold text-navy-900">
          <ShieldAlert className="mt-0.5 shrink-0 text-sun-700" /> {t('report.disclaimer')}
        </p>
        <p className="mt-2 flex items-start gap-2 text-navy-800">
          <AlertTriangle className="mt-0.5 shrink-0 text-sun-700" size={20} /> {t('report.privacy')} Links you paste are never opened, checked or
          sent anywhere.
        </p>
      </div>

      <form onSubmit={submit} className="card space-y-5" noValidate>
        <button type="button" className="btn-outline w-full" onClick={loadExample} data-testid="load-example">
          <ClipboardPaste /> {t('report.loadExample')}
        </button>

        <div>
          <label htmlFor="r-content" className="label">
            {t('report.content')}
          </label>
          <textarea
            id="r-content"
            className="input min-h-[8rem]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="e.g. 'Your parcel is on hold, pay $1.99 at …'"
            maxLength={1000}
          />
        </div>

        <div>
          <label htmlFor="r-category" className="label">
            {t('report.category')}
          </label>
          <select id="r-category" className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Choose one…</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="r-reason" className="label">
            {t('report.reason')}
          </label>
          <div className="mb-2 flex flex-wrap gap-2">
            {REASON_CHIPS.map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => addReason(r)}
                className="min-h-[2.75rem] rounded-full bg-navy-50 px-3 text-sm font-semibold text-navy-700 hover:bg-navy-100"
              >
                + {r}
              </button>
            ))}
          </div>
          <textarea id="r-reason" className="input min-h-[5rem]" value={reason} onChange={(e) => setReason(e.target.value)} maxLength={500} />
        </div>

        {piWarnings.length > 0 && (
          <p className="flex gap-2 rounded-2xl bg-red-50 p-3 text-red-800 ring-1 ring-red-200" role="alert">
            <AlertTriangle className="shrink-0" /> This looks like it may contain {piWarnings.join(', ')}. Please remove personal details.
          </p>
        )}
        {errors.length > 0 && (
          <ul className="space-y-1 rounded-2xl bg-red-50 p-3 text-red-800 ring-1 ring-red-200" role="alert">
            {errors.map((e) => (
              <li key={e}>• {e}</li>
            ))}
          </ul>
        )}

        <button type="submit" className="btn-primary w-full text-lg" data-testid="submit-report">
          <Send /> {t('report.submit')}
        </button>

        {submitted && (
          <div className="animate-floatUp rounded-2xl bg-teal-50 p-4 ring-1 ring-teal-200" role="status" data-testid="report-received">
            <p className="flex items-center gap-2 text-lg font-extrabold text-teal-900">
              <CheckCircle2 /> {t('report.received')}
            </p>
            <p className="mt-1 text-navy-700">
              Saved only in this browser. Reports do not earn points, because nobody has verified the content.
            </p>
          </div>
        )}
      </form>

      <section className="card mt-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl font-extrabold">{t('report.history')}</h2>
          {state.reports.length > 0 && (
            <button className="btn-ghost min-h-[2.75rem] px-3 py-1 text-sm" onClick={() => setConfirmClear(true)}>
              <Trash2 size={18} /> Clear
            </button>
          )}
        </div>
        <p className="mt-1 text-sm text-navy-600">Simulated review: statuses change automatically after a few minutes (demo only).</p>
        {state.reports.length === 0 ? (
          <p className="mt-4 rounded-2xl bg-navy-50 p-4 text-center text-navy-600">{t('report.empty')}</p>
        ) : (
          <ul className="mt-4 space-y-3" data-testid="report-history">
            {state.reports.map((r) => {
              const st = reportStatus(r, now);
              return (
                <li key={r.id} className="rounded-2xl p-4 ring-1 ring-navy-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`chip ${STATUS_STYLE[st]}`}>{st}</span>
                    <span className="chip bg-navy-50 text-navy-600">{r.category}</span>
                    <span className="text-sm text-navy-600">{formatDateTime(r.submittedAt)}</span>
                  </div>
                  <p className="mt-2 line-clamp-3 break-words text-navy-800">{r.content}</p>
                  <p className="mt-1 text-sm text-navy-600">
                    <strong>Why:</strong> {r.reason}
                  </p>
                  {st !== 'Reviewed' ? (
                    <button
                      className="mt-2 min-h-[2.75rem] rounded-xl px-2 text-sm font-semibold text-teal-700 underline underline-offset-2"
                      onClick={() => actions.setReportStatus(r.id, NEXT_STATUS[st])}
                    >
                      Simulate next review step (presenter)
                    </button>
                  ) : (
                    <p className="mt-2 text-sm text-teal-800">
                      Demo outcome: thank you — a volunteer moderator would follow up here in the real platform. (Simulated)
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-5 rounded-3xl bg-navy-900 p-5 text-white" aria-labelledby="real-help">
        <h2 id="real-help" className="text-xl font-extrabold">
          {t('report.official')}
        </h2>
        <p className="mt-1 text-navy-200">These are real services, separate from this demo. Use them for real situations.</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          <HelpLink href="tel:1799" icon={<Phone />} title="ScamShield Helpline: 1799" desc="24/7 — check if something is a scam" />
          <HelpLink href="https://www.scamshield.gov.sg" icon={<ExternalLink />} title="scamshield.gov.sg" desc="Check, report and learn about scams" />
          <HelpLink href="tel:18002550000" icon={<Phone />} title="Police Hotline: 1800-255-0000" desc="Give information about scams/crime" />
          <HelpLink href="https://www.police.gov.sg/i-witness" icon={<ExternalLink />} title="Police i-Witness" desc="Submit information online" />
        </ul>
        <p className="mt-4 text-navy-200">
          Lost money or shared bank details? Call your bank immediately, then make a police report. In an emergency, call <strong className="text-white">999</strong>.
        </p>
      </section>

      <ConfirmDialog
        open={confirmClear}
        title="Clear demo reports?"
        message="This removes your practice reports from this browser."
        confirmLabel="Clear reports"
        cancelLabel={t('common.cancel')}
        onCancel={() => setConfirmClear(false)}
        onConfirm={() => {
          actions.deleteReports();
          setConfirmClear(false);
        }}
        danger
      />
    </div>
  );
}

function HelpLink({ href, icon, title, desc }: { href: string; icon: React.ReactNode; title: string; desc: string }) {
  const external = href.startsWith('http');
  return (
    <li>
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className="flex min-h-[4rem] items-center gap-3 rounded-2xl bg-white/10 p-3 hover:bg-white/15"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sun-300 text-navy-950">{icon}</span>
        <span>
          <span className="block font-extrabold">{title}</span>
          <span className="block text-sm text-navy-200">{desc}</span>
        </span>
      </a>
    </li>
  );
}
