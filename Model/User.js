const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    Number: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Usermodal = mongoose.model("User", UserSchema);
module.exports = Usermodal;
