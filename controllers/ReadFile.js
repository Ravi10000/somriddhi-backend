const readexcelfile = require("read-excel-file/node");
const fs = require("fs");

exports.getExcelData = async (req, res) => {
  try {
    // let userId = req.user.id;
    // if (!userId) throw new Error("Not logged in or Session expired.");

    console.log("file", req.file);

    readexcelfile(fs.createReadStream("sample.xlsx")).then((rows) => {
      // this is giving errors
      console.log(rows);
      res.json({
        status: true,
        data: rows,
      });
    });

    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};
