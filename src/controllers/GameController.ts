import {
  capsuleCost,
  rarityClasses,
  rarityLabels,
  STORAGE_THEME_KEY,
  STORAGE_USER_KEY,
} from '../config/game';
import { GameService } from '../services/GameService';
import type { Theme } from '../types/game';
import { getMonsterImage } from '../utils/monster';

interface GameElements {
  clicker: HTMLButtonElement;
  coinsDisplay: HTMLElement;
  incomeDisplay: HTMLElement;
  clickUpgradeBtn: HTMLButtonElement;
  autoUpgradeBtn: HTMLButtonElement;
  clickUpgradeCostEl: HTMLElement;
  autoUpgradeCostEl: HTMLElement;
  openCapsuleBtn: HTMLButtonElement;
  inventoryBtn: HTMLButtonElement;
  capsuleModal: HTMLElement;
  inventoryModal: HTMLElement;
  collectionModal: HTMLElement;
  capsuleClose: HTMLButtonElement;
  inventoryClose: HTMLButtonElement;
  collectionClose: HTMLButtonElement;
  monsterReveal: HTMLElement;
  monsterDetails: HTMLElement;
  inventoryList: HTMLElement;
  collectionGrid: HTMLElement;
  collectionStatus: HTMLElement;
  capsuleCollectionAction: HTMLElement;
  capsuleScroll: HTMLElement;
  capsuleScrollTrack: HTMLElement;
  clickPowerDisplay: HTMLElement;
  themeToggleBtn: HTMLButtonElement;
  loginModal: HTMLElement;
  loginNameInput: HTMLInputElement;
  loginBtn: HTMLButtonElement;
  userDisplay: HTMLElement;
  logoutBtn: HTMLButtonElement;
  resetBtn: HTMLButtonElement;
  collectionBtn: HTMLButtonElement;
}

export class GameController {
  private readonly gameService: GameService;
  private readonly elements: GameElements;

  constructor(gameService: GameService, elements: GameElements) {
    this.gameService = gameService;
    this.elements = elements;
  }

  init(): void {
    const savedTheme = (localStorage.getItem(STORAGE_THEME_KEY) === 'light' ? 'light' : 'dark') as Theme;
    this.applyTheme(savedTheme);

    const savedUser = localStorage.getItem(STORAGE_USER_KEY);
    if (savedUser) {
      this.login(savedUser);
    }

    this.bindEvents();
    this.updateDisplays();
    this.renderInventory();
    this.renderCollection();

    window.setInterval(() => {
      if (this.gameService.state.incomePerSecond > 0) {
        this.gameService.addCoins(this.gameService.state.incomePerSecond);
        this.updateDisplays();
        console.log(`⏱️ +${this.gameService.state.incomePerSecond} авто-доход, всего ${this.gameService.state.coins}`);
      }
    }, 1000);
  }

  private bindEvents(): void {
    this.elements.clicker.addEventListener('click', () => {
      this.gameService.addCoins(this.gameService.state.clickPower);
      this.updateDisplays();
      console.log(`💰 Клик +${this.gameService.state.clickPower}, всего ${this.gameService.state.coins}`);
    });

    this.elements.clickUpgradeBtn.addEventListener('click', () => {
      if (this.gameService.buyClickUpgrade()) {
        this.updateDisplays();
        console.log(`✨ Улучшен клик до ${this.gameService.state.clickPower}`);
      }
    });

    this.elements.autoUpgradeBtn.addEventListener('click', () => {
      if (this.gameService.buyAutoUpgrade()) {
        this.updateDisplays();
        console.log(`⚙️ Авто-доход +1, всего ${this.gameService.state.incomePerSecond}/сек`);
      }
    });

    this.elements.openCapsuleBtn.addEventListener('click', () => this.openCapsule());

    this.elements.inventoryBtn.addEventListener('click', () => {
      this.renderInventory();
      this.elements.inventoryModal.classList.remove('hidden');
    });

    this.elements.collectionBtn.addEventListener('click', () => {
      this.renderCollection();
      this.elements.collectionModal.classList.remove('hidden');
    });

    this.elements.capsuleClose.addEventListener('click', () => this.closeModal(this.elements.capsuleModal));
    this.elements.inventoryClose.addEventListener('click', () => this.closeModal(this.elements.inventoryModal));
    this.elements.collectionClose.addEventListener('click', () => this.closeModal(this.elements.collectionModal));

    this.elements.loginBtn.addEventListener('click', () => {
      const login = this.elements.loginNameInput.value.trim();
      if (!login) {
        alert('Введите логин, чтобы продолжить.');
        return;
      }
      this.login(login);
    });

    this.elements.logoutBtn.addEventListener('click', () => {
      this.gameService.resetUserSession();
      this.updateUserUI(null);
      this.elements.loginNameInput.value = '';
    });

    this.elements.resetBtn.addEventListener('click', () => {
      const confirmReset = confirm('Вы точно хотите сбросить прогресс для этого логина?');
      if (!confirmReset) {
        return;
      }
      this.gameService.resetProgress();
      this.updateDisplays();
      this.renderInventory();
      this.renderCollection();
      alert('Прогресс сброшен.');
    });

    this.elements.themeToggleBtn.addEventListener('click', () => {
      const nextTheme = this.gameService.toggleTheme();
      this.applyTheme(nextTheme);
    });
  }

  private login(login: string): void {
    this.gameService.setCurrentUser(login);
    this.updateUserUI(login);
    this.applyTheme(this.gameService.state.theme);
    this.updateDisplays();
    this.renderInventory();
    this.renderCollection();
  }

  private openCapsule(): void {
    if (!this.gameService.trySpendCapsuleCost()) {
      alert(`Не хватает монет. Нужно ${capsuleCost} монет.`);
      return;
    }

    this.updateDisplays();
    this.elements.capsuleModal.classList.remove('hidden');
    this.elements.monsterReveal.className = 'monster-reveal';
    this.elements.monsterReveal.classList.remove('show');
    this.elements.monsterReveal.innerHTML = '<span class="monster-reveal-placeholder">?</span>';
    this.elements.monsterDetails.textContent = 'Ожидание результата...';

    const monster = this.gameService.rollMonster();

    this.elements.capsuleScroll.classList.remove('hidden');
    const visibleItemsCount = 9;
    const winnerIndex = 6;
    const scrollItems = Array.from({ length: visibleItemsCount + 4 }, (_, index) => {
      if (index === winnerIndex) {
        return monster;
      }
      return this.gameService.getMonsters()[Math.floor(Math.random() * this.gameService.getMonsters().length)];
    });

    this.elements.capsuleScrollTrack.innerHTML = scrollItems
      .map((item) => `
        <div class="capsule-scroll-item">
          <img src="${getMonsterImage(item)}" alt="${item.name}" />
          <div class="capsule-scroll-item-name">${item.name}</div>
        </div>`)
      .join('');
    this.elements.capsuleScrollTrack.style.transition = 'none';
    this.elements.capsuleScrollTrack.style.transform = 'translateX(0px)';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const itemFullWidth = 104;
        const trackPadding = 12;
        const scrollWidth = this.elements.capsuleScroll.clientWidth;
        const centerOffset = scrollWidth / 2 - itemFullWidth / 2 - trackPadding;
        const targetX = -(itemFullWidth * winnerIndex - centerOffset);
        this.elements.capsuleScrollTrack.style.transition = 'transform 3s cubic-bezier(0.4, 0, 0.2, 1)';
        this.elements.capsuleScrollTrack.style.transform = `translateX(${targetX}px)`;
      });
    });

    window.setTimeout(() => {
      this.elements.capsuleScroll.classList.add('hidden');
      this.elements.monsterReveal.innerHTML = '';
      const monsterImage = document.createElement('img');
      monsterImage.src = getMonsterImage(monster);
      monsterImage.alt = monster.name;
      this.elements.monsterReveal.appendChild(monsterImage);
      this.elements.monsterReveal.classList.add('show', rarityClasses[monster.rarity]);
      this.elements.monsterDetails.innerHTML = `
        <div class="monster-result-name">${monster.name}</div>
        <div class="monster-result-meta">
          <span class="rarity-badge ${rarityClasses[monster.rarity]}">${rarityLabels[monster.rarity]}</span>
          <span>Стоимость: ${monster.value} мон.</span>
        </div>`;

      this.gameService.addMonsterToInventory(monster);

      this.elements.capsuleCollectionAction.innerHTML = '';
      if (this.gameService.isMonsterCollected(monster)) {
        this.elements.capsuleCollectionAction.textContent = 'Уже в коллекции';
      } else if (this.gameService.getAvailableCollectionSlot(monster.rarity)) {
        const collectButton = document.createElement('button');
        collectButton.className = 'action-btn';
        collectButton.textContent = 'Добавить в коллекцию';
        collectButton.addEventListener('click', () => {
          if (this.gameService.collectMonster(monster)) {
            collectButton.textContent = 'В коллекции';
            collectButton.disabled = true;
            this.renderInventory();
            this.renderCollection();
          }
        });
        this.elements.capsuleCollectionAction.appendChild(collectButton);
      } else {
        this.elements.capsuleCollectionAction.textContent = 'Свободных слотов нет';
      }

      console.log(`🎉 Получен монстр: ${monster.name}`);
    }, 3500);
  }

  private closeModal(modal: HTMLElement | null): void {
    if (!modal) {
      return;
    }

    modal.classList.add('hidden');
  }

  private applyTheme(theme: Theme): void {
    document.body.classList.toggle('theme-light', theme === 'light');
    this.elements.themeToggleBtn.textContent = theme === 'light' ? 'Темная тема' : 'Светлая тема';
    this.elements.themeToggleBtn.setAttribute('aria-pressed', String(theme === 'light'));
    this.gameService.setTheme(theme);
  }

  private updateUserUI(login: string | null): void {
    this.elements.userDisplay.textContent = login ?? 'Гость';
    this.elements.logoutBtn.classList.toggle('hidden', !login);
    this.elements.resetBtn.classList.toggle('hidden', !login);
    this.elements.loginModal.classList.toggle('hidden', Boolean(login));
  }

  private updateDisplays(): void {
    this.elements.coinsDisplay.textContent = this.gameService.state.coins.toString();
    this.elements.incomeDisplay.textContent = this.gameService.state.incomePerSecond.toString();
    this.elements.clickPowerDisplay.textContent = this.gameService.state.clickPower.toString();
    this.elements.clickUpgradeCostEl.textContent = this.gameService.state.clickUpgradeCost.toString();
    this.elements.autoUpgradeCostEl.textContent = this.gameService.state.autoUpgradeCost.toString();
    if (this.gameService.state.currentUser) {
      this.gameService.saveProgress();
    }
  }

  private renderInventory(): void {
    const inventory = this.gameService.state.inventory;
    const keys = Object.keys(inventory);
    if (keys.length === 0) {
      this.elements.inventoryList.textContent = 'Пусто';
      return;
    }

    this.elements.inventoryList.innerHTML = keys
      .map((name) => {
        const entry = inventory[name];
        const rarityClass = rarityClasses[entry.monster.rarity];
        const totalValue = entry.monster.value * entry.count;
        const canCollect = !this.gameService.isMonsterCollected(entry.monster) && !!this.gameService.getAvailableCollectionSlot(entry.monster.rarity);
        const alreadyCollected = this.gameService.isMonsterCollected(entry.monster);

        return `
          <div class="inventory-item ${rarityClass}">
            <div class="inventory-item-content">
              <img class="inventory-item-image" src="${getMonsterImage(entry.monster)}" alt="${entry.monster.name}" />
              <div>
                <div class="inventory-item-name">${entry.monster.name}</div>
                <div class="inventory-item-meta">
                  <span class="rarity-badge ${rarityClass}">${rarityLabels[entry.monster.rarity]}</span>
                  <span>Стоимость: ${entry.monster.value} мон.</span>
                  <span>Всего: ${totalValue} мон.</span>
                </div>
              </div>
            </div>
            <div class="inventory-item-actions">
              <span class="inventory-item-count">x${entry.count}</span>
              <button class="sell-monster-btn" data-name="${name}">Продать</button>
              <button class="sell-monster-btn" data-collect="${name}" ${alreadyCollected || !canCollect ? 'disabled' : ''}>
                ${alreadyCollected ? 'В коллекции' : canCollect ? 'В коллекцию' : 'Нет слота'}
              </button>
            </div>
          </div>`;
      })
      .join('');

    this.elements.inventoryList.querySelectorAll<HTMLButtonElement>('.sell-monster-btn').forEach((button) => {
      const name = button.dataset.name;
      const collectName = button.dataset.collect;

      if (name) {
        button.addEventListener('click', () => {
          if (this.gameService.sellMonster(name)) {
            this.updateDisplays();
            this.renderInventory();
            console.log(`💵 Продан ${name} за ${this.gameService.getInventoryEntry(name)?.monster.value ?? 0} монет`);
          }
        });
      }

      if (collectName) {
        button.addEventListener('click', () => {
          const entry = this.gameService.getInventoryEntry(collectName);
          if (!entry) {
            return;
          }
          if (this.gameService.collectMonster(entry.monster)) {
            this.renderInventory();
            this.renderCollection();
          }
        });
      }
    });
  }

  private renderCollection(): void {
    const collected = this.gameService.getCollectionCount();
    this.elements.collectionStatus.textContent = `Собрано ${collected} / 10`;
    this.elements.collectionGrid.innerHTML = this.gameService.state.collectionSlots
      .map((slot) => {
        const rarityName = rarityLabels[slot.rarity];
        if (!slot.monster) {
          return `
            <div class="collection-slot empty">
              <div class="collection-slot-title">Слот ${slot.id}</div>
              <div class="collection-slot-subtitle">${rarityName}</div>
              <div class="collection-slot-empty">+</div>
            </div>`;
        }

        return `
          <div class="collection-slot">
            <img src="${getMonsterImage(slot.monster)}" alt="${slot.monster.name}" />
            <div class="collection-slot-title">${slot.monster.name}</div>
            <div class="collection-slot-subtitle">${rarityName}</div>
          </div>`;
      })
      .join('');
  }
}
