// const readexcelfile = require("read-excel-file/node");
// let fs = require("fs");
const reader = require("xlsx");

exports.getExcelData = async (req, res) => {
  console.log("file", req.file);
  try {
    const file = reader.readFile(`uploads/${req.file.filename}`);

    const data = [];

    const sheetNames = file.SheetNames;

    for (let i = 0; i < 1; i++) {
      const temp = reader.utils.sheet_to_json(file.Sheets[sheetNames[i]]);
      temp.forEach((res) => {
        data.push(res);
      });
    }
    let result = [];
    for (let i = 1; i < data.length; i++) {
      result.push(data[i]);
    }

    // Printing data
    console.log(data);
    res.json({
      status: true,
      data: result,
    });

    // reader = fs.createReadStream('sample.xlsx');

    // // Read and display the file data on console
    // reader.on('data', function (chunk) {
    //     // console.log(chunk);
    //     res.json({
    //         "status": true,
    //         "data": chunk
    //     });
    // });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};
