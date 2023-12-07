import rs from "readline-sync";
import cl from "colors";

// Define the class to represent the game character
export default class Character {
  constructor(name, job = "", skills = [], hp = 100, xp = 0) {
    this.name = name;
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
              `\n\t\t${skill.skillName} (${
                skill.damage ? skill.damage : skill.recover
              } ponits)`
          )}
          - XP: ${this.xp} points
          ---------------------------------------------
          `.blue;
  }
  showHP(initialHP) {
    let hPBar = "";
    for (let i = 0; i < 20; i++) {
      if (i < Math.floor(this.hp / Math.round(initialHP / 20))) {
        hPBar += "🟩";
      } else {
        hPBar += "🟥";
      }
    }
    return hPBar;
  }
  action(target, indexSkill, initialHP) {
    const skill = this.skills[indexSkill];
    if (skill.damage) {
      target.hp -= this.skills[indexSkill].damage;
      console.log(
        `\n💥 ${this.name} attacked ${target.name} with a ${skill.skillName} giving a damage of ${skill.damage}. \n${target.name}'s hp (${target.hp}):`
          .gray,
        target.showHP(initialHP)
      );
    } else {
      this.hp += skill.recover;
      console.log(
        `\n ${this.name} used ${skill.skillName} to recover ${skill.recover} hp.\n${this.name}'s hp (${this.hp}):`
          .gray,
        this.showHP(initialHP)
      );
    }
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
        "\n❌",
        `You only have ${this.xp} points. You can't add more!`.bgRed
      );
    } else {
      this.skills[indexSkill].damage += points;
      this.xp -= points;
      console.log(`\n${points} points were added successfully!`.bgGreen);
    }
  }
}
