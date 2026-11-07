import { useApp } from '../context/AppContext';
import { getGroup } from '../data/community';

/** Stickers carry the user's community group name, like the group names on forwarded greeting images. */
export function useStickerWatermark(): string {
  const { state } = useApp();
  return getGroup(state.community.groupId)?.name ?? 'SafeSeniors SG';
}
