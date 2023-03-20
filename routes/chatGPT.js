require("dotenv").config();
const express = require("express");
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  organization: process.env.ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// route chat
router.post("/chat", async (req, res) => {
  const { question } = req.body;
  console.log(question);
  {
  }
  if (question) {
    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: question }],
      });
      //   console.log(completion.data.choices);
      res.status(200).json({ response: completion.data.choices[0].message });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(400).json("Poser votre question");
  }
});

module.exports = router;
