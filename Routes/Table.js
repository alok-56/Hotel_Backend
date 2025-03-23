const express = require("express");

const { body } = require("express-validator");
const Islogin = require("../Middleware/Islogin");
const {
  CreateTable,
  UpdateTable,
  GetAllTable,
  GetTableById,
  DeleteTable,
} = require("../Controller/Table");

const TableRouter = express.Router();

TableRouter.post(
  "/create/Table",
  body("Tablename").notEmpty().withMessage("Tablename is required"),
  body("Kitchen").notEmpty().withMessage("Kitchen is required"),
  Islogin,
  CreateTable
);

TableRouter.patch("/update/Table/:id", Islogin, UpdateTable);

TableRouter.get("/getall/Table", Islogin, GetAllTable);

TableRouter.get("/get/Table/:id", Islogin, GetTableById);

TableRouter.delete("/delete/Table/:id", Islogin, DeleteTable);

module.exports = TableRouter;
