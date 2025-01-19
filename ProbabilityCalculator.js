// Class for calculating winning probabilities between dice
class ProbabilityCalculator {
  static calculateProbabilities(diceList) {
    const numDice = diceList.length; // Get the number of dice
    const probabilities = Array.from({ length: numDice }, () =>
      Array(numDice).fill(0)
    ); // Create a 2D array for probabilities

    for (let i = 0; i < numDice; i++) {
      for (let j = 0; j < numDice; j++) {
        if (i !== j) {
          let winCount = 0;
          const totalCount = 10000; // Simulate 10,000 rolls
          for (let k = 0; k < totalCount; k++) {
            if (diceList[i].roll() > diceList[j].roll()) {
              winCount++; // Count wins for dice i against dice j
            }
          }
          probabilities[i][j] = winCount / totalCount; // Calculate the probability of winning
        }
      }
    }
    return probabilities; // Return the probability matrix
  }
}
exports.ProbabilityCalculator = ProbabilityCalculator;
