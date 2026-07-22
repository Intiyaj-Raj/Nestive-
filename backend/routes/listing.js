const express = require("express");
const router = express.Router();

// const Listing = require("../models/listing");
// const Review = require("../models/reviews");
const wrapAsync = require("../utils/wrapAsync");
// const ExpressError = require("../utils/ExpressError");
// const { listingSchema } = require("../schema");
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js')
const listingController = require("../controllers/listingsController.js")


router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        validateListing,
        wrapAsync(listingController.createListing))



// New route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    .get(

        wrapAsync(listingController.showListing)
    )

    // Update route
    .put(
        isLoggedIn,
        isOwner,
        validateListing,
        wrapAsync(listingController.updateListing)
    )

    // Delete route
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.destroyListing)
    )

router.get(
    "/:id/edit", isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
)



module.exports = router;