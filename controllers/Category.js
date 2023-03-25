const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
  try {
    const category = {};
    if (req.body.name) category.name = req.body.name;
    if (req.file.filename) category.icon = req.file.filename;
    if (req.body.description) category.description = req.body.description;
    category.createdBy = req.user._id;
    const newCategory = await Category.create(category);
    const record = await newCategory.save();
    if (record) {
      res.status(200).json({
        status: "success",
        message: "Record created Successfully!",
        data: record,
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: "Record not created successfully!",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const allCategory = await Category.find({});
    if (allCategory) {
      res.status(200).json({
        status: "success",
        message: "Records fetched Successfully!",
        data: allCategory,
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: "Records not fetched successfully!",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateCategory = async (req, res) => {
  console.log("body", req.body, req.file);
  console.log("edit category");
  try {
    const categoryId = req.body._id;
    const category = {};
    if (req.body.name) category.name = req.body.name;
    if (req.file.filename) category.icon = req.file.filename;
    if (req.body.description) category.description = req.body.description;
    category.createdBy = req.user._id;
    console.log("category", category);
    const record = await Category.findByIdAndUpdate(
      categoryId,
      { $set: category },
      { new: true }
    );
    if (record) {
      res.status(200).json({
        status: "success",
        message: "Record updated Successfully!",
        data: record,
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: "Record not updated successfully!",
      });
    }
  } catch (err) {
    console.log({ err });
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const record = await Category.deleteOne({ _id: categoryId });
    if (record) {
      res.status(200).json({
        status: "success",
        message: "Record delete Successfully!",
        data: record,
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: "Record not delete successfully!",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
