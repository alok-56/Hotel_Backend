const mongoose = require("mongoose");

const CategoriesSchema = new mongoose.Schema(
  {
    Categoriesname: {
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

const Categoriesmodel = mongoose.model("Categories", CategoriesSchema);
module.exports = Categoriesmodel;
