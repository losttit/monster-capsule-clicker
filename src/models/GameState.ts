import type { CollectionSlot, InventoryEntry, Theme } from '../types/game';
import { createCollectionSlots } from '../config/game';

export class GameState {
  coins = 0;
  clickPower = 1;
  incomePerSecond = 0;
  clickUpgradeCost = 10;
  autoUpgradeCost = 25;
  inventory: Record<string, InventoryEntry> = {};
  collectionSlots: CollectionSlot[] = createCollectionSlots();
  currentUser: string | null = null;
  theme: Theme = 'dark';
}
