import { BookOpen, Gift, Hand, ScanSearch, Type, Users, Volume2 } from 'lucide-react';
import { Modal } from './ui';
import { ListenButton } from './ListenButton';

const STEPS = [
  { icon: Hand, title: 'Tap the big buttons', text: 'The buttons at the bottom of the screen take you to each part of the app. You cannot break anything — just explore.' },
  { icon: BookOpen, title: 'Learn', text: 'Short lessons with pictures. Tap "Next" to read on, then answer three easy questions.' },
  { icon: ScanSearch, title: 'Identify', text: 'See example messages and choose what you would do. There is no time limit.' },
  { icon: Users, title: 'Community', text: 'Join a neighbourhood group. Your points help your whole group.' },
  { icon: Gift, title: 'Rewards', text: 'Collect greeting pictures and send them to family and friends on WhatsApp.' },
  { icon: Type, title: 'Bigger words', text: 'Tap the "AA" button at the top to make the words bigger.' },
  { icon: Volume2, title: 'Listen', text: 'Tap "Listen" on lessons and examples to hear them read aloud.' },
];

export function HelpGuide({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="help-title" wide>
      <h2 id="help-title" className="pr-12 text-2xl font-extrabold">
        How to use this app
      </h2>
      <ListenButton id="help-guide" text={['How to use this app.', ...STEPS.map((s) => `${s.title}. ${s.text}`)].join(' ')} className="mt-3" />
      <ol className="mt-4 space-y-3">
        {STEPS.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex gap-3 rounded-2xl bg-navy-50 p-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-teal-700 shadow-card">
              <Icon size={26} />
            </span>
            <span>
              <span className="block text-lg font-extrabold">{title}</span>
              <span className="block text-lg leading-snug text-navy-700">{text}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-4 rounded-2xl bg-sun-50 p-3 text-lg text-navy-800 ring-1 ring-sun-200">
        Need a hand? It is perfectly fine to ask a family member or a community volunteer to go through it with you.
      </p>
      <button className="btn-teal mt-5 w-full text-xl" onClick={onClose} data-testid="help-close">
        Got it
      </button>
    </Modal>
  );
}
