import { useEffect, useState } from 'react';
import { Check, Copy, Download, Info, Loader2, Share2 } from 'lucide-react';
import type { StickerDef } from '../types';
import { Modal } from './ui';
import { StickerImage } from './StickerImage';
import { useApp } from '../context/AppContext';
import { canShareFiles, copyText, downloadSticker, prepareStickerFile, shareSticker } from '../services/stickerExport';
import { COLLECTION_LABELS } from '../data/stickers';
import { formatDateTime } from '../utils/time';
import { greetingText } from '../utils/stickerArt';
import { useStickerWatermark } from '../hooks/useStickerWatermark';

const RARITY_STYLE: Record<string, string> = {
  Common: 'bg-teal-100 text-teal-800',
  Rare: 'bg-navy-100 text-navy-800',
  Epic: 'bg-sun-100 text-sun-800',
};

export function StickerShareModal({ sticker, onClose }: { sticker: StickerDef | null; onClose: () => void }) {
  const { state, actions, t, pushToast } = useApp();
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState<null | 'share' | 'download'>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [copied, setCopied] = useState(false);
  const unlocked = sticker ? state.stickers[sticker.id] : undefined;
  const shareSupported = canShareFiles();
  const watermark = useStickerWatermark();

  const isUnlocked = Boolean(unlocked);
  useEffect(() => {
    setShowHelp(false);
    setCopied(false);
    setReady(false);
    if (sticker && isUnlocked) {
      // Pre-render the PNG so the phone share sheet can open instantly on tap.
      prepareStickerFile(sticker, watermark)
        .then(() => setReady(true))
        .catch(() => setReady(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sticker?.id, isUnlocked, watermark]);

  if (!sticker) return null;

  const onDownload = async () => {
    setBusy('download');
    try {
      await downloadSticker(sticker, watermark);
      actions.recordShare(sticker.id, 'download');
      setShowHelp(true);
      pushToast({ kind: 'success', title: 'Sticker saved as PNG', detail: 'Check your Downloads or Photos.' });
    } catch {
      pushToast({ kind: 'info', title: 'Download did not work', detail: 'Try long-pressing the sticker image and choose "Save image".' });
    } finally {
      setBusy(null);
    }
  };

  const onShare = async () => {
    setBusy('share');
    try {
      const outcome = await shareSticker(sticker, watermark);
      if (outcome === 'shared') {
        actions.recordShare(sticker.id, 'share');
        pushToast({ kind: 'success', title: 'Sticker shared!', detail: 'Thank you for spreading safety tips.' });
      } else if (outcome === 'unsupported') {
        // Fallback: save the file and explain how to attach it manually.
        await onDownload();
      }
    } finally {
      setBusy(null);
    }
  };

  const onCopy = async () => {
    const ok = await copyText(greetingText(sticker));
    if (ok) {
      actions.recordShare(sticker.id, 'copy');
      setCopied(true);
      pushToast({ kind: 'success', title: 'Greeting copied', detail: 'Paste it in your chat with the sticker.' });
    } else {
      pushToast({ kind: 'info', title: 'Could not copy automatically', detail: 'Please select the greeting text and copy it.' });
    }
  };

  return (
    <Modal open={Boolean(sticker)} onClose={onClose} labelledBy="sticker-title">
      <div className="flex flex-col items-center text-center">
        <StickerImage sticker={sticker} locked={!unlocked} className="h-56 w-56 sm:h-64 sm:w-64" />
        <h2 id="sticker-title" className="mt-3 text-2xl font-extrabold">
          {sticker.name}
        </h2>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          <span className={`chip ${RARITY_STYLE[sticker.rarity]}`}>{sticker.rarity}</span>
          <span className="chip bg-navy-50 text-navy-700">{COLLECTION_LABELS[sticker.collection]}</span>
        </div>
      </div>

      {!unlocked ? (
        <div className="mt-5 rounded-2xl bg-navy-50 p-4">
          <p className="font-bold text-navy-900">{t('rewards.howToUnlock')}</p>
          <p className="mt-1 text-lg text-navy-700">{sticker.criteria}</p>
        </div>
      ) : (
        <>
          <p className="mt-4 text-center text-navy-700">{sticker.howEarned}</p>
          <p className="mt-1 text-center text-sm text-navy-600">Unlocked {formatDateTime(unlocked.unlockedAt)}</p>

          <div className="mt-4 rounded-2xl border-2 border-dashed border-teal-200 bg-teal-50 p-3 text-left">
            <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Greeting message</p>
            <p className="mt-1 select-all whitespace-pre-line text-navy-800">{greetingText(sticker)}</p>
          </div>

          <div className="mt-5 grid gap-3">
            {shareSupported && (
              <button className="btn-teal w-full text-lg" onClick={onShare} disabled={busy !== null || !ready} data-demo="share-button">
                {busy === 'share' || !ready ? <Loader2 className="animate-spin" /> : <Share2 />}
                {t('rewards.share')}
              </button>
            )}
            <button
              className={`${shareSupported ? 'btn-outline' : 'btn-teal'} w-full text-lg`}
              onClick={onDownload}
              disabled={busy !== null}
              data-demo={shareSupported ? undefined : 'share-button'}
            >
              {busy === 'download' ? <Loader2 className="animate-spin" /> : <Download />}
              {t('rewards.download')}
            </button>
            <button className="btn-outline w-full text-lg" onClick={onCopy}>
              {copied ? <Check className="text-teal-600" /> : <Copy />}
              {t('rewards.copy')}
            </button>
          </div>

          {!shareSupported && !showHelp && (
            <p className="mt-3 flex items-start gap-2 text-sm text-navy-600">
              <Info size={18} className="mt-0.5 shrink-0" />
              This browser cannot open a share menu, so the sticker will be saved as a picture for you to attach.
            </p>
          )}

          {showHelp && (
            <div className="mt-4 rounded-2xl bg-sun-50 p-4 text-left ring-1 ring-sun-200" role="status">
              <p className="font-bold text-navy-900">How to send it in WhatsApp or Telegram</p>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-navy-800">
                <li>Open the chat with your friend or family group.</li>
                <li>
                  Tap the <strong>attach</strong> button (📎 or <strong>+</strong>).
                </li>
                <li>
                  Choose <strong>Photos/Gallery</strong> (or <strong>Files</strong> on a computer) and pick the sticker you just saved.
                </li>
                <li>Paste the greeting message if you copied it, then tap Send.</li>
              </ol>
              <p className="mt-2 text-sm text-navy-600">
                The sticker is saved to your device — this app does not send anything to WhatsApp or Telegram by itself.
              </p>
            </div>
          )}
        </>
      )}
    </Modal>
  );
}
