function validatePassword(req, res, next) {
  let regex = /(?=.*[a-z])(?=.*[0-9]).{8,}/i;
  if(!regex.test(req.body.password))
    return res.json({success: false, errorMsg: 'Enter valid password'});
  next();
}

function validateEmail(req, res, next) {
  let regex = /\S+@\S+\.\S+/;
  if(!regex.test(req.body.email))
    return res.json({success: false, errorMsg: 'Enter valid email'});
  next()
}

function validateName(req, res, next) {
  if(!regex.test(req.body.firstName) || !regex.test(req.body.lastName))
    return res.json({success: false, errorMsg: 'Enter valid name'});
  next();
}

module.exports = {
  validateEmail,
  validateName,
  validatePassword
};
