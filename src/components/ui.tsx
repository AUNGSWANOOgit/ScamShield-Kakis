import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

export function ProgressBar({
  value,
  color = 'bg-teal-500',
  label,
  className = '',
  height = 'h-3',
}: {
  value: number; // 0..100
  color?: string;
  label?: string;
  className?: string;
  height?: string;
}) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      className={`w-full overflow-hidden rounded-full bg-navy-100 ${height} ${className}`}
      role="progressbar"
      aria-valuenow={v}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className={`${height} rounded-full ${color} transition-all duration-700 ease-out`} style={{ width: `${v}%` }} />
    </div>
  );
}

export function ProgressRing({
  value,
  size = 96,
  stroke = 10,
  color = '#159f90',
  children,
  label,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  children?: ReactNode;
  label?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }} role="img" aria-label={label}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#d9e3f5" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (v / 100) * c}
          style={{ transition: 'stroke-dashoffset .8s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  );
}

export function PageHeader({ title, subtitle, icon }: { title: string; subtitle?: string; icon?: ReactNode }) {
  return (
    <header className="mb-5 animate-floatUp">
      <div className="flex items-center gap-3">
        {icon && <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">{icon}</div>}
        <h1 className="text-2xl font-extrabold leading-tight text-navy-900 sm:text-3xl">{title}</h1>
      </div>
      {subtitle && <p className="mt-2 text-lg text-navy-600">{subtitle}</p>}
    </header>
  );
}

/** Accessible modal: bottom sheet on phones, centred dialog on larger screens. */
export function Modal({
  open,
  onClose,
  children,
  labelledBy,
  wide = false,
  hideClose = false,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  labelledBy?: string;
  wide?: boolean;
  hideClose?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      prev?.focus?.();
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-navy-950/60 sm:items-center sm:p-4" onClick={onClose}>
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onClick={(e) => e.stopPropagation()}
        className={`relative max-h-[92vh] w-full animate-floatUp overflow-y-auto rounded-t-3xl bg-white p-5 pb-8 shadow-lift outline-none sm:rounded-3xl sm:pb-6 ${
          wide ? 'sm:max-w-2xl' : 'sm:max-w-md'
        }`}
        style={{ maxHeight: '92dvh', paddingBottom: 'max(2rem, calc(env(safe-area-inset-bottom) + 1rem))' }}
      >
        {!hideClose && (
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-12 w-12 items-center justify-center rounded-full text-navy-600 hover:bg-navy-50"
            aria-label="Close"
          >
            <X size={26} />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  danger,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}) {
  return (
    <Modal open={open} onClose={onCancel} labelledBy="confirm-title">
      <h2 id="confirm-title" className="pr-10 text-xl font-extrabold">
        {title}
      </h2>
      <p className="mt-3 text-lg text-navy-700">{message}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
        <button className={danger ? 'btn bg-red-600 text-white hover:bg-red-700' : 'btn-primary'} onClick={onConfirm}>
          {confirmLabel}
        </button>
        <button className="btn-outline" onClick={onCancel}>
          {cancelLabel}
        </button>
      </div>
    </Modal>
  );
}

export function SimBadge({ children }: { children: ReactNode }) {
  return <span className="chip bg-sun-100 text-sun-800 ring-1 ring-sun-300">{children}</span>;
}
