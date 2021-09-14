const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const ProductCartSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const cartSchema = mongoose.Schema(
  {
    cartItems: [ProductCartSchema],
    cartDateTime: {
      type: Date,
    },
    user: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
