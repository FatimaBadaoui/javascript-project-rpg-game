import rs from "readline-sync";

// Define the class to represent the game character
class Character {
  constructor(name, job, skills = []) {
    this.name = name;
    this.job = job;
    this.hp = 100;
    this.skills = skills;
    this.exp = 0;
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
        `\n\t\t${index + 1}. ${skill.skillName} (${skill.damage} damage points)`
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
  }
  listCharacters() {
    this.characters.forEach((character, index) =>
      console.log(`${index + 1}.\n ${character.openStatus()}`)
    );
  }
  playerVsPlayer(player, target) {
    let round = 1;
    while (player.hp > 0 && target.hp > 0) {
      console.log(`\n------- Round ${round} -------`);
      // player starts
      // choose the skill with which the player will attack the target
      player.listSkills();
      let indexSkill = Number(rs.question("Select the index of the skill: "));
      player.attack(target, indexSkill - 1);

      // target turn
      target.attack(player, Math.floor(Math.random() * 3));

      round++;
    }

    if (player.hp > 0) {
      player.exp += 5;
      console.log(
        `\nCongratulations, ${player.name}. You are the Winner!\nYou receive 5 experience points.\n`
      );
    } else {
      console.log("\nYou have lost. Better next time!\n");
    }
    // reset hp
    player.hp = 100;
    target.hp = 100;
  }
  exploreDungeon() {}
}

// create instances of default characters
const char1 = new Character("Eowyn", "Knight", [
  { skillName: "Pierce", damage: 15 },
  { skillName: "Slash", damage: 8 },
  { skillName: "Raging Blade", damage: 18 },
]);
const char2 = new Character("Elora", "Fire Mage", [
  { skillName: "Fireball", damage: 12 },
  { skillName: "Fire Arrow", damage: 10 },
  { skillName: "Inferno", damage: 20 },
]);
const char3 = new Character("Galadriel", "Hunter", [
  { skillName: "Attack Boost", damage: 8 },
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

// Interaction

console.clear();
console.log(`__ Welcome to ${rPGGame.name} Game __`);
// Choose or Create a character
const player = chooseOrCreateCharacter();

rs.question("\nPress Enter to enter the Game...");

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
      const randomIndex = Math.floor(Math.random() * rPGGame.characters.length);
      const target = rPGGame.characters[randomIndex];
      // player vs player
      console.log(`__ ${player.name} VS ${target.name} __\n`);
      rPGGame.playerVsPlayer(player, target);
      break;
    case "2":
      // explore dungeon
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
      let points = Number(rs.question("How many points do you want to add? "));
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
  console.log("2. Choose an existing character");

  const choice = rs.question("\nEnter your choice: ");

  let player;

  switch (choice) {
    case "1":
      // create new character
      console.clear();
      console.log("Let's create a new character!\n");
      const name = rs.question("Enter the name: ");
      const job = rs.question("Enter the class: ");
      const skill1 = rs.question("Enter the first skill: ");
      const damage1 = Math.round(Math.random() * 15) + 5; // damage from 5 to 20
      const skill2 = rs.question("Enter the second skill: ");
      const damage2 = Math.round(Math.random() * 15) + 5; // damage from 5 to 20
      const skill3 = rs.question("Enter the third skill: ");
      const damage3 = Math.round(Math.random() * 15) + 5; // damage from 5 to 20

      player = new Character(name, job, [
        { skillName: skill1, damage: damage1 },
        { skillName: skill2, damage: damage2 },
        { skillName: skill3, damage: damage3 },
      ]);

      console.log("\nCharacter successfully created!");
      break;

    case "2":
      //list all default character
      console.clear();
      console.log("List of the default characters:\n");
      rPGGame.listCharacters();
      // choose one from the list
      const indexCharacter = Number(
        rs.question("Enter the index of the chosen character: ")
      );
      player = rPGGame.characters[indexCharacter - 1];
      break;
    default:
      console.log("Invalid Input!");
      return;
  }
  return player;
}
