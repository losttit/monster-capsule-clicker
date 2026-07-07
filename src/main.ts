import { GameController } from './controllers/GameController';
import { GameService } from './services/GameService';

const clicker = document.getElementById('clicker') as HTMLButtonElement | null;
const coinsDisplay = document.getElementById('coins');
const incomeDisplay = document.getElementById('income');
const clickUpgradeBtn = document.getElementById('click-upgrade') as HTMLButtonElement | null;
const autoUpgradeBtn = document.getElementById('auto-upgrade') as HTMLButtonElement | null;
const clickUpgradeCostEl = document.getElementById('click-upgrade-cost');
const autoUpgradeCostEl = document.getElementById('auto-upgrade-cost');
const openCapsuleBtn = document.getElementById('open-capsule-btn') as HTMLButtonElement | null;
const inventoryBtn = document.getElementById('inventory-btn') as HTMLButtonElement | null;
const capsuleModal = document.getElementById('capsule-modal');
const inventoryModal = document.getElementById('inventory-modal');
const collectionModal = document.getElementById('collection-modal');
const collectionBtn = document.getElementById('collection-btn') as HTMLButtonElement | null;
const capsuleClose = document.getElementById('capsule-close') as HTMLButtonElement | null;
const inventoryClose = document.getElementById('inventory-close') as HTMLButtonElement | null;
const collectionClose = document.getElementById('collection-close') as HTMLButtonElement | null;
const monsterReveal = document.getElementById('monster-reveal');
const monsterDetails = document.getElementById('monster-details');
const inventoryList = document.getElementById('inventory-list');
const collectionGrid = document.getElementById('collection-grid');
const collectionStatus = document.getElementById('collection-status');
const capsuleCollectionAction = document.getElementById('capsule-collection-action');
const capsuleScroll = document.getElementById('capsule-scroll');
const capsuleScrollTrack = document.getElementById('capsule-scroll-track');
const clickPowerDisplay = document.getElementById('click-power');
const themeToggleBtn = document.getElementById('theme-toggle-btn') as HTMLButtonElement | null;
const loginModal = document.getElementById('login-modal');
const loginNameInput = document.getElementById('login-name') as HTMLInputElement | null;
const loginBtn = document.getElementById('login-btn') as HTMLButtonElement | null;
const userDisplay = document.getElementById('user-display');
const logoutBtn = document.getElementById('logout-btn') as HTMLButtonElement | null;
const resetBtn = document.getElementById('reset-btn') as HTMLButtonElement | null;

if (
  !clicker ||
  !coinsDisplay ||
  !incomeDisplay ||
  !clickPowerDisplay ||
  !clickUpgradeBtn ||
  !autoUpgradeBtn ||
  !clickUpgradeCostEl ||
  !autoUpgradeCostEl ||
  !openCapsuleBtn ||
  !inventoryBtn ||
  !collectionBtn ||
  !capsuleModal ||
  !inventoryModal ||
  !collectionModal ||
  !capsuleClose ||
  !inventoryClose ||
  !collectionClose ||
  !monsterReveal ||
  !monsterDetails ||
  !inventoryList ||
  !collectionGrid ||
  !collectionStatus ||
  !capsuleCollectionAction ||
  !capsuleScroll ||
  !capsuleScrollTrack ||
  !themeToggleBtn ||
  !loginModal ||
  !loginNameInput ||
  !loginBtn ||
  !userDisplay ||
  !logoutBtn ||
  !resetBtn
) {
  console.error('❌ Элементы не найдены');
  throw new Error('Missing required game elements');
}

const controller = new GameController(
  new GameService(),
  {
    clicker,
    coinsDisplay,
    incomeDisplay,
    clickUpgradeBtn,
    autoUpgradeBtn,
    clickUpgradeCostEl,
    autoUpgradeCostEl,
    openCapsuleBtn,
    inventoryBtn,
    capsuleModal,
    inventoryModal,
    collectionModal,
    collectionBtn,
    capsuleClose,
    inventoryClose,
    collectionClose,
    monsterReveal,
    monsterDetails,
    inventoryList,
    collectionGrid,
    collectionStatus,
    capsuleCollectionAction,
    capsuleScroll,
    capsuleScrollTrack,
    clickPowerDisplay,
    themeToggleBtn,
    loginModal,
    loginNameInput,
    loginBtn,
    userDisplay,
    logoutBtn,
    resetBtn,
  },
);

controller.init();
console.log('🎮 Игра запущена');

