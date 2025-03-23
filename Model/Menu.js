const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema(
  {
    Menuname: {
      type: String,
      required: true,
    },
    Description: {
      type: String,
      required: true,
    },
    ingridents: [],
    Image: {
      type: String,
    },
    Price: {
      type: Number,
      required: true,
    },
    Discount: {
      type: Number,
    },
    Category: {
      type: String,
      required: true,
    },
    Branch: {
      type: [],
      required: true,
    },
  },
  { timestamps: true }
);

const Menumodel = mongoose.model("Menumanagement", MenuSchema);
module.exports = Menumodel;
