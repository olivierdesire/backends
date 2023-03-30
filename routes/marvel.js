const express = require("express");
const router = express.Router();
const cors = require("cors");
const axios = require("axios");

router.use(cors());

// Routes characters
router.get("/characters", async (req, res) => {
  try {
    let filters = "";
    if (req.query.name) {
      filters = filters + "&name=" + req.query.name;
    }
    if (req.query.skip) {
      filters = filters + "&skip=" + req.query.skip;
    }
    const characters = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.APIKEY}` +
        filters
    );
    return res.status(200).json(characters.data);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.get("/character/:characterId", async (req, res) => {
  try {
    const character = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/character/${req.params.characterId}?apiKey=${process.env.APIKEY}`
    );
    return res.status(200).json(character.data);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// Route comics
router.get("/comics", async (req, res) => {
  let filters = "";
  if (req.query.title) {
    filters = filters + "&title=" + req.query.title;
  }
  if (req.query.skip) {
    filters = filters + "&skip=" + req.query.skip;
  }
  try {
    const comics = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.APIKEY}` +
        filters
    );
    return res.status(200).json(comics.data);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.get("/comics/:characterId", async (req, res) => {
  try {
    const character = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics/${req.params.characterId}?apiKey=${process.env.APIKEY}`
    );
    return res.status(200).json(character.data);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.get("/comic/:comicId", async (req, res) => {
  try {
    const comic = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comic/${req.params.comicId}?apiKey=${process.env.APIKEY}`
    );
    return res.status(200).json(comic.data);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
