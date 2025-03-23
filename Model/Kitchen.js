const mongoose = require("mongoose");

const KitchenSchema = new mongoose.Schema(
  {
    Kitchenname: {
      type: String,
      required: true,
    },
    Kitchennumber: {
      type: Number,
      required: true,
    },
    Kitchenpassword: {
      type: String,
      required: true,
    },
    Floor: {
      type: [],
      required: true,
    },
    Branch: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Kitchenmodel = mongoose.model("Kitchenmanagement", KitchenSchema);
module.exports = Kitchenmodel;
