// backend/utils/generateId.js

const generateUniqueId = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';

  const randomChar = () => letters[Math.floor(Math.random() * letters.length)];
  const randomDigit = () => digits[Math.floor(Math.random() * digits.length)];

  return (
    '#' +
    randomChar() +
    randomChar() +
    randomDigit() +
    randomDigit() +
    randomChar() +
    randomChar() +
    randomDigit()
  );
};

module.exports = generateUniqueId;
