const express = require("express");
const app = express();

const bodyParser = require("body-parser");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require("dotenv").config();

const router = require("./routes/index");

app.use("/api", router);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server ${process.env.PORT || 3000} portunda çalışıyor`);
});
