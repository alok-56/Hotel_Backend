const express = require("express");
const { body } = require("express-validator");
const Islogin = require("../Middleware/Islogin");
const {
  DashboardCount,
  SalesDashboard,
  PaymentDashboard,
} = require("../Controller/Report");

const Reportrouter = express.Router();

Reportrouter.get("/get/dashboard/count", Islogin, DashboardCount);

Reportrouter.get("/get/sales/dashbaord", Islogin, SalesDashboard);

Reportrouter.get("/get/payment/dashboard", Islogin, PaymentDashboard);

module.exports = Reportrouter;
