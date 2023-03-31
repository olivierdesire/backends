require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const deliverooRoutes = require("./routes/deliveroo");
app.use(deliverooRoutes);

const serverMailRoutes = require("./routes/serverMail");
app.use(serverMailRoutes);

const chatGPTRoutes = require("./routes/chatGPT");
app.use(chatGPTRoutes);

const marvelRoutes = require("./routes/marvel");
app.use(marvelRoutes);

app.get("*", (req, res) => {
  res.status(400).json("Route not found");
});

app.listen(process.env.PORT || 3200, () => {
  console.log("Server started");
});
