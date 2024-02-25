// "C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe" --dbpath="c:\data\db"
// This is to run Mongo DB ^^^

const express = require("express");

const mongoose = require("mongoose");

const routes = require("./routes");

const errorHandler = require("./middlewares/error-handler");

const { requestLogger, errorLogger } = require("./middlewares/logger");

const { PORT = 3001 } = process.env;
const app = express();

const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(errors());

app.use(errorHandler);

app.use(requestLogger);

app.use(errorLogger);

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db", (req) => {
  console.log("connected to DB", req);
});

app.use(express.json());

app.use(routes);
