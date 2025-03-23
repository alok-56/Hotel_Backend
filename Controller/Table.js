const { validationResult } = require("express-validator");
const AppErr = require("../Helper/AppError");
const Tablemodel = require("../Model/Table");
const Kitchenmodel = require("../Model/Kitchen");

// Create Table
const CreateTable = async (req, res, next) => {
  try {
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }
    let { Tablename, Kitchen } = req.body;

    // check table
    let kitchencheck = await Kitchenmodel.findById(Kitchen);
    if (!kitchencheck) {
      return next(new AppErr("Kitchen Not Found", 403));
    }
    req.body.Branch = kitchencheck._id;

    let tablecheck = await Tablemodel.findOne({
      Tablename: Tablename,
      Kitchen: Kitchen,
    });
    if (tablecheck) {
      return next(new AppErr("Table Name already exisits. select other", 403));
    }

    let Table = await Tablemodel.create(req.body);
    return res.status(200).json({
      status: false,
      code: 200,
      message: "Table Created Successfully",
      data: Table,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Update Table
const UpdateTable = async (req, res, next) => {
  try {
    let { Tablename, Kitchen } = req.body;

    let { id } = req.params;
    if (!id) {
      return next(new AppErr("Table ID is required", 400));
    }

    let tabledata = await Tablemodel.findById(id);
    if (!tabledata) {
      return next(new AppErr("Table Not Found", 403));
    }
    console.log(tabledata)

    // check table
    var kitchencheck;
    if (Kitchen) {
      kitchencheck = await Kitchenmodel.findById(Kitchen);
      if (!kitchencheck) {
        return next(new AppErr("Kitchen Not Found", 403));
      }
    }

    if (Tablename) {
      let tablecheck = await Tablemodel.findOne({
        Tablename: Tablename,
        Kitchen: tabledata.Kitchen
      });
      if (tablecheck) {
        return next(
          new AppErr("Table Name already exisits. select other", 403)
        );
      }
    }

    let updateData = {};
    if (Tablename) updateData.Tablename = Tablename;
    if (Kitchen) updateData.Kitchen = Kitchen;
    if (Kitchen) updateData.Branch = kitchencheck.Branch;

    let updateTable = await Tablemodel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    return res.status(200).json({
      status: false,
      code: 200,
      message: "Table Updated Successfully",
      data: updateTable,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Get All Table
const GetAllTable = async (req, res, next) => {
  try {
    let Table = await Tablemodel.find();

    return res.status(200).json({
      status: false,
      code: 200,
      message: "Table Fecthed Successfully",
      data: Table,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//  Get Table By  Id
const GetTableById = async (req, res, next) => {
  try {
    let { id } = req.params;
    if (!id) {
      return next(new AppErr("Table ID is required", 400));
    }

    let Table = await Tablemodel.findById(id);

    return res.status(200).json({
      status: false,
      code: 200,
      message: "Table Fecthed Successfully",
      data: Table,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Delete Table
const DeleteTable = async (req, res, next) => {
  try {
    let { id } = req.params;
    if (!id) {
      return next(new AppErr("Table ID is required", 400));
    }

    await Tablemodel.findByIdAndDelete(id);

    return res.status(200).json({
      status: false,
      code: 200,
      message: "Table Deleted Successfully",
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreateTable,
  UpdateTable,
  GetAllTable,
  GetTableById,
  DeleteTable,
};
