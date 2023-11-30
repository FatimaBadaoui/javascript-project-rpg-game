import rs from "readline-sync";
import cl from "colors";

// Define the class to represent the game character
export default class Character {
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
          `.blue;
    }
    attack(target, indexSkill) {
      target.hp -= this.skills[indexSkill].damage;
      console.log(
        `\n⚔️ ${this.name} attacked ${target.name} with a ${this.skills[indexSkill].skillName} giving a damage of ${this.skills[indexSkill].damage}. \n${target.name} hp is now ${target.hp}`.gray
      );
    }
    listSkills() {
      console.log(`
      ${this.name}'s skills:
      ${this.skills.map(
        (skill, index) =>
          `\n\t${index + 1}. ${skill.skillName} (${skill.damage} damage points)`.green
      )}
      `);
    }
    addEXPPoints(indexSkill, points) {
      if (points > this.exp) {
        console.log(`\nYou only have ${this.exp} points. You can't add more!`.bgRed);
      } else {
        this.skills[indexSkill].damage += points;
        this.exp -= points;
        console.log(`\n${points} points were added successfully!`.bgGreen);
      }
    }
  }
  