// Class representing a dice with specific faces
class Dice {
  constructor(faces) {
    this.faces = faces; // Store the faces of the dice
  }

  roll() {
    return this.faces[Math.floor(Math.random() * this.faces.length)]; // Roll the dice by selecting a random face
  }
}
exports.Dice = Dice;
