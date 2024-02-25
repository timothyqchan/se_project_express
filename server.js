const express = require("express");

const { PORT = 3001 } = process.env;
const app = express();

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}
