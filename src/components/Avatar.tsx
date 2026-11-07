import { getAvatar } from '../data/avatars';

/** Friendly, original avatar illustrations drawn in SVG. */
export function Avatar({ id, size = 56, className = '' }: { id: string; size?: number; className?: string }) {
  const a = getAvatar(id);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={`shrink-0 rounded-full ${className}`} role="img" aria-label={a.label}>
      <circle cx="50" cy="50" r="50" fill={a.bg} />
      {/* shoulders */}
      <path d="M18 100 Q18 72 50 70 Q82 72 82 100Z" fill={a.style === 'cap' || a.style === 'uncle' ? '#2c55a0' : '#159f90'} />
      {/* hair back */}
      {a.style === 'auntie' && <circle cx="50" cy="40" r="27" fill={a.hair} />}
      {a.style === 'flower' && <path d="M24 46 Q24 16 50 16 Q76 16 76 46 L76 62 L24 62Z" fill={a.hair} />}
      {a.style === 'bun' && <circle cx="50" cy="14" r="11" fill={a.hair} />}
      {/* face */}
      <circle cx="50" cy="44" r="22" fill={a.skin} />
      {/* hair front */}
      {a.style === 'auntie' && (
        <>
          <circle cx="32" cy="30" r="9" fill={a.hair} />
          <circle cx="44" cy="23" r="9" fill={a.hair} />
          <circle cx="57" cy="23" r="9" fill={a.hair} />
          <circle cx="68" cy="30" r="9" fill={a.hair} />
        </>
      )}
      {a.style === 'uncle' && <path d="M29 38 Q30 20 50 20 Q70 20 71 38 Q62 28 50 28 Q38 28 29 38Z" fill={a.hair} />}
      {a.style === 'glasses' && <path d="M30 36 Q32 20 50 20 Q68 20 70 36 Q60 26 50 30 Q40 26 30 36Z" fill={a.hair} />}
      {a.style === 'flower' && (
        <>
          <path d="M28 40 Q30 22 50 22 Q70 22 72 40 Q60 30 50 30 Q38 30 28 40Z" fill={a.hair} />
          <circle cx="70" cy="28" r="6" fill="#ff6b9a" />
          <circle cx="70" cy="28" r="2.5" fill="#ffd43b" />
        </>
      )}
      {a.style === 'bun' && <path d="M28 40 Q30 21 50 21 Q70 21 72 40 Q60 30 50 30 Q40 30 28 40Z" fill={a.hair} />}
      {a.style === 'cap' && (
        <>
          <path d="M27 36 Q28 18 50 18 Q72 18 73 36Z" fill="#f98508" />
          <rect x="44" y="33" width="38" height="6" rx="3" fill="#dd6203" />
        </>
      )}
      {/* eyes & smile */}
      {a.style === 'glasses' ? (
        <>
          <circle cx="41" cy="44" r="7" fill="none" stroke="#13284f" strokeWidth="2.5" />
          <circle cx="59" cy="44" r="7" fill="none" stroke="#13284f" strokeWidth="2.5" />
          <line x1="48" y1="44" x2="52" y2="44" stroke="#13284f" strokeWidth="2.5" />
        </>
      ) : null}
      <circle cx="41" cy="44" r="2.5" fill="#2b1d12" />
      <circle cx="59" cy="44" r="2.5" fill="#2b1d12" />
      <path d="M42 53 Q50 60 58 53" stroke="#2b1d12" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="35" cy="52" r="3.5" fill="#ff8a8a" opacity=".45" />
      <circle cx="65" cy="52" r="3.5" fill="#ff8a8a" opacity=".45" />
    </svg>
  );
}
