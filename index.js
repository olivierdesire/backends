require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const deliverooRoutes = require("./routes/deliveroo");
app.use(deliverooRoutes);

const serverMailRoutes = require("./routes/serverMail");
app.use(serverMailRoutes);

const chatGPTRoutes = require("./routes/chatGPT");
app.use(chatGPTRoutes);

app.listen(process.env.PORT || 3200, () => {
  console.log("Server started");
});
