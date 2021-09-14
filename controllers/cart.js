const Cart = require("../models/cart");

exports.getCartById = (req, res, next, id) => {
  Cart.findById(id).exec((error, cart) => {
    if (error) {
      return res.status(400).json({
        status: "Error",
        error: "Cart not found!",
      });
    }
    req.cart = cart;
    next();
  });
};

exports.createCart = (req, res) => {
  const cart = new Cart(req.body);
  cart.user = req.auth;
  cart.save((error, cart) => {
    if (error || cart === undefined) {
      return res.status(400).json({
        status: "Error",
        message: "New cart is not created!",
      });
    }
    res.json({
      status: "Success",
      message: `New cart is created!`,
      dataId: cart._id,
    });
  });
};

exports.getCart = (req, res) => {
  return res.json(req.cart);
};

exports.updateCart = (req, res) => {
  const cart = req.cart;
  if (cart === null) {
    return res.status(400).json({
      status: "Error",
      message: "Cart is not found!",
    });
  }
  cart.cartItems = req.body.cartItems;

  cart.save((error, updatedCart) => {
    if (error) {
      return res.status(400).json({
        status: "Error",
        message: error,
      });
    }
    return res.json({
      status: "Success",
      message: `Cart updated!`,
      dataId: updatedCart._id,
    });
  });
};

exports.deleteCart = (req, res) => {
  const cart = req.cart;
  if (cart === null) {
    return res.status(400).json({
      status: "Error",
      message: "Cart is empty!",
    });
  }
  cart.remove((error, deletedCart) => {
    if (error) {
      return res.status(400).json({
        status: "Error",
        message: "Cart is not deleted!",
      });
    }
    return res.json({
      status: "Success",
      message: `Cart is deleted!`,
    });
  });
};
