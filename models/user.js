const crypto = require("crypto");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 6,
  },
  country: {
    type: String,
    required: true,
    min: 6,
  },
  number: {
    type: String,
    required: true,
    min: 11,
  },
  email: {
    type: String,
    required: true,
    min: 8,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    // select:true,
  },
  confirm_password: {
    type: String,
    required: true,
    min: 8,
    select:false
  },
  date: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  
});

// generate and hash password token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  // hash token and set to reset password field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// checks if password is modified
// userSchema.methods.checkModified = function (field) {
//   return this.isModified(field);
// };

module.exports = mongoose.model("User", userSchema);
