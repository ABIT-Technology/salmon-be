const express = require("express");
const app = express.Router();
const v1Router = require("./v1");

app.use("/v1", v1Router);

module.exports = app;
