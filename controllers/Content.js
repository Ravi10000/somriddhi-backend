const Content = require("../models/content");

exports.getContent = async (req, res) => {
  console.log("get content");
  const content = await Content.find();
  if (content) {
    return res.status(200).json({ status: "success", content });
  }
  return res.status(400).json({ message: "content not found" });
};

exports.createContent = async (req, res) => {
  console.log("add content");
  const obj = {};
  if (req.body.title) obj.title = req.body.title;
  if (req.body.description) obj.description = req.body.description;
  if (req.file.filename) obj.image = req.file.filename;
  //   if (req.file.filename) content.image = req.file.filename;
  const content = await Content.create(obj);
  if (content) {
    return res.status(200).json({ status: "success", content });
  }
  return res.status(400).json({ message: "content not created" });
};

exports.updateContent = async (req, res) => {
  console.log("update content");
  console.log("body", req.body);
  console.log("file", req?.file);
  console.log("no image", !req?.file?.filename);
  const obj = {};
  if (req.body._id) obj.id = req.body._id;
  if (req.body?.title) obj.title = req.body.title;
  if (req.body?.description) obj.description = req.body.description;
  if (req?.file?.filename) obj.image = req.file.filename;

  const contentToUpdate = await Content.findByIdAndUpdate(
    obj.id,
    {
      $set: obj,
    },
    { new: true }
  );

  if (contentToUpdate) {
    return res
      .status(200)
      .json({ status: "success", content: contentToUpdate });
  }
  return res.status(400).json({ message: "content not created" });
};

exports.deleteContent = async (req, res) => {
  console.log("delete content");
  const content = await Content.findByIdAndDelete(req.params.id);
  console.log({ content });
  if (content) {
    return res
      .status(200)
      .json({ status: "success", message: "content deleted" });
  }
  res.status(400);
};
