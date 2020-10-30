const { Router } = require("express");
const express = require("express");

const Projects = require("../helpers/projectModel");
const Actions = require("../helpers/actionModel");

const router = express.Router();

router.get("/", (req, res) => {
  Projects.get()
    .then((projects) => {
      res.status(200).json(projects);
    })
    .catch((err) => {
      res.status(500).json({ message: "Couldn't fetch projects at this time" });
    });
});

router.get("/:id", validateId, (req, res) => {
  Projects.get(req.params.id)
    .then((projects) => {
      res.status(200).json(projects);
    })
    .catch((err) => {
      res.status(500).json({ message: "Couldn't fetch projects at this time" });
    });
});

router.post("/", validateProject, (req, res) => {
  const newProj = { name: req.body.name, description: req.body.description };
  Projects.insert(newProj)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.put("/:id", [validateId, validateProject], (req, res, next) => {
  const newProj = { name: req.body.name, description: req.body.description };
  Projects.update(req.params.id, newProj)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.delete("/:id", validateId, (req, res) => {
  Projects.remove(req.params.id)
    .then(() => {
      res
        .status(200)
        .json({ message: `Successfully deleted Project ${req.params.id}` });
    })
    .catch((err) => {
      res.status(500).json({ message: "something went really wrong" });
    });
});

router.post("/:id/actions", [validateId, validateAction], (req, res) => {
  const newAction = {
    project_id: req.params.id,
    description: req.body.description,
    notes: req.body.notes,
  };
  Actions.insert(newAction)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json({ message: "something went really wrong" });
    });
});

function validateId(req, res, next) {
  Projects.get(req.params.id)
    .then((data) => {
      if (!data) {
        res.status(400).json({
          message: `A project with ID ${req.params.id} doesn\'t exist`,
        });
      } else {
        req.user = data;
        next();
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "something went tragically wrong" });
    });
}

function validateProject(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "missing post information" });
  } else if (!req.body.name) {
    res.status(400).json({ message: "missing name" });
  } else if (!req.body.description) {
    res.status(400).json({ message: "missing description" });
  } else {
    next();
  }
}

function validateAction(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "missing action information" });
  } else if (!req.body.description) {
    res.status(400).json({ message: "missing description" });
  } else if (!req.body.notes) {
    res.status(400).json({ message: "missing notes" });
  } else {
    next();
  }
}

module.exports = router;
