const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session")
const flash = require("connect-flash")
// Routes
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");

const MONGO_URL = "mongodb://127.0.0.1:27017/nestive";

main()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true
}
// Home
app.get("/", (req, res) => {
  res.send("Hi, I am root.");
});

app.use(session(sessionOptions))
app.use(flash())

app.use((req, res, next) => {
  res.locals.success = req.flash("success")
  next();
})

// Routes
app.use("/listings", listingRouter);

app.use("/listings/:id/reviews", reviewRouter);

// Static Pages
app.get("/privacy", (req, res) => {
  res.render("pages/privacy");
});

app.get("/terms", (req, res) => {
  res.render("pages/terms");
});

// 404
app.all("/*splat", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Error Handler
app.use((err, req, res, next) => {
  if (err.name === "CastError") {
    err = new ExpressError(404, "Listing not found!");
  }

  let { statusCode = 500, message = "Something went wrong!" } = err;

  res.status(statusCode).render("listing/error.ejs", { message });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});