require("dotenv").config();
const express = require("express");
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");
const mongoose = require("mongoose");
const SHA256 = require("crypto-js/sha256");
const base64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

router.use(cors());
router.use(express.json());

// model
mongoose.connect(`${process.env.MONGODB_URI}/chatGPT-app`);

// middleware
const isAuthenticated = require("../middlewares/isAuthenticated");

// import des modèles
const User = require("../models/User");
const Request = require("../models/Request");

const configuration = new Configuration({
  organization: process.env.ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// route /chat/user/signin
router.post("/chat/user/signup", async (req, res) => {
  console.log("route /chat/user/signup");
  try {
    const { username, email, password } = req.body;
    if (username && email) {
      const userFound = await User.findOne({ email: email });
      if (!userFound) {
        const generatedSalt = uid2(16);
        const generatedHash = SHA256(password + generatedSalt).toString(base64);
        const generatedToken = uid2(16);

        const newUser = new User({
          email: email,
          account: {
            username: username,
          },
          token: generatedToken,
          hash: generatedHash,
          salt: generatedSalt,
        });

        await newUser.save();

        return res.status(201).json({
          _id: newUser._id,
          token: newUser.token,
          account: { username: newUser.account.username },
          email,
        });
      } else {
        return res
          .status(400)
          .json({ error: { message: "Email already has an account" } });
      }
    } else {
      return res
        .status(400)
        .json({ error: { message: "Username/Email missing" } });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// route chat/user/login
router.post("/chat/user/login", async (req, res) => {
  console.log("route /chat/user/login");
  try {
    const { email, password } = req.body;
    if (email && password) {
      const userFound = await User.findOne({ email: email });
      if (userFound) {
        const generatedHash = SHA256(password + userFound.salt).toString(
          base64
        );
        if (generatedHash === userFound.hash) {
          return res.status(200).json({
            _id: userFound._id,
            token: userFound.token,
            account: { username: userFound.account.username },
          });
        } else {
          return res
            .status(400)
            .json({ error: { message: "Incorrect email or password" } });
        }
      } else {
        return res
          .status(400)
          .json({ error: { message: "Incorrect email or password" } });
      }
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// route chat
router.post("/chat/request", isAuthenticated, async (req, res) => {
  const { request } = req.body;
  console.log(request);
  if (request) {
    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: request }],
      });
      //   console.log(completion.data.choices);
      // création nouvel objet
      const newRequest = new Request({
        request: request,
        response: completion.data.choices[0].message.content,
        owner: req.user,
      });
      //
      await newRequest.save();
      //
      res.status(200).json({ response: completion.data.choices[0].message });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(400).json("Poser votre question");
  }
});

// route get request
router.get("/chat/request/list", isAuthenticated, async (req, res) => {
  console.log("route /chat/resquest/list");

  try {
    const listRequest = await Request.find({ owner: req.user._id });
    res.status(200).json(listRequest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
