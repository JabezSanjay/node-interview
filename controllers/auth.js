const User = require("../models/user");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const { validationResult } = require("express-validator");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

exports.register = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        status: "Error",
        message: "There is a problem with the image!",
      });
    }
    //destructure the fields
    const { name, email, password } = fields;

    if (!name) {
      return res.status(422).json({
        status: "Error",
        message: `Please enter name field!`,
      });
    }
    if (!email) {
      return res.status(422).json({
        status: "Error",
        message: `Please enter email field!`,
      });
    }
    if (!password) {
      return res.status(422).json({
        status: "Error",
        message: `Please enter password field!`,
      });
    }

    const user = new User(fields);

    const uploadFile = () => {
      if (file.photo) {
        fs.readFile(file.photo.path, (err, data) => {
          if (err) throw err;

          const params = {
            Bucket: "ecommerce-v2",
            Key: `${file.photo.name}`,
            Body: data,
            ContentType: file.photo.type,
            ACL: "public-read",
          };
          s3.upload(params, function (s3Err, data) {
            if (s3Err) throw s3Err;

            user.photo.url = data.Location;
            user.photo.name = data.Key;

            if (user.photo.url === undefined) {
              return res.status(400).json({
                status: "Error",
                message: "Please include your profile picture!",
              });
            }
            //save to the DB
            user.save((err, user) => {
              if (err) {
                return res.status(400).json({
                  status: "Error",
                  message: "User already exists!",
                });
              }
              if (err || s3Err) {
                console.log(err);
                res.status(400).json({
                  status: "Error",
                  message: "New user is not added!",
                });
              }

              res.json({
                status: "Success",
                message: "New user is created!",
              });
            });
          });
        });
      } else {
        //save to the DB
        user.save((err, user) => {
          if (user.url === undefined) {
            return res.status(400).json({
              status: "Error",
              message: "Please include the required fields",
            });
          }
          if (err) {
            res.status(400).json({
              status: "Error",
              message: "New user is not added!",
            });
          }
          res.json({
            status: "Success",
            message: "New user is created!",
          });
        });
      }
    };
    uploadFile();
  });
};

exports.signin = (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  User.findOne({ email }, (error, user) => {
    if (error || !user) {
      return res.status(400).json({
        status: "Error",
        message: "User does not exist!",
      });
    }
    if (!user.authenticate(password)) {
      return res.status(401).json({
        status: "Error",
        message: "Email and password do not match!",
      });
    }
    const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
      noTimestamp: true,
    });
    res.cookie("token", token);

    const { _id, name, email } = user;
    return res.json({
      token,
      user: { _id, name, email },
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  return res.json({
    message: "You have been signed out!",
  });
};

//Protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
  algorithms: ["HS256"],
});

//Custom middlewares
exports.isAuthenticated = (req, res, next) => {
  // let checker = req.profile && req.auth && req.auth._id == req.profile._id;
  if (!req.auth) {
    console.log(req.auth);
    return res.status(403).json({
      status: "Error",
      message: "Access Denied!",
    });
  }
  next();
};
