/** Simple, friendly avatar set rendered as SVG (see components/Avatar.tsx). */
export interface AvatarDef {
  id: string;
  label: string;
  bg: string;
  skin: string;
  hair: string;
  style: 'auntie' | 'uncle' | 'glasses' | 'cap' | 'flower' | 'bun';
}

export const AVATARS: AvatarDef[] = [
  { id: 'auntie', label: 'Auntie with curls', bg: '#ffd888', skin: '#f2c6a0', hair: '#4b4b4b', style: 'auntie' },
  { id: 'uncle', label: 'Uncle with grey hair', bg: '#a0eadd', skin: '#d9a77c', hair: '#d4d4d4', style: 'uncle' },
  { id: 'glasses', label: 'Reader with glasses', bg: '#b3c7ea', skin: '#e8b98f', hair: '#e5e5e5', style: 'glasses' },
  { id: 'cap', label: 'Uncle with cap', bg: '#ffecc6', skin: '#c68b5e', hair: '#2b2b2b', style: 'cap' },
  { id: 'flower', label: 'Auntie with flower', bg: '#fde2ef', skin: '#f0c19a', hair: '#1f1f1f', style: 'flower' },
  { id: 'bun', label: 'Grandma with hair bun', bg: '#cff5ee', skin: '#f5cfae', hair: '#bdbdbd', style: 'bun' },
];

export const getAvatar = (id: string | undefined) => AVATARS.find((a) => a.id === id) ?? AVATARS[0];
