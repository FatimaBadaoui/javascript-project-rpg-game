import rs from "readline-sync";
import cl from "colors";
import fs from "fs";

//import classes
import Character from "./utilities/Character.js";
import Dungeon from "./utilities/Dungeon.js";

// import variables
import { fantasyClasses } from "./utilities/array-of-fantasy-classes.js";
import { char1, char2, char3, char4, char5 } from "./utilities/variables.js";

// import functions
import {
  chooseOrCreateCharacter,
  chooseDungeon,
} from "./utilities/functions.js";

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
        (player) =>
          new Character(
            player.name,
            player.job,
            player.skills,
            player.hp,
            player.xp
          )
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

    // add 3 skills
    const skillsArray = [];
    for (let i = 1; i <= 3; i++) {
      const indexSkill = rs.keyInSelect(
        classSkills,
        `Enter the index of the ${i} skill you want: `
      );
      // if CANCEL return
      if (indexSkill === -1) {
        return;
      }
      const skill = classSkills[indexSkill];
      const damage = Math.round(Math.random() * 10) + 10; // damage from 10 to 20
      // add the skill and its damage to the array
      skillsArray.push([skill, damage]);
      // remove the chosen skill from the choices
      classSkills.splice(indexSkill, 1);
    }

    // create a new instance of character using the inputs given
    const player = new Character(
      name[0].toUpperCase() + name.slice(1).toLowerCase(),
      job,
      [
        { skillName: skillsArray[0][0], damage: skillsArray[0][1] },
        { skillName: skillsArray[1][0], damage: skillsArray[1][1] },
        { skillName: skillsArray[2][0], damage: skillsArray[2][1] },
      ]
    );

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
    const initialHP = player.hp;
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
      // reset player hp before boss floor
      player.hp = initialHP;
      dungeon.fightBoss(rPGGame, player);
    }
  }
}

// Create an instance of the RPG Game
export const rPGGame = new RPGGame("Swords and Magic", [
  char1,
  char2,
  char3,
  char4,
  char5,
]);

/*  Interaction  */
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
      const dungeon = chooseDungeon();
      if (dungeon === undefined) {
        console.log("\nInvalid Input!".bgRed);
        break;
      }
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
