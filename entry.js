const express = require("express");
const app = express();
const connectDB = require("./db/connect");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");

require("dotenv").config();



// import routes
const authRoute = require("./routes/auth");
const libraryRoute = require("./routes/library");
// const welcome = 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


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
