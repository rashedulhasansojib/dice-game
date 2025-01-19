const Table = require("cli-table3");

class ProbabilityTableDisplay {
  static display(probabilities, diceList) {
    const table = new Table({
      head: [
        "User dice \\ Computer dice",
        ...diceList.map((dice) => dice.faces.join(",")),
      ],
    });

    probabilities.forEach((row, i) => {
      table.push({
        [diceList[i].faces.join(",")]: row.map((prob, j) =>
          i === j ? `- (${(1 / 3).toFixed(4)})` : prob.toFixed(4)
        ),
      });
    });

    console.log("Probability of winning for the user:");
    console.log(table.toString()); // Display the probability table
  }
}

// module.exports = { ProbabilityTableDisplay };
exports.ProbabilityTableDisplay = ProbabilityTableDisplay;
