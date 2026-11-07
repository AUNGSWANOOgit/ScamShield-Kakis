import { useState } from 'react';
import { ArrowLeft, MoreVertical, Pause, Phone, Play, ThumbsUp, Video, Volume2 } from 'lucide-react';
import type { Scenario, ScenarioMessage } from '../types';

/** Renders a scenario as a realistic-looking (but clearly fictional) phone screen. */
export function ScenarioView({ scenario }: { scenario: Scenario }) {
  const isPost = scenario.channel === 'video-post';
  const isCall = scenario.channel === 'video-call';
  const isSms = scenario.channel === 'sms';
  return (
    <div className="mx-auto w-full max-w-sm overflow-hidden rounded-[2rem] border-[6px] border-navy-900 bg-navy-900 shadow-lift">
      {/* status bar */}
      <div className="flex items-center justify-between bg-navy-900 px-5 py-1 text-xs font-semibold text-white/80" aria-hidden="true">
        <span>{scenario.messages[0]?.time ?? '9:41'}</span>
        <span className="h-4 w-16 rounded-full bg-black" />
        <span>5G ▮▮▮</span>
      </div>

      {/* app header */}
      <div className={`flex items-center gap-3 px-3 py-2 ${isPost ? 'bg-white text-navy-900' : isSms ? 'bg-[#f2f2f7] text-navy-900' : 'bg-[#0b5c4f] text-white'}`}>
        <ArrowLeft size={20} aria-hidden="true" />
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ background: scenario.sender.color }}
          aria-hidden="true"
        >
          {scenario.sender.initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold leading-tight">{scenario.sender.name}</p>
          <p className="truncate text-xs opacity-75">{scenario.sender.subtitle}</p>
        </div>
        {!isPost && !isSms && (
          <>
            <Video size={20} aria-hidden="true" className="hidden min-[400px]:block" />
            <Phone size={18} aria-hidden="true" className="hidden min-[400px]:block" />
          </>
        )}
        <MoreVertical size={20} aria-hidden="true" />
      </div>

      {/* body */}
      <div className={`space-y-2 px-3 py-4 ${isPost ? 'bg-white' : isSms ? 'bg-white' : 'bg-[#efe7dd]'}`}>
        {isPost && scenario.media && (
          <>
            <p className="px-1 text-[0.95rem] text-navy-900">{scenario.messages[0]?.text}</p>
            <MockVideo media={scenario.media} dark={false} />
            <div className="flex items-center justify-between px-1 pt-1 text-sm text-navy-600">
              <span className="flex items-center gap-1">
                <ThumbsUp size={16} /> 2.4K
              </span>
              <span>318 comments · 1.1K shares</span>
            </div>
            <div className="rounded-xl bg-[#1877f2] py-2 text-center font-bold text-white">Learn More</div>
          </>
        )}
        {isCall && scenario.media && <MockVideo media={scenario.media} dark />}
        {!isPost && scenario.messages.map((m, i) => <Bubble key={i} m={m} sms={isSms} call={isCall} />)}
      </div>
    </div>
  );
}

function MockVideo({ media, dark }: { media: NonNullable<Scenario['media']>; dark: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-xl ${dark ? 'bg-navy-950' : 'bg-navy-800'}`} role="img" aria-label={`Simulated video: ${media.caption}`}>
      <svg viewBox="0 0 320 200" className="block w-full">
        <defs>
          <linearGradient id="vbg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor={dark ? '#1f2937' : '#2c55a0'} />
            <stop offset="1" stopColor={dark ? '#0f172a' : '#0d1d3a'} />
          </linearGradient>
        </defs>
        <rect width="320" height="200" fill="url(#vbg)" />
        {dark ? (
          <>
            <rect x="40" y="30" width="60" height="40" rx="4" fill="#334155" />
            <rect x="230" y="20" width="60" height="70" rx="4" fill="#1e293b" />
          </>
        ) : (
          <>
            <rect x="20" y="20" width="90" height="56" rx="6" fill="#4c74bd" opacity=".5" />
            <rect x="220" y="26" width="80" height="44" rx="6" fill="#4c74bd" opacity=".4" />
          </>
        )}
        {/* stylised person (deliberately generic) */}
        <path d="M100 200 Q100 130 160 124 Q220 130 220 200Z" fill={dark ? '#1e3a8a' : '#e5e7eb'} />
        {dark && <rect x="148" y="140" width="24" height="16" rx="3" fill="#facc15" />}
        <circle cx="160" cy="92" r="34" fill="#d9a77c" />
        <path d="M126 86 Q128 54 160 54 Q192 54 194 86 Q180 70 160 72 Q140 70 126 86Z" fill={dark ? '#111827' : '#374151'} />
        {dark && <path d="M124 70 L196 70 L190 56 L130 56Z" fill="#1e3a8a" />}
        <circle cx="148" cy="92" r="3.5" fill="#1f2937" />
        <circle cx="172" cy="92" r="3.5" fill="#1f2937" />
        <path d="M150 108 Q160 113 170 108" stroke="#1f2937" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
      {media.badge && <span className="absolute left-2 top-2 rounded bg-red-600 px-2 py-0.5 text-xs font-bold text-white">{media.badge}</span>}
      <span className="absolute right-2 top-2 rounded bg-black/50 px-2 py-0.5 text-xs text-white">{media.person}</span>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-3 pt-8">
        <p className="text-[0.95rem] font-bold leading-snug text-white">{media.headline}</p>
        <p className="text-xs text-white/70">{media.caption}</p>
      </div>
      {!dark && (
        <div className="absolute left-1/2 top-[38%] flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white">
          <Play size={24} fill="currentColor" />
        </div>
      )}
    </div>
  );
}

function Bubble({ m, sms, call }: { m: ScenarioMessage; sms: boolean; call: boolean }) {
  const [playing, setPlaying] = useState(false);
  if (m.from === 'system') {
    return <div className="mx-auto max-w-[90%] rounded-xl bg-sun-100 px-3 py-2 text-center text-sm text-navy-800 shadow-sm">{m.text}</div>;
  }
  const base = sms ? 'bg-[#e9e9eb] text-navy-900' : call ? 'bg-white/95 text-navy-900 italic' : 'bg-white text-navy-900';
  return (
    <div className={`max-w-[88%] rounded-2xl rounded-tl-sm px-3 py-2 shadow-sm ${base}`}>
      {m.voice && (
        <div className="mb-1">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="flex w-full items-center gap-2"
            aria-label={playing ? 'Pause simulated voice note' : 'Play simulated voice note'}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0b5c4f] text-white">
              {playing ? <Pause size={18} /> : <Play size={18} />}
            </span>
            <span className="flex h-8 flex-1 items-center gap-[3px]" aria-hidden="true">
              {Array.from({ length: 22 }, (_, i) => (
                <span
                  key={i}
                  className={`w-[3px] rounded-full ${playing ? 'animate-pulse bg-[#0b5c4f]' : 'bg-navy-300'}`}
                  style={{ height: `${8 + ((i * 37) % 20)}px`, animationDelay: `${(i % 6) * 0.12}s` }}
                />
              ))}
            </span>
            <span className="text-xs text-navy-600">{m.voice}</span>
          </button>
          <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-navy-600">
            <Volume2 size={14} /> Simulated voice note — transcript:
          </p>
        </div>
      )}
      {m.image && <MockImage kind={m.image.kind} caption={m.image.caption} />}
      {m.text && <p className="text-[0.98rem] leading-snug">{m.text}</p>}
      {m.time && <p className="mt-0.5 text-right text-[0.7rem] text-navy-500">{m.time}</p>}
    </div>
  );
}

function MockImage({ kind, caption }: { kind: string; caption: string }) {
  return (
    <figure className="mb-1 overflow-hidden rounded-xl">
      <svg viewBox="0 0 280 160" className="block w-full" role="img" aria-label={`Simulated image: ${caption}`}>
        {kind === 'flood' ? (
          <>
            <rect width="280" height="160" fill="#9ca3af" />
            <rect x="10" y="20" width="50" height="90" fill="#6b7280" />
            <rect x="70" y="5" width="60" height="105" fill="#4b5563" />
            <rect x="150" y="30" width="45" height="80" fill="#6b7280" />
            <rect x="205" y="10" width="65" height="100" fill="#4b5563" />
            <path d="M0 95 Q35 85 70 95 T140 95 T210 95 T280 95 V160 H0Z" fill="#7c6f5a" />
            <path d="M0 110 Q35 100 70 110 T140 110 T210 110 T280 110 V160 H0Z" fill="#8b7d63" opacity=".9" />
            <rect x="100" y="98" width="40" height="14" rx="3" fill="#ef4444" />
            <rect x="180" y="102" width="30" height="10" rx="3" fill="#f8fafc" />
          </>
        ) : (
          <>
            <rect width="280" height="160" fill="#0f172a" />
            <text x="20" y="34" fontSize="14" fill="#94a3b8">My Portfolio</text>
            <text x="20" y="68" fontSize="28" fontWeight="bold" fill="#22c55e">+$12,480.00</text>
            <polyline points="20,140 60,130 100,132 140,110 180,100 220,70 260,40" fill="none" stroke="#22c55e" strokeWidth="4" />
          </>
        )}
      </svg>
      <figcaption className="bg-white px-2 py-1 text-sm font-semibold text-navy-800">{caption}</figcaption>
    </figure>
  );
}
