const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  members: {
    type: mongoose.Schema.Types.Array,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Room", RoomSchema);
