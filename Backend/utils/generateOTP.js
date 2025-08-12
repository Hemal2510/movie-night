// utils/generateOTP.js
const crypto = require('crypto');

function generateOTP(length = 6) {
  const min = 10 ** (length - 1);
  const max = (10 ** length) - 1;
  // crypto.randomInt is inclusive of min and exclusive of max, so +1
  return String(crypto.randomInt(min, max + 1));
}

module.exports = generateOTP;