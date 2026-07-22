const Listing = require("../models/listing")
// index listing
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listing/index.ejs", { allListings });
}

// new form listing
module.exports.renderNewForm = (req, res) => {
    res.render("listing/new.ejs");
}

// show listing
module.exports.showListing = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        },
    }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!")
        return res.redirect("/listings")
    }

    res.render("listing/show.ejs", { listing });
}

// create listing
module.exports.createListing = async (req, res) => {
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
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!")
    res.redirect("/listings");
}
// edit form 
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);

    res.render("listing/edit.ejs", { listing });
}

// update listings
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    await Listing.findByIdAndUpdate(id, {
        ...req.body.listing,
    });
    req.flash("success", " Listing Updated!")
    res.redirect(`/listings/${id}`);
}

//destroy lisitng

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;

    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings");
}