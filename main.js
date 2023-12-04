import rs from "readline-sync";
import fs from "fs";
import cl from "colors";

//import classes
import Character from "./Character.js";
import Dungeon from "./Dungeon.js";

// import variables
import { fantasyClasses } from "./array-of-fantasy-classes.js";

// Define a class to represent the game
class RPGGame {
  constructor(name, characters = []) {
    this.name = name;
    this.characters = characters;
    this.players = this.readPlayersFromJson();
  }
  readPlayersFromJson() {
    // check if the file exists
    const filename = "./players.json";
    if (fs.existsSync(filename)) {
      let rawData = fs.readFileSync(filename);
      let playerObjects = JSON.parse(rawData);
      return playerObjects.map(
        (player) => new Character(player.name, player.job, player.skills, player.hp, player.xp)
      );
    } else {
      return [];
    }
  }
  savePlayersToJson() {
    fs.writeFileSync("./players.json", JSON.stringify(this.players));
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
      (player) => player.name.toLowerCase() === name.toLowerCase()
    );

    if (alreadyInUse !== undefined) {
      rs.question(
        `\nThe name ${name} has been already used. Press Enter to go back...`
          .red
      );
      return undefined;
    }
    // choice for the character Class
    const classes = fantasyClasses.map(
      (fantasyClass) => fantasyClass.className
    );
    const classIndex = rs.keyInSelect(classes, "Which class do you wanna be?");
    // if CANCEl return
    if (classIndex === -1) {
      return;
    }
    const job = classes[classIndex];

    // array of the skills of the chosen class
    const classSkills = fantasyClasses.find(
      (classObj) => classObj.className === job
    ).attackingSkills;

    // First Skill
    const indexSkill1 = rs.keyInSelect(
      classSkills,
      "Enter the index of the first skill you want: "
    );
    // if CANCEL return
    if (indexSkill1 === -1) {
      return;
    }
    const skill1 = classSkills[indexSkill1];
    const damage1 = Math.round(Math.random() * 10) + 10; // damage from 10 to 20

    // Second Skill
    classSkills.splice(indexSkill1, 1);
    const indexSkill2 = rs.keyInSelect(
      classSkills,
      "Enter the index of the second skill you want: "
    );
    // if CANCEL return
    if (indexSkill2 === -1) {
      return;
    }
    const skill2 = classSkills[indexSkill2];
    const damage2 = Math.round(Math.random() * 10) + 10; // damage from 10 to 20

    // Third Skill
    classSkills.splice(indexSkill2, 1);
    const indexSkill3 = rs.keyInSelect(
      classSkills,
      "Enter the index of the third skill you want: "
    );
    // if CANCEL return
    if (indexSkill3 === -1) {
      return;
    }
    const skill3 = classSkills[indexSkill3];
    const damage3 = Math.round(Math.random() * 10) + 10; // damage from 10 to 20

    // create a new instance of character using the inputs given
    const player = new Character(name, job, [
      { skillName: skill1, damage: damage1 },
      { skillName: skill2, damage: damage2 },
      { skillName: skill3, damage: damage3 },
    ]);

    // add the new character to the array players and update the json file
    this.players.push(player);
    return player;
  }
  logBackIn() {
    const name = rs.question("\nEnter the name of your character: ");
    const myCharacter = this.players.find(
      (player) => player.name.toLowerCase() === name.toLowerCase()
    );
    if (myCharacter === undefined) {
      rs.question(
        `\nThe character ${name} doesn't exist! press Enter to go back...`.red
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

    // Error message if input is invalid
    if (this.characters[indexCharacter - 1] === undefined) {
      console.clear();
      console.log(`Invalid Input!`.bgRed);
      rs.question("\nPress Enter to try again...");
      return;
    }

    return this.characters[indexCharacter - 1];
  }
  playerVsPlayer(player, target, initialHPPlayer) {
    let round = 1;
    // the initial hp of both player and target are used to create the hp bar with green and red squares
    const initialHPTarget = target.hp;
    // fight until one of the players has no more hp
    while (player.hp > 0 && target.hp > 0) {
      console.log(`\n------- Round ${round} -------`);
      // player starts
      // choose the skill with which the player will attack the target
      player.listSkills();
      let indexSkill = Number(rs.question("Select the index of the skill: "));
      // if input is invalid skip the code below and start again
      if (player.skills[indexSkill - 1] === undefined) {
        console.log("\n❌", "INVALID INPUT! TRY AGAIN...".bgRed);
        continue;
      }
      player.attack(target, indexSkill - 1, initialHPTarget);
      // if the target is K.O. exit the while without the target attack
      if (target.hp <= 0) {
        break;
      }
      // target turn
      target.attack(
        player,
        Math.floor(Math.random() * target.skills.length),
        initialHPPlayer
      );

      round++;
    }

    if (player.hp > 0) {
      const addedPoints = target.xp === 0 ? 5 : target.xp;
      player.xp += addedPoints;
      console.log(
        `\n🎉 Congratulations, ${player.name}. You are the Winner!\nYou receive ${addedPoints} experience points.\n`
          .green.bold.italic
      );
    } else {
      console.log("\n💀 You have lost. Better next time!\n".red.underline.bold);
    }
  }
  exploreDungeon(player, dungeon) {
    console.log("\nDungeon's Info:\n", dungeon.displayInfo());
    rs.question("\nPress Enter to explore the dungeon...");
    dungeon.fightMonsters(rPGGame, player);
    // if player reaches the boss floor alive then fight the boss
    if (player.hp > 0 && dungeon.currentFloor === dungeon.numberOfFloors) {
      // fight the boss or exit the dungeon
      console.clear();
      const explore = rs.question("\nDo you want to fight the Boss? (y | n): ");
      if (!["y", "yes"].includes(explore.toLowerCase())) {
        return;
      }
      dungeon.fightBoss(rPGGame, player);
    }
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
const orc = new Character(
  "👹 Orc",
  "Monster",
  [
    { skillName: "Intimidation", damage: 12 },
    { skillName: "Brute Punch", damage: 15 },
  ],
  60,
  2
);
const Lich = new Character(
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

const dungeon = new Dungeon(
  "Dragon's Lair",
  5,
  [slime, goblin, orc, Lich],
  dragon
);

// Interaction

// Choose or Create a character
let player;
while (!player) {
  console.clear();
  console.log(`__ WELCOME TO < ${rPGGame.name} > GAME __`.trap.america);
  player = chooseOrCreateCharacter();
}

// start the Game
while (true) {
  console.clear();
  console.log(`__ Weolcome player ${player.name} __`.america.bold);
  console.log("\n1. Player vs player".blue);
  console.log("2. Explore a dungeon".blue);
  console.log("3. Open status".blue);
  console.log("4. Distribute experience points".blue);
  console.log("5. Exit".blue);

  const choice = rs.question("\nEnter your choice: ");

  switch (choice) {
    case "1":
      // randon player to fight
      //before the fight save the player hp in a variable
      const initialHP = player.hp;
      // new array with all the other players with whom the user can fight
      const otherPlayers = rPGGame.players.filter(
        (otherPlayer) => otherPlayer.name !== player.name
      );
      const randomIndex = Math.floor(Math.random() * otherPlayers.length);
      const target = otherPlayers[randomIndex];
      // player vs player
      console.clear();
      console.log(`__ ${player.name} VS ${target.name} __\n`.yellow.bold);
      rPGGame.playerVsPlayer(player, target, player.hp);
      // reset hp and level up (every 5 xp is 1 hp)
      player.hp = initialHP + Math.round(player.xp / 5);
      target.hp = 100;
      break;
    case "2":
      // explore dungeon
      const hpBeforeDungeon = player.hp;
      console.clear();
      console.log(`__ Welcome to the ${dungeon.name} dungeon __`.yellow.bold);
      rPGGame.exploreDungeon(player, dungeon);
      // reset player HP and level up - every 5 xp is 1 hp
      player.hp = hpBeforeDungeon + Math.round(player.xp / 5);
      break;
    case "3":
      // open status
      console.clear();
      console.log("__ Player's Status __".yellow.bold);
      console.log(player.openStatus());
      break;
    case "4":
      // distribute experience points
      console.clear();
      console.log(
        `__ You have ${player.xp} point that you can distribute __\n`.yellow
          .bold
      );
      // list the skills to chose from then add the points to the damage of the chose skill
      player.listSkills();
      let indexSkill = Number(
        rs.question("Select the index of the skill you want improve: ")
      );
      if (player.skills[indexSkill - 1] === undefined) {
        rs.question("\n❌ " + "Invalid Input! Press ENTER to go back...".bgRed);
        continue;
      }
      let points = Number(rs.question("How many points do you want to add? "));
      if (isNaN(points) || points < 0) {
        rs.question("\n❌ " + "Invalid Input! Press ENTER to go back...".bgRed);
        continue;
      }
      player.addEXPPoints(indexSkill - 1, points);
      break;
    case "5":
      // save the player data and exit application
      rPGGame.savePlayersToJson();
      console.clear();
      console.log(
        " Sad to see you leave... Let's play again soon!\n".america.underline
      );
      process.exit();
    default:
      console.clear();
      console.log("❌", "Invalid Input!".bgRed);
  }

  rs.question("\nPress Enter to continue...");
}

// functions
function chooseOrCreateCharacter() {
  console.log("\nTo start playing create or choose your character\n");
  console.log("1. Create a new character".blue);
  console.log("2. Log back into the game".blue);
  console.log("3. Choose a default character and Play as a guest".blue);

  const choice = rs.question("\nEnter your choice: ");

  let player;

  switch (choice) {
    case "1":
      // create new character
      console.clear();
      console.log("__ Let's create a new character __\n".cyan);
      player = rPGGame.createNewcharacter();
      console.log("\nCharacter successfully created!".bgGreen);
      break;

    case "2":
      // Log in with your character
      console.clear();
      console.log("__ Log Back In __".cyan);
      player = rPGGame.logBackIn();
      break;
    case "3":
      //list all default character
      console.clear();
      console.log(
        "__ Choose from the List of the default characters: __\n".cyan
      );
      player = rPGGame.playAsGuest();
      break;
    default:
      console.clear();
      console.log("\n❌","Invalid Input!".bgRed);
      rs.question("\nPress Enter to continue...");
  }
  return player;
}
