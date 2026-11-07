import {
  AudioLines,
  BadgeCheck,
  Brain,
  Clock,
  HandCoins,
  LifeBuoy,
  Lock,
  Pause,
  PhoneCall,
  Search,
  ShieldAlert,
  UserX,
  Video,
  type LucideIcon,
} from 'lucide-react';
import type { IllustrationKey } from '../types';

const MAP: Record<IllustrationKey, { icon: LucideIcon; bg: string; fg: string; accent: string }> = {
  'ai-brain': { icon: Brain, bg: '#cff5ee', fg: '#0e8076', accent: '#ffbf4a' },
  'fake-video': { icon: Video, bg: '#d9e3f5', fg: '#1f4282', accent: '#f98508' },
  'voice-wave': { icon: AudioLines, bg: '#ffecc6', fg: '#b74306', accent: '#159f90' },
  'not-trust': { icon: ShieldAlert, bg: '#ffe4e1', fg: '#b91c1c', accent: '#ffbf4a' },
  magnifier: { icon: Search, bg: '#cff5ee', fg: '#0f6660', accent: '#ffbf4a' },
  impersonation: { icon: UserX, bg: '#d9e3f5', fg: '#183467', accent: '#f98508' },
  'pressure-clock': { icon: Clock, bg: '#ffecc6', fg: '#b74306', accent: '#ef4444' },
  'money-request': { icon: HandCoins, bg: '#ffe4e1', fg: '#b91c1c', accent: '#ffbf4a' },
  'check-source': { icon: BadgeCheck, bg: '#cff5ee', fg: '#0e8076', accent: '#2c55a0' },
  pause: { icon: Pause, bg: '#d9e3f5', fg: '#1f4282', accent: '#ffbf4a' },
  'phone-verify': { icon: PhoneCall, bg: '#cff5ee', fg: '#0e8076', accent: '#f98508' },
  'lock-info': { icon: Lock, bg: '#ffecc6', fg: '#94330c', accent: '#159f90' },
  'report-help': { icon: LifeBuoy, bg: '#d9e3f5', fg: '#183467', accent: '#ef4444' },
};

/** Friendly lesson illustration: large icon in soft blobs with decorative dots. */
export function LessonIllustration({ name, className = '' }: { name: IllustrationKey; className?: string }) {
  const m = MAP[name];
  const Icon = m.icon;
  return (
    <div className={`relative mx-auto flex h-40 w-full max-w-xs items-center justify-center ${className}`} aria-hidden="true">
      <svg viewBox="0 0 300 160" className="absolute inset-0 h-full w-full">
        <path d="M60 20 C120 -10 230 10 250 60 C272 112 200 160 140 150 C70 140 20 110 30 70 C35 45 45 28 60 20Z" fill={m.bg} />
        <circle cx="250" cy="30" r="10" fill={m.accent} opacity=".8" />
        <circle cx="40" cy="130" r="7" fill={m.accent} opacity=".7" />
        <circle cx="270" cy="120" r="5" fill={m.fg} opacity=".3" />
        <circle cx="25" cy="40" r="5" fill={m.fg} opacity=".3" />
      </svg>
      <div className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white shadow-card">
        <Icon size={54} color={m.fg} strokeWidth={2.2} />
      </div>
    </div>
  );
}

/** Original hero illustration: two seniors with smartphones and a friendly safety shield. */
export function HeroIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" className={className} role="img" aria-label="Two smiling seniors using smartphones together">
      <ellipse cx="200" cy="270" rx="170" ry="18" fill="#13284f" opacity=".08" />
      <circle cx="200" cy="140" r="122" fill="#cff5ee" />
      <circle cx="330" cy="50" r="16" fill="#ffbf4a" />
      <circle cx="62" cy="70" r="9" fill="#ffbf4a" opacity=".8" />
      {/* speech bubble with shield */}
      <g transform="translate(168 18)">
        <rect width="64" height="56" rx="18" fill="#fff" />
        <path d="M24 56 L30 68 L38 56Z" fill="#fff" />
        <path d="M32 10 L48 16 V28 C48 38 41 44 32 48 C23 44 16 38 16 28 V16Z" fill="#159f90" />
        <path d="M25 29 L30 34 L40 23" stroke="#ffbf4a" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* Left senior (auntie) */}
      <g transform="translate(120 110)">
        <path d="M-58 160 Q-58 70 0 66 Q58 70 58 160Z" fill="#f98508" />
        <circle cx="0" cy="18" r="44" fill="#6b6b6b" />
        <circle cx="0" cy="26" r="38" fill="#f2c6a0" />
        <circle cx="-26" cy="0" r="14" fill="#6b6b6b" />
        <circle cx="-6" cy="-12" r="14" fill="#6b6b6b" />
        <circle cx="16" cy="-10" r="14" fill="#6b6b6b" />
        <circle cx="30" cy="2" r="12" fill="#6b6b6b" />
        <circle cx="-13" cy="26" r="4" fill="#2b1d12" />
        <circle cx="13" cy="26" r="4" fill="#2b1d12" />
        <path d="M-12 42 Q0 52 12 42" stroke="#2b1d12" strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="-24" cy="40" r="6" fill="#ff8a8a" opacity=".45" />
        <circle cx="24" cy="40" r="6" fill="#ff8a8a" opacity=".45" />
        <rect x="14" y="88" width="34" height="56" rx="7" fill="#13284f" transform="rotate(12 31 116)" />
        <rect x="18" y="94" width="26" height="40" rx="4" fill="#63d7c6" transform="rotate(12 31 116)" />
        <circle cx="34" cy="128" r="12" fill="#f2c6a0" />
      </g>
      {/* Right senior (uncle with glasses) */}
      <g transform="translate(278 120)">
        <path d="M-56 150 Q-56 66 0 62 Q56 66 56 150Z" fill="#2c55a0" />
        <circle cx="0" cy="22" r="38" fill="#d9a77c" />
        <path d="M-38 14 Q-36 -18 0 -18 Q36 -18 38 14 Q24 -2 0 0 Q-24 -2 -38 14Z" fill="#e5e5e5" />
        <circle cx="-14" cy="22" r="11" fill="none" stroke="#13284f" strokeWidth="3.5" />
        <circle cx="14" cy="22" r="11" fill="none" stroke="#13284f" strokeWidth="3.5" />
        <line x1="-3" y1="22" x2="3" y2="22" stroke="#13284f" strokeWidth="3.5" />
        <circle cx="-14" cy="22" r="3.5" fill="#2b1d12" />
        <circle cx="14" cy="22" r="3.5" fill="#2b1d12" />
        <path d="M-12 40 Q0 50 12 40" stroke="#2b1d12" strokeWidth="4" fill="none" strokeLinecap="round" />
        <rect x="-48" y="84" width="34" height="56" rx="7" fill="#13284f" transform="rotate(-12 -31 112)" />
        <rect x="-44" y="90" width="26" height="40" rx="4" fill="#ffd888" transform="rotate(-12 -31 112)" />
        <circle cx="-34" cy="124" r="12" fill="#d9a77c" />
      </g>
      {/* hearts & sparkles */}
      <path d="M200 200 C188 190 192 178 200 184 C208 178 212 190 200 200Z" fill="#ef4444" />
      <path d="M352 168 l5 -12 l5 12 l12 5 l-12 5 l-5 12 l-5 -12 l-12 -5Z" fill="#ffbf4a" />
      <path d="M44 180 l4 -9 l4 9 l9 4 l-9 4 l-4 9 l-4 -9 l-9 -4Z" fill="#159f90" />
    </svg>
  );
}
