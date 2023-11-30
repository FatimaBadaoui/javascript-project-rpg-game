import rs from "readline-sync";
import fs from "fs";

// Define the class to represent the game character
class Character {
  constructor(name, job = "", skills = [], hp = 100, exp = 0) {
    this.name = name;
    this.job = job;
    this.hp = hp;
    this.skills = skills;
    this.exp = exp;
  }
  openStatus() {
    return `
        --------------------------------------------
        - Name: ${this.name}
        - Class: ${this.job}
        - HP: ${this.hp} points
        - Skills: ${this.skills.map(
          (skill) => `\n\t\t${skill.skillName} (${skill.damage} damage ponits)`
        )}
        - EXP: ${this.exp} points
        ---------------------------------------------
        `;
  }
  attack(target, indexSkill) {
    target.hp -= this.skills[indexSkill].damage;
    console.log(
      `\n\u{2694} ${this.name} attacked ${target.name} with a ${this.skills[indexSkill].skillName} giving a damage of ${this.skills[indexSkill].damage}. \n${target.name} hp is now ${target.hp}`
    );
  }
  listSkills() {
    console.log(`
    ${this.name}'s skills:
    ${this.skills.map(
      (skill, index) =>
        `\n\t${index + 1}. ${skill.skillName} (${skill.damage} damage points)`
    )}
    `);
  }
  addEXPPoints(indexSkill, points) {
    if (points > this.exp) {
      console.log(`\nYou only have ${this.exp} points. You can't add more!`);
    } else {
      this.skills[indexSkill].damage += points;
      this.exp -= points;
      console.log(`\n${points} points were added successfully!`);
    }
  }
}

// Define a class to represent the game
class RPGGame {
  constructor(name, characters = []) {
    this.name = name;
    this.characters = characters;
    this.players = this.readPlayersFromJson();
  }
  readPlayersFromJson() {
    // check if the file exists
    const filename = "players.json";
    if (fs.existsSync(filename)) {
      let rawData = fs.readFileSync(filename);
      let playerObjects = JSON.parse(rawData);
      return playerObjects.map(
        (player) => new Character(player.name, player.job, player.skills)
      );
    } else {
      return [];
    }
  }
  savePlayersToJson() {
    fs.writeFileSync("players.json", JSON.stringify(this.players));
  }

  listCharacters() {
    this.characters.forEach((character, index) =>
      console.log(`${index + 1}.\n ${character.openStatus()}`)
    );
  }
  createNewcharacter() {
    const name = rs.question("Enter the name: ");
    // check if the name is already used by another player
    const alreadyInUse = this.players.find(
      (player) => player.name.toLowerCase() === name
    );

    if (alreadyInUse !== undefined) {
      rs.question(
        `\nThe name ${name} has been already used. Press Enter to go back...`
      );
      return undefined;
    }
    const job = rs.question("Enter the class: ");
    const skill1 = rs.question("Enter the first skill: ");
    const damage1 = Math.round(Math.random() * 10) + 10; // damage from 10 to 20
    const skill2 = rs.question("Enter the second skill: ");
    const damage2 = Math.round(Math.random() * 10) + 10; // damage from 10 to 20
    const skill3 = rs.question("Enter the third skill: ");
    const damage3 = Math.round(Math.random() * 10) + 10; // damage from 10 to 20

    const player = new Character(name, job, [
      { skillName: skill1, damage: damage1 },
      { skillName: skill2, damage: damage2 },
      { skillName: skill3, damage: damage3 },
    ]);

    this.players.push(player);
    this.savePlayersToJson();
    return player;
  }
  logBackIn() {
    const name = rs.question("\nEnter the name of your character: ");
    const myCharacter = this.players.find(
      (player) => player.name.toLowerCase() === name
    );
    if (myCharacter === undefined) {
      rs.question(
        `\nThe character ${name} doesn't exist! press Enter to go back...`
      );
    }
    return myCharacter;
  }
  playAsGuest() {
    this.listCharacters();
    // choose one from the list
    const indexCharacter = Number(
      rs.question("Enter the index of the chosen character: ")
    );

    return this.characters[indexCharacter - 1];
  }
  playerVsPlayer(player, target) {
    let round = 1;
    while (player.hp > 0 && target.hp > 0) {
      console.log(`\n------- Round ${round} -------`);
      // player starts
      // choose the skill with which the player will attack the target
      player.listSkills();
      let indexSkill = Number(rs.question("Select the index of the skill: "));
      // if input is invalid skip the code below and start again
      if (
        indexSkill < 1 ||
        indexSkill > player.skills.length ||
        isNaN(indexSkill)
      ) {
        console.log("\nINVALID INPUT! TRY AGAIN...\n");
        continue;
      }
      player.attack(target, indexSkill - 1);
      // if the target is K.O. exit the while without the target attack
      if (target.hp <= 0) {
        break;
      }
      // target turn
      target.attack(player, Math.floor(Math.random() * target.skills.length));

      round++;
    }

    if (player.hp > 0) {
      player.exp += target.exp === 0 ? 5 : target.exp;
      console.log(
        `\nCongratulations, ${player.name}. You are the Winner!\nYou receive ${target.exp} experience points.\n`
      );
    } else {
      console.log("\nYou have lost. Better next time!\n");
    }
  }
  exploreDungeon(player, dungeon) {
    console.log("\nDungeon's Info:\n", dungeon.displayInfo());
    rs.question("\nPress Enter to explore the dungeon...");
    dungeon.fightMonsters(rPGGame, player);
    // if player reaches the boss floor alive then fight the boss
    if (player.hp > 0 && dungeon.currentFloor === dungeon.numberOfFloors) {
      dungeon.fightBoss(rPGGame, player);
    }
  }
}

// define class to represent a Dungeon
class Dungeon {
  constructor(name, numberOfFloors, monsters, boss) {
    this.name = name;
    this.numberOfFloors = numberOfFloors;
    this.monsters = monsters;
    this.boss = boss;
    this.currentFloor = 1;
  }
  displayInfo() {
    return `
    _______________ ${this.name} _______________

      - Number of Floors: ${this.numberOfFloors}
      - Monsters: ${this.monsters.map((monster) => monster.name).join(", ")}
      - Monster Boss: ${this.boss.name}
    ____________________________________________
    `;
  }
  createFloor(monster) {
    const floor = [];
    for (let i = 0; i < 5; i++) {
      floor.push(
        new Character(
          monster.name,
          monster.job,
          monster.skills,
          monster.hp,
          monster.exp
        )
      );
    }
    return floor;
  }
  fightMonsters(rPGGame, player) {
    while (player.hp > 0 && this.currentFloor < this.numberOfFloors) {
      const monster = this.monsters[this.currentFloor - 1];
      console.clear();
      console.log(
        `\n${player.name} has entered the floor number ${this.currentFloor}. This floor is inhabited by ${monster.name}s.`
      );
      // show info about the monster
      console.log(`\n${monster.name}'s info:\n${monster.openStatus()}`);
      // before any floor reset hp
      player.hp = 100;
      // continue exploring or exit the dungeon
      const explore = rs.question(
        "\nDo you want to explore this floor? (y | n): "
      );
      if (!["y", "yes"].includes(explore.toLowerCase())) {
        return this.currentFloor;
      }
      // fight monsters on each floor
      const floor = this.createFloor(monster);
      for (let i = 0; i < floor.length; i++) {
        console.log(
          `\nThere are still ${floor.length - i} ${
            monster.name
          }s on this floor.`
        );
        rPGGame.playerVsPlayer(player, floor[i]);
        if (player.hp <= 0) return;
      }
      // proceed to the next floor
      this.currentFloor++;
    }
  }
  fightBoss(rPGGame, player) {
    // reset player hp
    player.hp = 100;
    console.clear();
    console.log(
      `__ ${player.name} has entered the Boss floor. The boss is ${this.boss.name} __`
    );
    rPGGame.playerVsPlayer(player, this.boss);
  }
}

// create instances of default characters
const char1 = new Character("Eowyn", "Knight", [
  { skillName: "Pierce", damage: 15 },
  { skillName: "Slash", damage: 10 },
  { skillName: "Raging Blade", damage: 18 },
]);
const char2 = new Character("Elora", "Fire Mage", [
  { skillName: "Fireball", damage: 12 },
  { skillName: "Fire Arrow", damage: 10 },
  { skillName: "Inferno", damage: 20 },
]);
const char3 = new Character("Galadriel", "Hunter", [
  { skillName: "Attack Boost", damage: 12 },
  { skillName: "Bombardier", damage: 15 },
  { skillName: "Critical Boost", damage: 18 },
]);
const char4 = new Character("Thalia", "Archer", [
  { skillName: "Wind Arrow", damage: 10 },
  { skillName: "Earth Blast", damage: 20 },
  { skillName: "Vicious Arrow", damage: 15 },
]);
const char5 = new Character("Darvin", "Necromancer", [
  { skillName: "Skeleton Attack", damage: 10 },
  { skillName: "Soul Curse", damage: 20 },
  { skillName: "Corpse Explosion", damage: 17 },
]);

// Create an instance of the RPG Game
const rPGGame = new RPGGame("Swords and Magic", [
  char1,
  char2,
  char3,
  char4,
  char5,
]);

// Create Monsters characters and add the to the dungeon
const slime = new Character(
  "Slime",
  "Monster",
  [{ skillName: "Bounce", damage: 5 }],
  20,
  1
);
const goblin = new Character(
  "Goblin",
  "Monster",
  [{ skillName: "Toxic Slam", damage: 10 }],
  40,
  1
);
const orc = new Character(
  "Orc",
  "Monster",
  [
    { skillName: "Intimidation", damage: 12 },
    { skillName: "Brute Punch", damage: 15 },
  ],
  60,
  2
);
const Lich = new Character(
  "Lich",
  "Undead",
  [
    { skillName: "Paralise", damage: 15 },
    { skillName: "Curse", damage: 20 },
  ],
  90,
  3
);
const dragon = new Character(
  "Dragon",
  "Dragon",
  [
    { skillName: "Breath", damage: 18 },
    { skillName: "Fire Storm", damage: 20 },
    { skillName: "Rage", damage: 16 },
  ],
  120,
  5
);

const dungeon = new Dungeon(
  "Dragon Lair",
  5,
  [slime, goblin, orc, Lich],
  dragon
);

// Interaction

// Choose or Create a character
let player;
while (!player) {
  console.clear();
  console.log(`__ Welcome to ${rPGGame.name} Game __`);
  player = chooseOrCreateCharacter();
}

// start the Game
while (true) {
  console.clear();
  console.log(`__ Weolcome player ${player.name} __`);
  console.log("\n1. Player vs player");
  console.log("2. Explore a dungeon");
  console.log("3. Open status");
  console.log("4. Distribute experience points");
  console.log("5. Exit");

  const choice = rs.question("\nEnter your choice: ");

  switch (choice) {
    case "1":
      // randon player to fight
      // new array with all the other players with whom the user can fight
      const otherPlayers = rPGGame.players.filter(otherPlayer => otherPlayer.name !== player.name);
      const randomIndex = Math.floor(
        Math.random() * otherPlayers.length
      );
      const target = otherPlayers[randomIndex];
      // player vs player
      console.clear();
      console.log(`__ ${player.name} VS ${target.name} __\n`);
      rPGGame.playerVsPlayer(player, target);
      // reset hp
      player.hp = 100;
      target.hp = 100;
      break;
    case "2":
      // explore dungeon
      console.clear();
      console.log(`__ Welcome to the ${dungeon.name} brave adventurer __`);
      rPGGame.exploreDungeon(player, dungeon);
      // reset player HP
      player.hp = 100;
      break;
    case "3":
      // open status
      console.clear();
      console.log("__ Player Status __");
      console.log(player.openStatus());
      break;
    case "4":
      // distribute points
      console.clear();
      console.log(`You have ${player.exp} point that you can distribute.\n`);
      // list the skills to chose from then add the points to the damage of the chose skill
      player.listSkills();
      let indexSkill = Number(
        rs.question("Select the index of the skill you want improve: ")
      );
      if (
        isNaN(indexSkill) ||
        indexSkill >= player.skills.length ||
        indexSkill < 1
      ) {
        rs.question("\nInvalid Input! Press ENTER to go back...");
        continue;
      }
      let points = Number(rs.question("How many points do you want to add? "));
      if (isNaN(points) || points < 0) {
        rs.question("\nInvalid Input! Press ENTER to go back...");
        continue;
      }
      player.addEXPPoints(indexSkill - 1, points);
      break;
    case "5":
      // exit application
      console.clear();
      console.log("Sad to see you leave... Let's play again soon!");
      process.exit();
    default:
      console.log("Invalid Input!");
  }

  rs.question("\nPress Enter to continue...");
}

// functions
function chooseOrCreateCharacter() {
  console.log("\nTo start playing create or choose your character\n");
  console.log("1. Create a new character");
  console.log("2. Play with your already created character");
  console.log("3. Choose a default character and Play as a guest");

  const choice = rs.question("\nEnter your choice: ");

  let player;

  switch (choice) {
    case "1":
      // create new character
      console.clear();
      console.log("Let's create a new character!\n");
      player = rPGGame.createNewcharacter();
      console.log("\nCharacter successfully created!");
      break;

    case "2":
      // Log in with your character
      console.clear();
      console.log("__ Log Back In __");
      player = rPGGame.logBackIn();
      break;
    case "3":
      //list all default character
      console.clear();
      console.log("Choose from the List of the default characters:\n");
      player = rPGGame.playAsGuest();
      break;
    default:
      console.clear();
      console.log("\nInvalid Input!");
      rs.question("Press Enter to continue...");
  }
  return player;
}
