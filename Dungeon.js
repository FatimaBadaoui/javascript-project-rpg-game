import rs from "readline-sync";
import cl from "colors";
import Character from "./Character.js";

// define class to represent a Dungeon
export default class Dungeon {
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
      `.green;
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
          monster.xp
        )
      );
    }
    return floor;
  }
  fightMonsters(rPGGame, player) {
    const initialHPPlayer = player.hp;
    while (player.hp > 0 && this.currentFloor < this.numberOfFloors) {
      const monster = this.monsters[this.currentFloor - 1];
      console.clear();
      console.log(
        `\n${player.name} has entered the floor number ${this.currentFloor}. This floor is inhabited by ${monster.name}s.`
          .yellow
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
        return;
      }
      // fight monsters on each floor
      const floor = this.createFloor(monster);
      for (let i = 0; i < floor.length; i++) {
        console.log(
          `\nThere are still ${floor.length - i} ${
            monster.name
          }s on this floor.`.cyan
        );
        rPGGame.playerVsPlayer(player, floor[i], initialHPPlayer);
        console.log("\n_____________________________________________________________\n".yellow.bold);
        if (player.hp <= 0) return;
      }
      // proceed to the next floor
      this.currentFloor++;
    }
  }
  fightBoss(rPGGame, player) {
    // reset boss hp
    this.boss.hp = 200;
    console.clear();
    console.log(
      `__ ${player.name} has entered the Boss floor. The boss is ${this.boss.name} __`
        .yellow
    );
    rPGGame.playerVsPlayer(player, this.boss, player.hp);
  }
}
