import type { StickerDef } from '../types';
import { greetingText, stickerSvg } from '../utils/stickerArt';

/**
 * Sticker export & sharing — real browser features only:
 *  - PNG rendered locally from SVG via <canvas> (no server).
 *  - Web Share API with files when the browser supports it (most phones).
 *  - Otherwise a normal download + instructions for attaching in WhatsApp/Telegram.
 * We never claim to attach images to WhatsApp/Telegram automatically.
 */

export async function stickerPngBlob(sticker: StickerDef, size = 1024, watermark?: string): Promise<Blob> {
  const svg = stickerSvg(sticker, { size, watermark });
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const img = new Image();
    img.decoding = 'async';
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Could not render sticker image'));
      img.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');
    ctx.drawImage(img, 0, 0, size, size);
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('PNG export failed'))), 'image/png'),
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

export const stickerFileName = (s: StickerDef) => `${s.id}-scamshield-kakis-sticker.png`;

export async function downloadSticker(sticker: StickerDef, watermark?: string): Promise<void> {
  const blob = await prepareStickerFile(sticker, watermark);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = stickerFileName(sticker);
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export type ShareOutcome = 'shared' | 'cancelled' | 'unsupported';

/**
 * Phones (especially iOS Safari) only allow navigator.share() directly after a tap.
 * Rendering the PNG takes a moment, so we pre-render it when a sticker is opened
 * and keep it here; the Share tap can then open the share sheet immediately.
 */
const fileCache = new Map<string, File>();

export async function prepareStickerFile(sticker: StickerDef, watermark?: string): Promise<File> {
  const key = `${sticker.id}|${watermark ?? ''}`;
  const cached = fileCache.get(key);
  if (cached) return cached;
  const blob = await stickerPngBlob(sticker, 1024, watermark);
  const file = new File([blob], stickerFileName(sticker), { type: 'image/png' });
  fileCache.set(key, file);
  return file;
}

export const canShareFiles = () =>
  typeof navigator !== 'undefined' && 'share' in navigator && 'canShare' in navigator;

/** Tries the native share sheet with the PNG file. Returns 'unsupported' if the browser cannot share files. */
export async function shareSticker(sticker: StickerDef, watermark?: string): Promise<ShareOutcome> {
  if (!canShareFiles()) return 'unsupported';
  const file = fileCache.get(`${sticker.id}|${watermark ?? ''}`) ?? (await prepareStickerFile(sticker, watermark));
  const data: ShareData = { files: [file], title: sticker.name, text: greetingText(sticker) };
  if (!navigator.canShare(data)) return 'unsupported';
  try {
    await navigator.share(data);
    return 'shared';
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') return 'cancelled';
    return 'unsupported';
  }
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to legacy method */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}
