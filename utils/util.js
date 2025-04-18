/**
 *
 * @param {number} amount
 * @returns {string}
 */
function formatNumber(amount) {
  return !isNaN(amount) ? amount.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") : "0";
}

/**
 *
 * @param {string | Array<string>} obj
 * @returns {string | Array<string>}
 */
function clearSpaces(obj) {
  if (Array.isArray(obj)) {
    return obj.filter((word) => /\S/.test(word));
  }

  return clearSpaces(obj.split(/ +/g)).join(" ");
}

/**
 *
 * @param {string} str
 * @param {?string} sep
 * @returns {string}
 */
function toProperCase(str, sep = " ") {
  return str
    .toLowerCase()
    .replace(/^(.)|\s+(.)/g, (chr) => chr.toUpperCase());
}

/**
 *
 * @param {string} str
 * @returns {string}
 */
function reverseString(str) {
  return str.split("").reverse().join("");
}

module.exports = {
  formatNumber,
  clearSpaces,
  toProperCase,
  reverseString,
};