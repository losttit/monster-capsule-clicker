import {
  capsuleCost,
  createCollectionSlots,
  createMonsters,
  rarityWeights,
  STORAGE_DATA_PREFIX,
  STORAGE_THEME_KEY,
} from '../config/game';
import { GameState } from '../models/GameState';
import type { CollectionSlot, InventoryEntry, Monster, Rarity, SavedGame, Theme } from '../types/game';

export class GameService {
  private readonly monsters: Monster[];
  private readonly storage: Storage;
  readonly state: GameState;

  constructor(state: GameState = new GameState(), storage: Storage | null = window.localStorage) {
    this.state = state;
    this.monsters = createMonsters(capsuleCost);
    this.storage = storage ?? window.localStorage;
  }

  getMonsters(): Monster[] {
    return this.monsters;
  }

  getMonsterByName(name: string): Monster | undefined {
    return this.monsters.find((monster) => monster.name === name);
  }

  getInventoryEntry(name: string): InventoryEntry | undefined {
    return this.state.inventory[name];
  }

  getCollectionCount(): number {
    return this.state.collectionSlots.filter((slot) => slot.monster).length;
  }

  isMonsterCollected(monster: Monster): boolean {
    return this.state.collectionSlots.some((slot) => slot.monster?.name === monster.name);
  }

  getAvailableCollectionSlot(rarity: Rarity): CollectionSlot | undefined {
    return this.state.collectionSlots.find((slot) => slot.rarity === rarity && !slot.monster);
  }

  setTheme(theme: Theme): void {
    this.state.theme = theme;
    this.storage.setItem(STORAGE_THEME_KEY, theme);
  }

  toggleTheme(): Theme {
    const nextTheme: Theme = this.state.theme === 'light' ? 'dark' : 'light';
    this.setTheme(nextTheme);
    return nextTheme;
  }

  addCoins(amount: number): void {
    this.state.coins += amount;
  }

  buyClickUpgrade(): boolean {
    if (this.state.coins < this.state.clickUpgradeCost) {
      return false;
    }

    this.state.coins -= this.state.clickUpgradeCost;
    this.state.clickPower += 1;
    this.state.clickUpgradeCost = Math.ceil(this.state.clickUpgradeCost * 1.5);
    return true;
  }

  buyAutoUpgrade(): boolean {
    if (this.state.coins < this.state.autoUpgradeCost) {
      return false;
    }

    this.state.coins -= this.state.autoUpgradeCost;
    this.state.incomePerSecond += 1;
    this.state.autoUpgradeCost = Math.ceil(this.state.autoUpgradeCost * 1.5);
    return true;
  }

  trySpendCapsuleCost(): boolean {
    if (this.state.coins < capsuleCost) {
      return false;
    }

    this.state.coins -= capsuleCost;
    return true;
  }

  addMonsterToInventory(monster: Monster): void {
    if (!this.state.inventory[monster.name]) {
      this.state.inventory[monster.name] = { monster, count: 0 };
    }

    this.state.inventory[monster.name].count += 1;
    if (this.state.currentUser) {
      this.saveProgress();
    }
  }

  collectMonster(monster: Monster): boolean {
    if (this.isMonsterCollected(monster)) {
      return false;
    }

    const slot = this.getAvailableCollectionSlot(monster.rarity);
    if (!slot) {
      return false;
    }

    slot.monster = monster;

    const entry = this.state.inventory[monster.name];
    if (entry) {
      entry.count -= 1;
      if (entry.count <= 0) {
        delete this.state.inventory[monster.name];
      }
    }

    if (this.state.currentUser) {
      this.saveProgress();
    }

    return true;
  }

  sellMonster(name: string): boolean {
    const entry = this.state.inventory[name];
    if (!entry) {
      return false;
    }

    entry.count -= 1;
    this.state.coins += entry.monster.value;
    if (entry.count <= 0) {
      delete this.state.inventory[name];
    }

    return true;
  }

  chooseRarity(): Rarity {
    const roll = Math.random() * 100;
    let threshold = 0;
    for (const rarity of ['common', 'rare', 'superRare', 'ultraRare'] as Rarity[]) {
      threshold += rarityWeights[rarity];
      if (roll < threshold) {
        return rarity;
      }
    }
    return 'common';
  }

  rollMonster(): Monster {
    const rarity = this.chooseRarity();
    const candidates = this.monsters.filter((monster) => monster.rarity === rarity);
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  saveProgress(): void {
    if (!this.state.currentUser) {
      return;
    }

    const save: SavedGame = {
      coins: this.state.coins,
      clickPower: this.state.clickPower,
      incomePerSecond: this.state.incomePerSecond,
      clickUpgradeCost: this.state.clickUpgradeCost,
      autoUpgradeCost: this.state.autoUpgradeCost,
      inventory: Object.fromEntries(Object.entries(this.state.inventory).map(([name, entry]) => [name, entry.count])) as Record<string, number>,
      collection: this.state.collectionSlots.map((slot) => ({ id: slot.id, monsterName: slot.monster?.name })),
      theme: this.state.theme,
    };

    try {
      this.storage.setItem(this.getSaveKey(this.state.currentUser), JSON.stringify(save));
    } catch {
      console.warn('⚠️ Не удалось сохранить прогресс');
    }
  }

  loadProgress(login: string): boolean {
    const saved = this.storage.getItem(this.getSaveKey(login));
    if (!saved) {
      return false;
    }

    try {
      const parsed = JSON.parse(saved) as SavedGame;
      this.resetProgressState();
      this.state.coins = parsed.coins ?? 0;
      this.state.clickPower = parsed.clickPower ?? 1;
      this.state.incomePerSecond = parsed.incomePerSecond ?? 0;
      this.state.clickUpgradeCost = parsed.clickUpgradeCost ?? 10;
      this.state.autoUpgradeCost = parsed.autoUpgradeCost ?? 25;
      this.state.inventory = {};

      Object.entries(parsed.inventory ?? {}).forEach(([name, count]) => {
        const monster = this.getMonsterByName(name);
        if (monster && count > 0) {
          this.state.inventory[name] = { monster, count };
        }
      });

      this.state.collectionSlots = createCollectionSlots();
      this.state.collectionSlots.forEach((slot) => {
        const savedSlot = parsed.collection?.find((item) => item.id === slot.id);
        slot.monster = savedSlot?.monsterName ? this.getMonsterByName(savedSlot.monsterName) : undefined;
      });

      this.state.theme = parsed.theme ?? 'dark';
      return true;
    } catch {
      console.warn('⚠️ Не удалось загрузить прогресс');
      return false;
    }
  }

  setCurrentUser(login: string): void {
    this.state.currentUser = login;
    if (!this.loadProgress(login)) {
      this.resetProgressState();
      this.state.currentUser = login;
      this.state.theme = 'dark';
      this.saveProgress();
    }
  }

  resetUserSession(): void {
    this.state.currentUser = null;
  }

  resetProgress(): void {
    if (!this.state.currentUser) {
      return;
    }

    this.storage.removeItem(this.getSaveKey(this.state.currentUser));
    this.resetProgressState();
    this.saveProgress();
  }

  private resetProgressState(): void {
    this.state.coins = 0;
    this.state.clickPower = 1;
    this.state.incomePerSecond = 0;
    this.state.clickUpgradeCost = 10;
    this.state.autoUpgradeCost = 25;
    this.state.inventory = {};
    this.state.collectionSlots = createCollectionSlots();
    this.state.theme = 'dark';
  }

  private getSaveKey(login: string): string {
    return `${STORAGE_DATA_PREFIX}${login}`;
  }
}
