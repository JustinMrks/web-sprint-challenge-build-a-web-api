const { Router } = require("express");
const express = require("express");

const Projects = require("../helpers/projectModel");
const Actions = require("../helpers/actionModel");

const router = express.Router();

router.get("/", (req, res) => {
  Actions.get()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json({ message: "something went really wrong" });
    });
});

router.get("/:id", validateId, (req, res) => {
  Actions.get(req.action.id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json({ message: "something went really wrong" });
    });
});

router.put("/:id", [validateId, validateAction], (req, res) => {
  const actionUpdate = {
    ...req.action,
    description: req.body.description,
    notes: req.body.notes,
  };
  Actions.update(req.params.id, actionUpdate)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json({ message: "something went really wrong" });
    });
});

router.delete("/:id", validateId, (req, res) => {
  Actions.remove(req.params.id)
    .then((data) => {
      res
        .status(200)
        .json({ message: `Successfully deleted action ${req.params.id}` });
    })
    .catch((err) => {
      res.status(400).json({ message: "something went really wrong" });
    });
});

function validateId(req, res, next) {
  Actions.get(req.params.id)
    .then((data) => {
      if (!data) {
        res.status(400).json({
          message: `A project with ID ${req.params.id} doesn\'t exist`,
        });
      } else {
        req.action = data;
        next();
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "something went tragically wrong" });
    });
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
