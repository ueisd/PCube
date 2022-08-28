const router = require("express").Router();
import { isLoggedIn } from "../guards/isLoggedIn.guard";
const { Project } = require("../models/project.model");

export function getRouter() {
  router.get("/", isLoggedIn, (req, res) => {
    Project.findAll({ raw: true })
      .then((response) => {
        res.json(response);
      })
      .catch((err) => {
        res.status(401).json("error: " + err);
      });
  });

  router.put("/", isLoggedIn, (req, res) => {
    let project = req.body;
    project.name = project.name.trim();
    if (project.ProjectId < 0) project.ProjectId = null;
    Project.update(project, {
      where: {
        id: project.id,
      },
    })
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.status(401).json("error" + err);
      });
  });

  router.post("/", isLoggedIn, (req, res) => {
    let project = req.body;
    project.name = project.name.trim();
    if (project.ProjectId < 1) delete project.ProjectId;
    Project.create(project)
      .then((response) => {
        res.json(response);
      })
      .catch((err) => {
        res.status(401).json("error" + err);
      });
  });

  router.delete("/:id", isLoggedIn, (req, res) => {
    let id = req.params.id;
    Project.deleteById(id)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.status(401).json("error" + err);
      });
  });

  // @todo mettre en place les contraintes : pas supprimer quand des lignes detemps existent
  router.get("/is-deletable/:id", isLoggedIn, (req, res) => {
    let id = req.params.id;
    res.json(true);
  });

  router.post("/is-name-unique", isLoggedIn, (req, res) => {
    let id = req.body.id;
    let nameVerif = req.body.name;
    Project.isNameUnique(nameVerif, id)
      .then((result) => {
        if (result.length > 0) res.json(false);
        else res.json(true);
      })
      .catch((err) => {
        res.status(401).json("error: " + err);
      });
  });

  return router;
}
