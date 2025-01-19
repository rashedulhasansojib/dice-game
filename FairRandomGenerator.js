const crypto = require("crypto");

// Class for generating fair random numbers and HMAC
class FairRandomGenerator {
  static generateSecureRandomNumber(rangeMax) {
    const key = crypto.randomBytes(32); // Generate a secure random key (256 bits)
    const randomNumber = crypto.randomInt(0, rangeMax); // Generate a random number in the specified range
    const hmac = crypto
      .createHmac("sha3-256", key)
      .update(randomNumber.toString())
      .digest("hex"); // Calculate HMAC
    return { randomNumber, key, hmac }; // Return the random number, key, and HMAC
  }
}
exports.FairRandomGenerator = FairRandomGenerator;
