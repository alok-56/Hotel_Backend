const mongoose = require("mongoose");

const StaffSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Number: {
      type: Number,
      required: true,
    },
    Role: {
      type: String,
      required: true,
    },
    BranchId: {
      type: mongoose.Schema.Types.ObjectId,
           ref:"Branchmanagement",
           required: true,
    },
    JoiningDate: {
      type: String,
      required: true,
    },
    Address: {
      type: String,
      required: true,
    },
    Salary: {
      type: Number,
      required: true,
    },
    Active:{
      type:Boolean,
      default:true
    }
  },
  { timestamps: true }
);

const Staffmodel = mongoose.model("Staff", StaffSchema);
module.exports = Staffmodel;
