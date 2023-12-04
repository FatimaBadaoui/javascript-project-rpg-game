import rs from "readline-sync";
import cl from "colors";

// Define the class to represent the game character
export default class Character {
  constructor(name, job = "", skills = [], hp = 100, xp = 0) {
    this.name = name[0].toUpperCase() + name.slice(1).toLowerCase();
    this.job = job;
    this.hp = hp;
    this.skills = skills;
    this.xp = xp;
  }
  openStatus() {
    return `
          --------------------------------------------
          - Name: ${this.name}
          - Class: ${this.job}
          - HP: ${this.hp} points
          - Skills: ${this.skills.map(
            (skill) =>
              `\n\t\t${skill.skillName} (${skill.damage} damage ponits)`
          )}
          - XP: ${this.xp} points
          ---------------------------------------------
          `.blue;
  }
  showHP(initialHP) {
    let hPBar = "";
    for (let i = 0; i < 20; i++) {
      if (i < Math.floor(this.hp / (initialHP / 20))) {
        hPBar += "🟩";
      } else {
        hPBar += "🟥";
      }
    }
    return hPBar;
  }
  attack(target, indexSkill, initialHP) {
    target.hp -= this.skills[indexSkill].damage;
    console.log(
      `\n⚔️ ${this.name} attacked ${target.name} with a ${this.skills[indexSkill].skillName} giving a damage of ${this.skills[indexSkill].damage}. \n${target.name}'s hp:`
        .gray,
      target.showHP(initialHP)
    );
  }
  listSkills() {
    console.log(`
      ${this.name}'s skills:
      ${this.skills.map(
        (skill, index) =>
          `\n\t${index + 1}. ${skill.skillName} (${skill.damage} damage points)`
            .green
      )}
      `);
  }
  addEXPPoints(indexSkill, points) {
    if (points > this.xp) {
      console.log(
        `\nYou only have ${this.xp} points. You can't add more!`.bgRed
      );
    } else {
      this.skills[indexSkill].damage += points;
      this.xp -= points;
      console.log(`\n${points} points were added successfully!`.bgGreen);
    }
  }
}
