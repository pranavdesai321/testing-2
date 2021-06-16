const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const morgan = require("morgan");
const exphbs = require("express-handlebars");
const session = require("express-session");
const passport = require("passport");

const MongoStore = require("connect-mongo");
const connectDB = require("./config/db");
//Load config
dotenv.config({ path: "./config/config.env" });

//passport config

require("./config/passport")(passport);
connectDB();

const app = express();

app.engine(".hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");

// Sessions

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI, //(URI FROM.env file)
    }),
  })
);

//passport middleware

app.use(passport.initialize());
app.use(passport.session());

// Static Folder
app.use(express.static(path.join(__dirname, "/public")));

// Routes

app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
