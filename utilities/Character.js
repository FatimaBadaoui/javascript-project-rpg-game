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
    // show hp bar in 20 squares, with green representing the remaining hp and red the lost hp 
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
  action(target, indexSkill, initialHPPlayer, initialHPTarget) {
    const skill = this.skills[indexSkill];
    // check if the skill has a damage property if not it means the player used a recovery skill
    if (skill.damage) {
      target.hp -= this.skills[indexSkill].damage;
      console.log(
        `\n💥 ${this.name} attacked ${target.name} with a ${skill.skillName} giving a damage of ${skill.damage}. \n${target.name}'s hp (${target.hp}):`
          .gray,
        target.showHP(initialHPTarget)
      );
    } else {
      if(this.hp + skill.recover > initialHPPlayer) this.hp = initialHPPlayer;
      else this.hp += skill.recover;
      console.log(
        `\n⛑️  ${this.name} used ${skill.skillName} to recover ${skill.recover} hp.\n${this.name}'s hp (${this.hp}):`
          .gray,
        this.showHP(initialHPPlayer)
      );
    }
  }
  listSkills() {
    console.log(`
      ${this.name}'s skills:
      ${this.skills.map(
        (skill, index) =>
          `\n\t${index + 1}. ${skill.skillName} (${skill.damage ? skill.damage : skill.recover} points)`
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
      // check if the skill is an attack skill or a recovery skill
      const key = this.skills[indexSkill].damage ? "damage" : "recover";
      this.skills[indexSkill][key] += points;
      this.xp -= points;
      console.log(`\n${points} points were added successfully!`.bgGreen);
    }
  }
}
