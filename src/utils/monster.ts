import type { Monster } from '../types/game';
import { rarityColors } from '../config/game';

export const escapeSvgText = (value: string): string => value.replace(/[<>&"']/g, (char) => {
  switch (char) {
    case '<':
      return '&lt;';
    case '>':
      return '&gt;';
    case '&':
      return '&amp;';
    case '"':
      return '&quot;';
    case "'":
      return '&#39;';
    default:
      return char;
  }
});

export const createMonsterImage = (monster: Monster): string => {
  const colors = rarityColors[monster.rarity];
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
      <rect width="256" height="256" rx="40" fill="${colors.glow}" />
      <circle cx="128" cy="112" r="70" fill="${colors.accent}" opacity="0.95" />
      <rect x="72" y="162" width="112" height="44" rx="22" fill="#111827" opacity="0.85" />
      <text x="128" y="92" text-anchor="middle" font-size="44" font-family="Arial, sans-serif">${escapeSvgText(monster.emoji ?? '?')}</text>
      <text x="128" y="228" text-anchor="middle" font-size="22" font-family="Arial, sans-serif" fill="${colors.text}" font-weight="700">${escapeSvgText(monster.name)}</text>
    </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export const getMonsterImage = (monster: Monster): string => monster.image ?? createMonsterImage(monster);
