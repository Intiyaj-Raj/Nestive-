const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js")
const ejsMate = require("ejs-mate");

const MONGO_URL = "mongodb://127.0.0.1:27017/nestive";
const { listingSchema } = require("./schema.js");
const wrapAsync = require("./utils/wrapAsync.js");

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.engine("ejs", ejsMate);


const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body)
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",")
    throw new ExpressError(400, errMsg)
  }
  else {
    next()
  }
}
app.get("/", (req, res) => {
  res.send("Hii, I am root.");
});

// index route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listing/index.ejs", { allListings });
});



// new route
app.get("/listings/new", (req, res) => {
  res.render("listing/new.ejs");
});

// show route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listing/show.ejs", { listing });
});

// create route
app.post("/listings", validateListing, wrapAsync(async (req, res) => {
  const { title, description, image, price, country, location } = req.body.listing;

  const newListing = new Listing({
    title,
    description,
    image,
    price,
    country,
    location,
  });
  await newListing.save();
  res.redirect("/listings");
}));

// edit route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listing/edit.ejs", { listing });
});

// update route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
})
);

// delete route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deltetedListing = await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});

// pages route
app.get("/privacy", (req, res) => {
  res.render("pages/privacy");
});

app.get("/terms", (req, res) => {
  res.render("pages/terms");
});

app.all("/*splat", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  if (err.name === "CastError") {
    err = new ExpressError(404, "Listing not found!");
  }

  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("listing/error.ejs", { message });
});
app.listen(3000, () => {
  console.log("server is running on 3000 port");
});
