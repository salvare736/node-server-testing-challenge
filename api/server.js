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

server.post("/spells", (req, res, next) => {
  const spell = req.body;
  Spells.insert(spell)
    .then(newSpell => {
      res.status(200).json(newSpell);
    })
    .catch(err => {
      next(err);
    });
});

server.delete("/spells/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const delSpell = await Spells.remove(id);
    res.status(200).json(delSpell);
  } catch (err) {
    next(err);
  }
});

server.use((err, req, res, next) => { // eslint-disable-line
    res.status(500).json({
        note: 'An error occurred in the server file!',
        message: err.message,
        stack: err.stack
    });
});

module.exports = server;
