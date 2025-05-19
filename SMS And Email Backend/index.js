require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/notifications", notificationRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

app.listen(process.env.PORT, () => console.log(`Server running on http://localhost:${process.env.PORT}`));