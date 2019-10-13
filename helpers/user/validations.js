function validatePassword(password) {
  let regex = /(?=.*[a-z])(?=.*[0-9]).{8,}/i;
  return regex.test(password);
}

function validateEmail(email) {
  let regex = /\S+@\S+.\S+/;
  return regex.test(email);
}

function validateName(name) {
  let regex = /^[a-z]+$/i;
  return regex.test(name);
}

module.exports = {
  validateEmail,
  validateName,
  validatePassword
};
