const express = require("express");
const {
  CreateBranch,
  UpdateBranch,
  GetAllBranch,
  GetBranchById,
  DeleteBranch,
} = require("../Controller/Branch");
const { body } = require("express-validator");
const Islogin = require("../Middleware/Islogin");
const BranchRouter = express.Router();

BranchRouter.post(
  "/create/branch",
  body("Branchname").notEmpty().withMessage("Branchname is required"),
  body("Location").notEmpty().withMessage("Location is required"),
  Islogin,
  CreateBranch
);

BranchRouter.patch("/update/branch/:id", Islogin, UpdateBranch);

BranchRouter.get("/getall/branch", Islogin, GetAllBranch);

BranchRouter.get("/get/branch/:id", Islogin, GetBranchById);

BranchRouter.delete("/delete/branch/:id", Islogin, DeleteBranch);

module.exports = BranchRouter;
