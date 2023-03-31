const readexcelfile = require('read-excel-file/node');
let fs = require('fs');
const reader = require('xlsx')

exports.getExcelData = async (req, res) => {
    try {

        const file = reader.readFile('sample.xlsx')

        let data = []

        const sheets = file.SheetNames

        for (let i = 0; i < 1; i++) {
            const temp = reader.utils.sheet_to_json(
                file.Sheets[file.SheetNames[0]])
            temp.forEach((res) => {
                data.push(res)
            })
        }
        let result = [];
        for (let i = 1; i < data.length; i++) {
            result.push(data[i]);
        }

        // Printing data
        console.log(data)
        res.json({
            "status": true,
            "data": result
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

        // let userId = req.user.id;
        // if (!userId) throw new Error("Not logged in or Session expired.");

        // readexcelfile(fs.createReadStream('sample.xlsx')).then((rows) => {
        //     console.log(rows);
        //     res.json({
        //         "status": true,
        //         "data": rows
        //     });
        // })



    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
}