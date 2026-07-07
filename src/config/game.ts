import type { CollectionSlot, Monster, Rarity } from '../types/game';

export const capsuleCost = 150;
export const STORAGE_USER_KEY = 'monster-current-user';
export const STORAGE_DATA_PREFIX = 'monster-progress-';
export const STORAGE_THEME_KEY = 'monster-theme';

export const rarityLabels: Record<Rarity, string> = {
  common: 'Обычный',
  rare: 'Редкий',
  superRare: 'Супер-редкий',
  ultraRare: 'Сверхредкий',
};

export const rarityClasses: Record<Rarity, string> = {
  common: 'rarity-common',
  rare: 'rarity-rare',
  superRare: 'rarity-superRare',
  ultraRare: 'rarity-ultraRare',
};

export const rarityWeights: Record<Rarity, number> = {
  common: 60,
  rare: 25,
  superRare: 10,
  ultraRare: 5,
};

export const rarityColors: Record<Rarity, { accent: string; glow: string; text: string }> = {
  common: { accent: '#64748b', glow: '#334155', text: '#f8fafc' },
  rare: { accent: '#38bdf8', glow: '#0ea5e9', text: '#ffffff' },
  superRare: { accent: '#8b5cf6', glow: '#7c3aed', text: '#ffffff' },
  ultraRare: { accent: '#f43f5e', glow: '#dc2626', text: '#ffffff' },
};

const monsterImages = {
  common1: new URL('../assets/images/monsters/am/am_com_1.jpg', import.meta.url).href,
  common2: new URL('../assets/images/monsters/am/am_com_2.jpg', import.meta.url).href,
  common3: new URL('../assets/images/monsters/am/am_com_3.jpg', import.meta.url).href,
  common4: new URL('../assets/images/monsters/am/am_com_4.jpg', import.meta.url).href,
  common5: new URL('../assets/images/monsters/am/am_com_5.jpg', import.meta.url).href,
  rare6: new URL('../assets/images/monsters/am/am_rare_6.jpg', import.meta.url).href,
  rare7: new URL('../assets/images/monsters/am/am_rare_7.jpg', import.meta.url).href,
  rare8: new URL('../assets/images/monsters/am/am_rare_8.jpg', import.meta.url).href,
  superRare9: new URL('../assets/images/monsters/am/am_super_rare_9.jpg', import.meta.url).href,
  ultraRare10: new URL('../assets/images/monsters/am/am_ultra_rare_10.jpg', import.meta.url).href,
};

const rarityMultiplier: Record<Rarity, number> = {
  common: 0.2,
  rare: 1,
  superRare: 2,
  ultraRare: 10,
};

export const createMonsters = (cost: number): Monster[] => [
  { name: 'Поварёжка', rarity: 'common', value: Math.round(cost * rarityMultiplier.common), image: monsterImages.common1 },
  { name: 'Спун', rarity: 'common', value: Math.round(cost * rarityMultiplier.common), image: monsterImages.common2 },
  { name: 'Одноглазый', rarity: 'common', value: Math.round(cost * rarityMultiplier.common), image: monsterImages.common3 },
  { name: 'Рисовака', rarity: 'common', value: Math.round(cost * rarityMultiplier.common), image: monsterImages.common4 },
  { name: 'Лейщик', rarity: 'common', value: Math.round(cost * rarityMultiplier.common), image: monsterImages.common5 },
  { name: 'Просто космос', rarity: 'rare', value: Math.round(cost * rarityMultiplier.rare), image: monsterImages.rare6 },
  { name: 'Железяка', rarity: 'rare', value: Math.round(cost * rarityMultiplier.rare), image: monsterImages.rare7 },
  { name: 'Ниндзюцу', rarity: 'rare', value: Math.round(cost * rarityMultiplier.rare), image: monsterImages.rare8 },
  { name: 'Фея', rarity: 'superRare', value: Math.round(cost * rarityMultiplier.superRare), image: monsterImages.superRare9 },
  { name: 'Яблочный король', rarity: 'ultraRare', value: Math.round(cost * rarityMultiplier.ultraRare), image: monsterImages.ultraRare10 },
];

export const createCollectionSlots = (): CollectionSlot[] => [
  { id: 1, rarity: 'common' },
  { id: 2, rarity: 'common' },
  { id: 3, rarity: 'common' },
  { id: 4, rarity: 'common' },
  { id: 5, rarity: 'common' },
  { id: 6, rarity: 'rare' },
  { id: 7, rarity: 'rare' },
  { id: 8, rarity: 'rare' },
  { id: 9, rarity: 'superRare' },
  { id: 10, rarity: 'ultraRare' },
];
