const { Dice } = require("./Dice");

// Class for parsing command line arguments to create dice configurations
class DiceParser {
  static parseDiceArgs(args) {
    if (args.length < 3) {
      throw new Error("You must provide at least 3 dice configurations."); // Ensure at least 3 dice are provided
    }

    const diceList = []; //to store the dice configurations

    for (const arg of args) {
      const faces = arg.split(",").map(Number); // Split the string by commas and convert to numbers
      if (
        faces.length !== 6 ||
        faces.some(isNaN) ||
        faces.some((face) => face < 1)
      ) {
        throw new Error(
          `Invalid dice configuration: [${arg}] Example: [2,2,4,4,9,9]`
        ); // Validate the dice configuration (must have 6 positive integers)
      }
      diceList.push(new Dice(faces)); // Create a new Dice object and add it to the list
    }
    return diceList; // Return the list of dice
  }
}

exports.DiceParser = DiceParser;
