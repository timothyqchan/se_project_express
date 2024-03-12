require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const { errors } = require("celebrate");

const routes = require("./routes/index");

const errorHandler = require("./middlewares/error-handler");

const { requestLogger, errorLogger } = require("./middlewares/logger");

const { PORT = 3001 } = process.env;

const app = express();

app.use(
  cors({
    "Access-Control-Allow-Origin": "https://api.wtwrproject.crabdance.com",
  }),
);

app.use(express.json());

app.use(requestLogger);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db", (req) => {
  console.log("connected to DB", req);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
