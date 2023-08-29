const express = require("express");
const app = express();
const connectDB = require("./db/connect");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const jwt = require("jsonwebtoken");
const helmet = require("helmet");

require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const for_not_logged_in_user = ['sign_in.html', 'sign_up.html', 'forgot_password.html'];
const for_logged_in_user = ['home_page.html', 'library.html', 'notification.html', 'playhead.html'];

app.use('/pages/:filename', (req, res, next) => {
  const requestedFile = req.params.filename;
  const token = req.cookies.authToken;

  if (for_not_logged_in_user.includes(requestedFile)) {
    if (token) {
      jwt.verify(token, process.env.TOKEN_SECRET, (err) => {
        if (!err) {
          return res.redirect('/pages/home_page.html');
        }
        next();
      });
    } else {
      next();
    }
  } else if (for_logged_in_user.includes(requestedFile)) {
    if (token == null) {
      return res.redirect('/pages/sign_in.html');
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err) => {
      if (err) {
        return res.redirect('/pages/sign_in.html');
      }
      next();
    });
  } else {
    next();
  }
});


// import routes
const authRoute = require("./routes/auth");
const libraryRoute = require("./routes/library");
// const welcome = 

// static folder
app.use(express.static("./public"));

// sanitize data
app.use(mongoSanitize());

// prevent XSS  by setting security headers
app.use(helmet());

// route middleware
app.use("/api/v1/user", authRoute);
app.use("/api/v1/library", libraryRoute);

const port = process.env.PORT || 8000;
// app.listen(8000, () => {
//   console.log("server is up");
// });
const start = async () => {
  try {
    await connectDB(process.env.DB_CONNECT);
    app.listen(port, () => {
      console.log("server is running");
    });
  } catch (error) {
    console.log(error);
  }
};

start();
