const express = require("express");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const router = express.Router();
const {
  createCart,
  getCart,
  updateCart,
  deleteCart,
} = require("../controllers/cart");

const { getUserById } = require("../controllers/user");
const { getCartById } = require("../controllers/cart");

router.param("userId", getUserById);
router.param("cartId", getCartById);

router.post("/cart/create/:userId", isSignedIn, isAuthenticated, createCart);

router.get("/cart/:cartId/:userId", isSignedIn, isAuthenticated, getCart);

router.put(
  "/cart/update/:cartId/:userId",
  isSignedIn,
  isAuthenticated,
  updateCart
);

router.delete(
  "/cart/delete/:cartId/:userId",
  isSignedIn,
  isAuthenticated,
  deleteCart
);

module.exports = router;
