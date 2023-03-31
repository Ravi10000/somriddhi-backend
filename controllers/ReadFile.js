const readexcelfile = require("read-excel-file/node");
const fs = require("fs");
// const this = require('../uploads/sample2.xlsx')

exports.getExcelData = async (req, res) => {
  try {
    // let userId = req.user.id;
    // if (!userId) throw new Error("Not logged in or Session expired.");

    console.log("file", req.file);

    // this is giving errors
    // readexcelfile(fs.createReadStream("uploads/sample2.xls")).then((rows) => {
    //   console.log(rows);
      //   res.json({
      //     status: true,
      //     data: rows,
      //   });
    // });

    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};
