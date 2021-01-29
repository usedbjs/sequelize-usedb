const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { useDBSequelize } = require("../middleware");
const { Post } = require("./models");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const models = {
  Post,
};

const useDB = useDBSequelize(models);

app.use("/usedb", useDB);

const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
  console.log("server started on port ", PORT);
});
