const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");

const MONGO_URL = "mongodb://127.0.0.1:27017/nestive";

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
app.post("/listings", async (req, res) => {
  try {
    let { title, description, image, price, country, location } = req.body;

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
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
});

// edit route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listing/edit.ejs", { listing });
});

// update route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body });
  res.redirect(`/listings/${id}`);
});

// delete route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deltetedListing = await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});
app.listen(3000, () => {
  console.log("server is running on 3000 port");
});
