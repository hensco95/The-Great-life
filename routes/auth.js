const crypto = require("crypto");
const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../sendEmail");
const nodemailer = require("nodemailer");
const sendGridEmail = require("../sendGridEmail");
const { verify } = require("./verifyToken");



const { registerValidation, loginValidation,resetPasswordValidation } = require("../validation");

// REGISTER ROUTE
router.post("/register", async (req, res) => {
  // validate data before creating user
  const { error } = registerValidation(req.body);
  const emailExist = await User.findOne({ email: req.body.email });

  const salt = await bcrypt.genSalt(15);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  if (error) {
    let errorMsg = error.details[0].message;
    return res.status(400).json({ msg: errorMsg });
  } else if (emailExist) {
    return res.status(400).json({ msg: "Email already exists" });
  } else {
    const user = new User({
      name: req.body.name,
      country: req.body.country,
      number: req.body.number,
      email: req.body.email,
      password: hashedPassword,
      confirm_password: hashedPassword,
    });
    try {
      const savedUser = await user.save();
      res
        .status(201)
        .json({ username: savedUser.name, msg: "user registered" });
    } catch (error) {
      res.status(400).json({ msg: error });
    }
  }
});

//LOGIN ROUTE
// router.post("/login", async (req, res, next) => {
//   const { error } = loginValidation(req.body);
//   if (error) {
//     let errorMsg = error.details[0].message;
//     return res.status(400).json({ msg: errorMsg });
//   }

  

//   const user = await User.findOne({ email: req.body.email });

//   if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

//   if (!user.checkModified("password")) {
//     next();
//   }

//   // compare passowrd to saved password in database
//   const validPass = await bcrypt.compare(req.body.password, user.password);
//   if (!validPass) return res.status(400).json({ msg: "Invalid Credentials" });

//   const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

//   return res
//     .header("auth-token", token)
//     .status(200)
//     .json({ msg: "log in successful", username: user.name, token });
// });



router.post("/login", async (req, res, next) => {
  try {
    const { error } = loginValidation(req.body);
    if (error) {
      let errorMsg = error.details[0].message;
      return res.status(400).json({ msg: errorMsg });
    }

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    

    // compare password to saved password in the database
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

    res
      .status(200)
      .cookie("authToken", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        token: token,
        secure: true, // Use "secure: true" if using HTTPS
        sameSite: "strict", // Set SameSite attribute for security
      })
      .json({ msg: "Log in successful", username: user.name });

    
      
  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
});

router.get("/welcome", verify, async (req, res) => {
  res.status(200).json({ msg: "Ekaabo" });
})



// LOGOUT ROUTE
router.get("/logout", async (req, res) => {
  try{
    let logOut = await res.cookie("authToken", "", {
      expires: new Date(0),
      httpOnly: true,
    });
    if (logOut) {
    return res.status(200).json({ msg: "log-out successful" })
  }
  } catch (err) {
    console.log(err);
  }
  

  
  
});

// router.get("/logout", async (req, res) => {
//   try {
//     // Clear the authToken cookie
//     res.cookie("authToken", "", {
//       expires: new Date(0),
//       httpOnly: true,
//     });

//     // Redirect to the login page after clearing the cookie
//     // res.redirect("/login");
//   } catch (error) {
//     console.error("Logout error:", error);
//     res.status(500).json({ error: "An error occurred during logout." });
//   }
// });


// FORGOT PASSWORD ROUTE
router.post("/forgotpassword", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res
      .status(404)
      .json({ msg: `User with ${req.body.email} does not exist` });
  }

  // get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // // create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/user/resetpassword/${resetToken}`;

  // console.log(resetUrl)

  

  const message = `To reset password, Please copy this token : ${resetToken} and paste into the reset input field`;

  

  try {
    // await sendEmail({
    //   email: user.email,
    //   subject: `Password reset token`,
    //   message,
    // });

    await sendGridEmail({
      email: user.email,
      subject: `Password reset token`,
      message,
    });

    res.status(200).json({ success: true, msg: `email sent` });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return res.status(500).json({ msg: `Email could not be sent` });
  }
});

// RESET PASSWORD
router.put("/resetpassword", async (req, res) => {
  // get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.body.resetPasswordToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  // checks if user doesn't exist from token expiration
  if (!user) {
    return res.status(400).json({ msg: "Invalid Token" });
  }

  // set password
  const salt = await bcrypt.genSalt(15);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  user.password = hashedPassword
  const { error } = resetPasswordValidation(req.body);
  if (error) {
    let errorMsg = error.details[0].message;
    return res.status(400).json({ msg: errorMsg });
  }
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

  return res
    .header("auth-token", token)
    .status(200)
    .json({ msg: "reset password successful", username: user.name});
});







module.exports = router;
