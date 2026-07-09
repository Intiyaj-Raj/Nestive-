const express = require("express");
const router = express.Router();

const Listing = require("../models/listing");
const Review = require("../models/reviews");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema } = require("../schema");

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else {
        next();
    }
};

// Index
router.get(
    "/",
    wrapAsync(async (req, res) => {
        const allListings = await Listing.find({});
        res.render("listing/index.ejs", { allListings });
    })
);

// New
router.get("/new", (req, res) => {
    res.render("listing/new.ejs");
});

// Show
router.get(
    "/:id",
    wrapAsync(async (req, res) => {
        let { id } = req.params;

        const listing = await Listing.findById(id).populate("reviews");

        res.render("listing/show.ejs", { listing });
    })
);

// Create
router.post(
    "/",
    validateListing,
    wrapAsync(async (req, res) => {
        // const { title, description, image, price, country, location } =
        //     req.body.listing;

        // const newListing = new Listing({
        //     title,
        //     description,
        //     image,
        //     price,
        //     country,
        //     location,
        // });
        const newListing = new Listing(req.body.listing)
        await newListing.save();
        req.flash("success", "New Listing Created!")
        res.redirect("/listings");
    })
);

// Edit
router.get(
    "/:id/edit",
    wrapAsync(async (req, res) => {
        let { id } = req.params;

        const listing = await Listing.findById(id);

        res.render("listing/edit.ejs", { listing });
    })
);

// Update
router.put(
    "/:id",
    validateListing,
    wrapAsync(async (req, res) => {
        let { id } = req.params;

        await Listing.findByIdAndUpdate(id, {
            ...req.body.listing,
        });
        req.flash("success", " Listing Updated!")
        res.redirect(`/listings/${id}`);
    })
);

// Delete
router.delete(
    "/:id",
    wrapAsync(async (req, res) => {
        let { id } = req.params;

        await Listing.findByIdAndDelete(id);
        req.flash("success", "Listing Deleted!")
        res.redirect("/listings");
    })
);

module.exports = router;