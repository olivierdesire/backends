const mongoose = require("mongoose");

const Request = mongoose.model("Request", {
  request: String,
  response: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = Request;
