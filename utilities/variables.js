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
// 1st Dungeon
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

export const dungeon1 = new Dungeon(
  "Dragon's Lair",
  5,
  [slime, goblin, ogre, lich],
  dragon
);

// 2nd Dungeon
const elemental = new Character(
  "Thunder Elemental",
  "Elemental",
  [{ skillName: "Lightning Bolt", damage: 8 }],
  30,
  1
);
const golem = new Character(
  "Golem of Stone",
  "Golem",
  [{ skillName: "Earthen Slam", damage: 12 }],
  50,
  1
);
const griffin = new Character(
  "Sable Griffin",
  "Monster",
  [
    { skillName: "Razor Talons", damage: 15 },
    { skillName: "Glorious Charge", damage: 17 },
  ],
  70,
  2
);
const gorgon = new Character(
  "Magma Gorgon",
  "Monster",
  [
    { skillName: "Molten Gaze", damage: 17 },
    { skillName: "Marsh Overlord", damage: 21 },
  ],
  90,
  3
);
const phoenix = new Character(
  "Crystal Phoneix",
  "Phoenix",
  [
    { skillName: "Shattering Blaze", damage: 25 },
    { skillName: "Flame Breath", damage: 19 },
  ],
  250,
  7
);

export const dungeon2 = new Dungeon(
  "Mystic Labyrinth",
  5,
  [elemental, golem, griffin, gorgon],
  phoenix
);

// 3rd dungeon
const wraith = new Character(
  "Shadow Wraith",
  "Undead",
  [{ skillName: "Spectral Grasp", damage: 10 }],
  60,
  2
);
const chimera = new Character(
  "Chimera",
  "Monster",
  [{ skillName: "Multi-headed Fury", damage: 14 }],
  80,
  2
);
const specter = new Character(
  "Frost Specter",
  "Undead",
  [
    { skillName: "Frozen Touch", damage: 17 },
    { skillName: "Corrupting Aura", damage: 21 },
  ],
  95,
  2
);
const succubus = new Character(
  "Demon Succubus",
  "Demon",
  [
    { skillName: "Seductive Hex", damage: 19 },
    { skillName: "Fear Imprint", damage: 23 },
  ],
  110,
  3
);
const knight = new Character(
  "Death Knight",
  "Undead",
  [
    { skillName: "Cursed Slash", damage: 22 },
    { skillName: "Terrifying Suppression", damage: 25 },
    { skillName: "Death Charge", damage: 24 },
  ],
  120,
  3
);
const banshee = new Character(
  "Spectral Banshee",
  "Undead",
  [
    { skillName: "Wail of the Damned", damage: 20 },
    { skillName: "Horrifying Visage", damage: 25 },
    { skillName: "Corrupting Touch", damage: 30 },
    { skillName: "Sonic Boom", damage: 35 },
  ],
  300,
  8
);
export const dungeon3 = new Dungeon(
  "Cavern of Despair",
  6,
  [wraith, chimera, specter, succubus, knight],
  banshee
);
