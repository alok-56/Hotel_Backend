const { validationResult } = require("express-validator");
const Branchmodel = require("../../Model/Branch");
const AppErr = require("../../Helper/AppError");
const Categoriesmodel = require("../../Model/Cateogery");


// Create Category
const CreateCategory = async (req, res, next) => {
  try {
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }
    let { Categoriesname, Branch } = req.body;

    // check Branch
    let branchcheck = await Branchmodel.findById(Branch);
    if (!branchcheck) {
      return next(new AppErr("Branch Not Found", 403));
    }

    let Category = await Categoriesmodel.create(req.body);
    return res.status(200).json({
      status: false,
      code: 200,
      message: "Category Created Successfully",
      data: Category,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Update Category
const UpdateCategory = async (req, res, next) => {
  try {
    let { Categoriesname, Branch } = req.body;

    let { id } = req.params;
    if (!id) {
      return next(new AppErr("Category ID is required", 400));
    }

    if (Branch) {
      let branchcheck = await Branchmodel.findById(Branch);
      if (!branchcheck) {
        return next(new AppErr("Branch Not Found", 403));
      }
    }

    let updateData = {};
    if (Categoriesname) updateData.Categoriesname = Categoriesname;
    if (Branch) updateData.Branch = Branch;

    let updateCategory = await Categoriesmodel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    return res.status(200).json({
      status: false,
      code: 200,
      message: "Category Updated Successfully",
      data: updateCategory,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Get All Category
const GetAllCategory = async (req, res, next) => {
  try {
    let Category = await Categoriesmodel.find({ Branch: { $in: req.branch } });

    return res.status(200).json({
      status: false,
      code: 200,
      message: "Category Fecthed Successfully",
      data: Category,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// user website categerios
const GetAllCategoryForusers = async (req, res, next) => {
  try {
    let { branch } = req.params;
    let Category = await Categoriesmodel.find({ Branch: branch });

    return res.status(200).json({
      status: false,
      code: 200,
      message: "Category Fecthed Successfully",
      data: Category,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//  Get Category By  Id
const GetCategoryById = async (req, res, next) => {
  try {
    let { id } = req.params;
    if (!id) {
      return next(new AppErr("Category ID is required", 400));
    }

    let Category = await Categoriesmodel.findById(id);

    return res.status(200).json({
      status: false,
      code: 200,
      message: "Category Fecthed Successfully",
      data: Category,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Delete Category
const DeleteCategory = async (req, res, next) => {
  try {
    let { id } = req.params;
    if (!id) {
      return next(new AppErr("Category ID is required", 400));
    }

    await Categoriesmodel.findByIdAndDelete(id);

    return res.status(200).json({
      status: false,
      code: 200,
      message: "Category Deleted Successfully",
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreateCategory,
  UpdateCategory,
  GetAllCategory,
  GetCategoryById,
  DeleteCategory,
  GetAllCategoryForusers,
};
