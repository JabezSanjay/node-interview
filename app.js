const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: true }));

const productionDb = process.env.PROD_DATABASE;

//DB connection
mongoose
  .connect(productionDb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB CONNECTED"))
  .catch((err) => console.log(err));

//Port
const port = process.env.PORT || 8000;

//Server Start
app.listen(port, () => {
  console.log(`App is running at ${port}`);
});
