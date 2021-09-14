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

router.post("/cart/create", isSignedIn, isAuthenticated, createCart);

router.get("/cart/:cartId", isSignedIn, isAuthenticated, getCart);

router.put("/cart/update/:cartId", isSignedIn, isAuthenticated, updateCart);

router.delete("/cart/delete/:cartId", isSignedIn, isAuthenticated, deleteCart);

module.exports = router;
