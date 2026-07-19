const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews");

const DEFAULT_IMAGE =
  "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?cs=srgb&dl=pexels-binyamin-mellish-106399.jpg&fm=jpg";

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  image: {
    type: String,
    default: DEFAULT_IMAGE,
    set: (v) => {
      if (!v || v.trim() === "") {
        return DEFAULT_IMAGE;
      }
      return v;
    },
  },

  price: {
    type: Number,
  },

  location: {
    type: String,
  },

  country: {
    type: String,
  },

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  }
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } })
  }
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;