const express = require("express");
const router = express.Router();
const cors = require("cors");
const formData = require("form-data");
const Mailgun = require("mailgun.js");

const app = express();
app.use(express.json());
app.use(cors());

// Configuration de Mailgun
const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: "Olivier",
  key: process.env.MAILGUN_API_KEY,
});

router.post("/form", async (req, res) => {
  console.log("route /form");

  // Création message mail gun
  const messageData = {
    from: `${req.body.firstname} ${req.body.lastname} <${req.body.email}>`,
    to: "olivier.desire37@gmail.com",
    subject: `${req.body.subject}`,
    text: req.body.message,
  };

  console.log("messageData >>>", messageData);

  try {
    const response = await client.messages.create(
      process.env.SANDBOX,
      messageData
    );
    console.log("response >>>", response);
    res.status(200).json({ message: "email sent !!!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
