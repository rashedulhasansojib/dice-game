const { Game } = require("./Game");
const { DiceParser } = require("./DiceParser");

// Main execution block
(async () => {
  const args = process.argv.slice(2); // Get command line arguments
  try {
    const diceList = DiceParser.parseDiceArgs(args); // Parse dice configurations
    const game = new Game(diceList); // Create a new game instance

    await game.determineFirstMove(); // Start the game
  } catch (error) {
    console.error(error.message); // Display error message
    console.log(
      "Example usage:\n   node Main.js 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3\n   or\n   npm start -- 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3"
    ); // Show example usage
  }
})();
