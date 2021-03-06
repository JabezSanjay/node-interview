const mongoose = require("mongoose");
const crypto = require("crypto");
var uuid = require("uuid");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required!"],
    },
    photo: {
      url: String,
      name: String,
      default: "",
    },
    email: {
      type: String,
      required: [true, "Email is requried!"],
      unique: [true, "Email is already taken!"],
    },
    dateOfBirth: Date,
    encrypted_password: {
      type: String,
      required: [true, "Password is requried!"],
    },
    salt: String,
  },
  { timestamps: true }
);

UserSchema.virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuid.v4();
    this.encrypted_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

UserSchema.methods = {
  authenticate: function (plainpassword) {
    return this.securePassword(plainpassword) === this.encrypted_password;
  },

  securePassword: function (plainpassword) {
    if (!plainpassword) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};

module.exports = mongoose.model("User", UserSchema);
