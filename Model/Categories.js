const mongoose = require("mongoose");

const CategoriesSchema = new mongoose.Schema(
  {
    Tablename: {
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

const Categoriesmodel = mongoose.model("Cateogery",CategoriesSchema);
module.exports = Categoriesmodel;
