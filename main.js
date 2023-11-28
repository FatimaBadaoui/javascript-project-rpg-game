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
    return (this.skills[indexSkill].damage += points);
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
}
