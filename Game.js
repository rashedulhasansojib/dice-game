const readline = require("readline"); // Import readline for user input
// const Table = require("cli-table3"); // Import cli-table3 for displaying the probability table
const { FairRandomGenerator } = require("./FairRandomGenerator");
const { ProbabilityCalculator } = require("./ProbabilityCalculator");
const { ProbabilityTableDisplay } = require("./ProbabilityTableDisplay");

// Main game class
class Game {
  constructor(diceList) {
    this.diceList = diceList; // Store the list of dice
    this.userDice = null; // Initialize user dice
    this.computerDice = null; // Initialize computer dice
    this.computerThrowValue = null; // Initialize computer throw
    this.userThrowValue = null; // Initialize user throw
  }

  async determineFirstMove() {
    console.log("Let's determine who makes the first move.");
    const { randomNumber, key, hmac } =
      FairRandomGenerator.generateSecureRandomNumber(2); // Generate a random number for first move
    console.log(
      `I selected a random value in the range 0..1 (HMAC=${hmac.toUpperCase()}).`
    );
    console.log(`Try to guess my selection.\n0 - 0\n1 - 1`);
    this.showExitAndHelp(); // Show exit and help options

    const userChoice = await this.getUserInput("Your selection: "); // Get user input

    if (this.handleExitAndHelp(userChoice)) return this.determineFirstMove(); // Handle exit and help

    if (userChoice !== "0" && userChoice !== "1") {
      console.log("Invalid selection. Please try again."); // Handle invalid selection
      return this.determineFirstMove(); // Retry determining first move
    }

    console.log(
      `My selection: ${randomNumber} (KEY=${key
        .toString("hex")
        .toUpperCase()}).`
    ); // Display the random number and key

    if (parseInt(userChoice) !== randomNumber) {
      this.computerDice =
        this.diceList[Math.floor(Math.random() * this.diceList.length)]; // Randomly select computer's dice

      // Remove the selected computerDice from diceList
      this.diceList = this.diceList.filter(
        (dice) => dice !== this.computerDice
      );

      console.log(
        `I make the first move and choose the [${this.computerDice.faces}] dice.`
      );

      await this.userDiceSelection(); // Proceed to user dice selection
    } else {
      console.log("You make the first move.");
      await this.userDiceSelection(); // Proceed to user dice selection
    }
  }

  async userDiceSelection() {
    console.log("Choose your dice:");
    this.diceList.forEach((dice, index) => {
      console.log(`${index} - ${dice.faces}`); // Display available dice options
    });
    this.showExitAndHelp(); // Show exit and help options

    const userChoice = await this.getUserInput("Your selection: "); // Get user input for dice selection

    if (this.handleExitAndHelp(userChoice)) return this.userDiceSelection(); // Handle exit and

    const selectedDiceIndex = parseInt(userChoice);
    if (
      isNaN(selectedDiceIndex) ||
      selectedDiceIndex < 0 ||
      selectedDiceIndex >= this.diceList.length
    ) {
      console.log("Invalid selection. Please try again."); // Handle invalid selection
      return this.userDiceSelection(); // Retry user dice selection
    }

    this.userDice = this.diceList[selectedDiceIndex]; // Set user's dice based on selection
    console.log(`You chose the [${this.userDice.faces}] dice.`);

    if (!this.computerDice) {
      this.computerDice =
        this.diceList[Math.floor(Math.random() * this.diceList.length)]; // Set computer's dice if not set
      console.log(`I choose the [${this.computerDice.faces}] dice.`);
    }

    this.playGame(); // Proceed to play the game
  }

  async playGame() {
    //---------------------------------------------

    //---------------------------------------------
    await this.computerThrow(); // Computer throw
    await this.userThrow(); // User throw

    // Determine the winner based on the rolls
    if (this.computerThrowValue > this.userThrowValue) {
      console.log(`I win (${this.computerThrowValue}>${this.userThrowValue})`); // Computer wins
    } else if (this.computerThrowValue < this.userThrowValue) {
      console.log(
        `You win (${this.userThrowValue}>${this.computerThrowValue})`
      ); // User wins
    } else {
      console.log("It's a tie!"); // Tie
    }
  }

  async computerThrow() {
    if (!this.computerDice) {
      console.error("Computer dice is not set.");
      process.exit(1); // Exit with error
    }

    console.log("It's time for my throw.");
    const { randomNumber, key, hmac } =
      FairRandomGenerator.generateSecureRandomNumber(6); // Generate random number for computer's throw
    console.log(
      `I selected a random value in the range 0..5 (HMAC=${hmac.toUpperCase()}).`
    );

    console.log("Add your number modulo 6.");
    for (let i = 0; i < 6; i++) {
      console.log(`${i} - ${i}`); // Display the options for user input
    }
    this.showExitAndHelp(); // Show exit and help options

    const userRoll = await this.getUserInput("Your Selection: "); // Get user input for roll

    if (this.handleExitAndHelp(userRoll)) return this.computerThrow(); // Handle exit and

    if (isNaN(userRoll) || userRoll < 0 || userRoll > 5) {
      console.log("Invalid input. Please enter a number between 0 and 5.");
      return this.computerThrow(); // Retry user input for valid roll
    }

    const userRollNumber = parseInt(userRoll); // Convert user input to number

    // this.computerThrowValue = this.computerDice.roll(); // Roll the computer's dice
    const result = (randomNumber + userRollNumber) % 6; // Calculate the result of the rolls
    // this.computerThrowValue = (this.computerDice.roll() + result) % 6; // Calculate the final throw value
    this.computerThrowValue = this.computerDice.faces[result];

    console.log(
      `My number is ${randomNumber} (KEY=${key.toString("hex").toUpperCase()}).`
    ); // Display computer's random number and key
    console.log(
      `The result is ${randomNumber} + ${userRollNumber} = ${result} (mod 6).`
    ); // Display the result of the rolls
    console.log(`My throw is ${this.computerThrowValue}.`); // Display the computer's throw
  }
  async userThrow() {
    if (!this.userDice) {
      console.error("User dice is not set.");
      process.exit(1); // Exit with error
    }

    console.log("It's time for your throw.");
    const { randomNumber, key, hmac } =
      FairRandomGenerator.generateSecureRandomNumber(6); // Generate random number for computer's throw
    console.log(
      `I selected a random value in the range 0..5 (HMAC=${hmac.toUpperCase()}).`
    );

    console.log("Add your number modulo 6.");
    for (let i = 0; i < 6; i++) {
      console.log(`${i} - ${i}`); // Display the options for user input
    }
    this.showExitAndHelp(); // Show exit and help options

    const userRoll = await this.getUserInput("Your Selection: "); // Get user input for roll

    if (this.handleExitAndHelp(userRoll)) return this.userThrow(); // Handle exit and

    if (isNaN(userRoll) || userRoll < 0 || userRoll > 5) {
      console.log("Invalid input. Please enter a number between 0 and 5.");
      return this.userThrow(); // Retry user input for valid roll
    }

    const userRollNumber = parseInt(userRoll); // Convert user input to number

    // this.userThrowValue = this.userDice.roll(); // Roll the computer's dice
    const result = (randomNumber + userRollNumber) % 6; // Calculate the result of the rolls
    // this.userThrowValue = (this.userDice.roll() + result) % 6; // Calculate the final throw value
    this.userThrowValue = this.userDice.faces[result];

    console.log(
      `My number is ${randomNumber} (KEY=${key.toString("hex").toUpperCase()}).`
    ); // Display computer's random number and key
    console.log(
      `The result is ${randomNumber} + ${userRollNumber} = ${result} (mod 6).`
    ); // Display the result of the rolls
    console.log(`Your throw is ${this.userThrowValue}.`); // Display the computer's throw
  }

  async getUserInput(prompt) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question(prompt, (answer) => {
        rl.close();
        resolve(answer); // Resolve the promise with user input
      });
    });
  }

  showProbabilities() {
    const probabilities = ProbabilityCalculator.calculateProbabilities(
      this.diceList
    );
    ProbabilityTableDisplay.display(probabilities, this.diceList); // Use the new class to display the table
  }

  handleExitAndHelp(input) {
    if (input.toUpperCase() === "X") {
      process.exit(); // Exit the game
    } else if (input === "?") {
      this.showProbabilities(); // Show help
      return true; // Indicate that help was shown
    }
    return false; // Indicate that no special action was taken
  }
  showExitAndHelp() {
    console.log("X - exit");
    console.log("? - help\n");
  }
}

exports.Game = Game;
