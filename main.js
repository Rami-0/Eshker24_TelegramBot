const express = require("express");
require("dotenv").config();
const bot = require("./core.js");


const cors = require("cors");

const userRouter = require("./routes/user.routes");

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(cors());
app.use("/v1/api/", userRouter);

app.listen(PORT, () => console.log("Server started " + PORT));
