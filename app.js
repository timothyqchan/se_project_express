// "C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe" --dbpath="c:\data\db"

const express = require("express");

const mongoose = require("mongoose");

const routes = require("./routes");

const { PORT = 3001 } = process.env;
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db", (req) => {
  console.log("connected to DB", req);
});

app.use(express.json());
app.use(routes);
app.listen(PORT, () => {
  console.log(`App listening on ${PORT}`);
});
