import Character from "./Character.js";
import Dungeon from "./Dungeon.js";

// create instances of default characters
export const char1 = new Character("Eowyn", "Knight", [
  { skillName: "Pierce", damage: 15 },
  { skillName: "Slash", damage: 10 },
  { skillName: "Raging Blade", damage: 18 },
]);
export const char2 = new Character("Elora", "Fire Mage", [
  { skillName: "Fireball", damage: 12 },
  { skillName: "Fire Arrow", damage: 10 },
  { skillName: "Inferno", damage: 20 },
]);
export const char3 = new Character("Galadriel", "Hunter", [
  { skillName: "Attack Boost", damage: 12 },
  { skillName: "Bombardier", damage: 15 },
  { skillName: "Critical Boost", damage: 18 },
]);
export const char4 = new Character("Thalia", "Archer", [
  { skillName: "Wind Arrow", damage: 10 },
  { skillName: "Earth Blast", damage: 20 },
  { skillName: "Vicious Arrow", damage: 15 },
]);
export const char5 = new Character("Darvin", "Necromancer", [
  { skillName: "Skeleton Attack", damage: 10 },
  { skillName: "Soul Curse", damage: 20 },
  { skillName: "Corpse Explosion", damage: 17 },
]);

// Create Monsters characters and add the to the dungeon
const slime = new Character(
  "👾 Slime",
  "Monster",
  [{ skillName: "Bounce", damage: 5 }],
  20,
  1
);
const goblin = new Character(
  "👺 Goblin",
  "Monster",
  [{ skillName: "Toxic Slam", damage: 10 }],
  40,
  1
);
const ogre = new Character(
  "👹 Ogre",
  "Monster",
  [
    { skillName: "Intimidation", damage: 12 },
    { skillName: "Brute Punch", damage: 15 },
  ],
  60,
  2
);
const lich = new Character(
  "💀 Lich",
  "Undead",
  [
    { skillName: "Paralise", damage: 15 },
    { skillName: "Curse", damage: 20 },
  ],
  90,
  3
);
const dragon = new Character(
  "Celestial Dragon 🐉",
  "Dragon",
  [
    { skillName: "Breath", damage: 20 },
    { skillName: "Fire Storm", damage: 25 },
    { skillName: "Rage", damage: 18 },
  ],
  200,
  5
);

export const dungeon = new Dungeon(
  "Dragon's Lair",
  5,
  [slime, goblin, ogre, lich],
  dragon
);
