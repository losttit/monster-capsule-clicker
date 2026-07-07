export type Theme = 'dark' | 'light';

export type Rarity = 'common' | 'rare' | 'superRare' | 'ultraRare';

export interface Monster {
  name: string;
  emoji?: string;
  rarity: Rarity;
  value: number;
  image?: string;
}

export interface InventoryEntry {
  monster: Monster;
  count: number;
}

export interface CollectionSlot {
  id: number;
  rarity: Rarity;
  monster?: Monster;
}

export interface SavedGame {
  coins: number;
  clickPower: number;
  incomePerSecond: number;
  clickUpgradeCost: number;
  autoUpgradeCost: number;
  inventory: Record<string, number>;
  collection: Array<{ id: number; monsterName?: string }>;
  theme: Theme;
}
