const escapeHtmlChars = unsafe => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

module.exports = escapeSpecialChars = param => {
  for (let property in param) {
    param[property] =
      typeof param[property] == "string" && escapeHtmlChars(param[property]);
  }
  return param;
};
