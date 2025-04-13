const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Username: {
      type: String,
      required: true,
      unique: true,
    },
    Password: {
      type: String,
      required: true,
    },
    Branch: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Branchmanagement",
    },
    Permission: {
      type: [],
      required: true,
    },
    Blocked: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const Adminmodel = mongoose.model("Adminmanagement", AdminSchema);
module.exports = Adminmodel;
