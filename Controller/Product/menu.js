const { validationResult } = require("express-validator");
const Branchmodel = require("../../Model/Branch");
const AppErr = require("../../Helper/AppError");
const Categoriesmodel = require("../../Model/categories");
const Menumodel = require("../../Model/Menu");

// Create Menu
const CreateMenu = async (req, res, next) => {
  try {
    let err = validationResult(req);
    if (err.errors.length > 0) {
      return next(new AppErr(err.errors[0].msg, 403));
    }
    let { Menuname, Description, ingridents, Price, Discount, Category } =
      req.body;

    // check cateogry
    let catcheck = await Categoriesmodel.findById(Category);
    if (!catcheck) {
      return next(new AppErr("Cateogies Not Found", 403));
    }

    req.body.Branch = catcheck.Branch;

    let Menu = await Menumodel.create(req.body);
    return res.status(200).json({
      status: false,
      code: 200,
      message: "Menu Created Successfully",
      data: Menu,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Update Menu
const UpdateMenu = async (req, res, next) => {
  try {
    let { id } = req.params;
    if (!id) {
      return next(new AppErr("Menu ID is required", 400));
    }
    let { Menuname, Description, ingridents, Price, Discount, Category } =
      req.body;

    // check cateogry
    var catcheck;
    if (Category) {
      catcheck = await Categoriesmodel.findById(Category);
      if (!catcheck) {
        return next(new AppErr("Cateogies Not Found", 403));
      }
    }

    let updateData = {};
    if (Menuname) updateData.Menuname = Menuname;
    if (Description) updateData.Description = Description;
    if (ingridents) updateData.ingridents = ingridents;
    if (Price) updateData.Price = Price;
    if (Discount) updateData.Discount = Discount;
    if (Category) updateData.Category = Category;
    if (Category) updateData.Branch = catcheck.Branch;

    let updateMenu = await Menumodel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    return res.status(200).json({
      status: false,
      code: 200,
      message: "Menu Updated Successfully",
      data: updateMenu,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Get All Menu
const GetAllMenu = async (req, res, next) => {
  try {
    let Menu = await Menumodel.find({ Branch: { $in: req.branch } });

    return res.status(200).json({
      status: false,
      code: 200,
      message: "Menu Fecthed Successfully",
      data: Menu,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//  Get Menu By  Id
const GetMenuById = async (req, res, next) => {
  try {
    let { id } = req.params;
    if (!id) {
      return next(new AppErr("Menu ID is required", 400));
    }

    let Menu = await Menumodel.findById(id);

    return res.status(200).json({
      status: false,
      code: 200,
      message: "Menu Fecthed Successfully",
      data: Menu,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Delete Menu
const DeleteMenu = async (req, res, next) => {
  try {
    let { id } = req.params;
    if (!id) {
      return next(new AppErr("Menu ID is required", 400));
    }

    await Menumodel.findByIdAndDelete(id);

    return res.status(200).json({
      status: false,
      code: 200,
      message: "Menu Deleted Successfully",
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

// Get Menu for user website
const GetAllMenuForusers = async (req, res, next) => {
  try {
    let { branch, category } = req.query;
    if (!branch) {
      return next(new AppErr("Branch is required", 400));
    }
    var Menu;
    if (branch && category) {
      Menu = await Menumodel.find({
        Branch: { $in: branch },
        Category: category,
      });
    } else if (branch) {
      Menu = await Menumodel.find({ Branch: branch });
    }

    return res.status(200).json({
      status: false,
      code: 200,
      message: "Menu Fecthed Successfully",
      data: Menu,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreateMenu,
  UpdateMenu,
  GetAllMenu,
  GetMenuById,
  DeleteMenu,
  GetAllMenuForusers,
};
