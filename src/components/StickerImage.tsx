import { Lock } from 'lucide-react';
import { useMemo } from 'react';
import type { StickerDef } from '../types';
import { stickerDataUrl } from '../utils/stickerArt';
import { useStickerWatermark } from '../hooks/useStickerWatermark';

export function StickerImage({
  sticker,
  locked = false,
  className = '',
  size,
}: {
  sticker: StickerDef;
  locked?: boolean;
  className?: string;
  size?: number;
}) {
  const watermark = useStickerWatermark();
  const src = useMemo(() => stickerDataUrl(sticker, { watermark }), [sticker, watermark]);
  return (
    <div className={`relative ${className}`} style={size ? { width: size, height: size } : undefined}>
      <img
        src={src}
        alt={locked ? `${sticker.name} (locked)` : `${sticker.name} sticker`}
        className={`h-full w-full select-none rounded-[6%] shadow-card transition ${locked ? 'opacity-40 grayscale' : ''}`}
        draggable={false}
      />
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-900/80 text-white shadow-lift">
            <Lock size={24} />
          </div>
        </div>
      )}
    </div>
  );
}
