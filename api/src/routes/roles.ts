"use strict";

const router = require("express").Router();
const { isLoggedIn } = require("../guards/isLoggedIn.guard");
const { Role } = require("../models/role.model");

export function getRouter() {
  router.get("/", isLoggedIn, (req, res) => {
    Role.findAll({ raw: true })
      .then((response) => {
        res.json(response);
      })
      .catch((err) => {
        res.status(401).json("error");
      });
  });
  return router;
}
