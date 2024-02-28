// "C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe" --dbpath="c:\data\db"
// This is to run Mongo DB ^^^

const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const routes = require("./routes");

const errorHandler = require("./middlewares/error-handler");

const { requestLogger, errorLogger } = require("./middlewares/logger");

const { PORT = 3001 } = process.env;

const app = express();

app.use(cors());

app.use(express.json());

app.use(requestLogger);

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db", (req) => {
  console.log("connected to DB", req);
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}
