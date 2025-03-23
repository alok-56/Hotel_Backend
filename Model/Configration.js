const mongoose = require("mongoose");

const ConfigrationSchema = new mongoose.Schema(
  {
    Paymentmode: {
      type: [],
      required: true,
    },
    LocationAccess: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const Configrationmodel = mongoose.model("Configration", ConfigrationSchema);
module.exports = Configrationmodel;
