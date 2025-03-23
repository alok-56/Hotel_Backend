const mongoose = require("mongoose");

const TableSchema = new mongoose.Schema(
  {
    Tablename: {
      type: String,
      required: true,
    },
    Kitchen: {
      type: String,
      required: true,
    },
    Branch: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Tablemodel = mongoose.model("Tablemanagement", TableSchema);
module.exports = Tablemodel;
