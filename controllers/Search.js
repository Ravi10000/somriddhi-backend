const Deal = require("../models/Deal");
const Category = require("../models/Category");

exports.search = async (req, res) => {
  const { query } = req?.query;
  if (!query) return res.status(400).json({ message: "Bad request" });
  try {
    const deals = await Deal.find({ $text: { $search: query } });
    const categories = await Category.find({ $text: { $search: query } });
    res.status(200).json({ status: "success", deals, categories });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
