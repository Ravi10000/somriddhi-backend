const readexcelfile = require('read-excel-file/node');
let fs = require('fs');
const reader = require('xlsx')
const Payment = require('../models/Payment');

exports.getExcelData = async (req, res) => {
    try {
        // console.log(req.file.originalname)
        const file = reader.readFile(`./uploads/${req.file.originalname}`)

        let data = []
        let result = [];
        let ans = [];
        const sheets = file.SheetNames

        for (let i = 0; i < 1; i++) {
            const temp = reader.utils.sheet_to_json(
                file.Sheets[file.SheetNames[0]])
            temp.forEach((res) => {
                data.push(res);
            })
        }
        for (let i = 1; i < data.length; i++) {
            result.push(data[i]);
        }

        for (let i = 0; i < result.length; i++) {
            const record = Object.values(result[i]);
            const Data = {
                'trackingId': record[0],
                'clicks': record[1],
                'itemsOrdered': record[2],
                'itemsShipped': record[3],
                'revenue': record[4],
                'addFees': record[5],
            }
            ans.push(Data);
            const newData = await Payment.create(Data);
            console.log(newData);
        }
        res.json({
            "status": true,
            "data": ans
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
}