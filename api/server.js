const express = require("express");
const Spells = require("./spells/spells-model");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.status(200).json({ api: "up" });
});

server.get("/spells", (req, res, next) => {
  Spells.getAll()
    .then(spells => {
      res.status(200).json(spells);
    })
    .catch(err => {
      next(err);
    });
});

server.post("/spells", (req, res) => {
  res.end();
});

server.delete("/spells/:id", (req, res) => {
  res.end();
});

server.use((err, req, res, next) => { // eslint-disable-line
    res.status(500).json({
        note: 'An error occurred in the server file!',
        message: err.message,
        stack: err.stack
    });
});

module.exports = server;
