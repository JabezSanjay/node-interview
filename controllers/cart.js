const Cart = require("../models/cart");

exports.getCartById = (req, res, next, id) => {
  Cart.findById(id)
    .populate("user")
    .exec((error, cart) => {
      if (error) {
        return res.status(400).json({
          error: "Cart not found!",
        });
      }
      req.cart = cart;
      next();
    });
};

exports.createCart = (req, res) => {
  const cart = new Cart(req.body);
  cart.user = req.profile;
  cart.save((error, cart) => {
    if (error || cart === undefined) {
      return res.status(400).json({
        error: "New cart is not created!",
      });
    }
    res.json({
      message: `New cart is created!`,
    });
  });
};

exports.getCart = (req, res) => {
  return res.json(req.cart);
};

exports.updateCart = (req, res) => {
  const cart = req.cart;
  cart.cartItems = req.body.cartItems;

  cart.save((error, updatedCart) => {
    if (error) {
      return res.status(400).json({
        error: error,
      });
    }
    return res.json({
      message: `Cart updated!`,
    });
  });
};

exports.deleteCart = (req, res) => {
  const cart = req.cart;
  if (cart === null) {
    return res.status(400).json({
      error: "Cart is empty!",
    });
  }
  cart.remove((error, deletedCart) => {
    if (error) {
      return res.status(400).json({
        error: "Cart is not deleted!",
      });
    }
    return res.json({
      message: `Cart is deleted!`,
    });
  });
};
