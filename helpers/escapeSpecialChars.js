function escapeHtmlChars(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
module.exports = escapeSpecialChars = quiz => {
  for (let property in quiz) {
    quiz[property] = escapeHtmlChars(quiz[property]);
  }
  return quiz;
};
