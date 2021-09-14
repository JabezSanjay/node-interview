const express = require("express");
const router = express.Router();

const { getUserById } = require("../controllers/user");

router.param("userId", getUserById);

module.exports = router;
