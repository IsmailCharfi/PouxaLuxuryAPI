/*** Third-Party imports ***/
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const helmet = require("helmet");

/*** Custom imports ***/
const router = require("./Router");
const errorHandler = require("./Middlewares/errorHandler");
const routeNotFound = require("./Middlewares/routeNotFound");

const app = express();
const PORT = 5000;

// HTTP headers setter
app.use(helmet());
// Body-Parser
app.use(bodyParser.json());
// App Router
app.use("/api/", router);
// Route Not-Found error
app.use(routeNotFound);
// Error Handling
app.use(errorHandler);

mongoose
  .connect(
    `mongodb+srv://ismail:ismail@cluster0.lbahs.mongodb.net/dev?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Server listening on port " + PORT);
    app.listen(PORT);
  })
  .catch((err) => {
    console.log(err);
  });
