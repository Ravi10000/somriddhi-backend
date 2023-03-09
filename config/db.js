const mongoose = require('mongoose');
// Connecting mongoDB Database
 const db = mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/lrm_arpita")
    .then((x) => {
        console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
    })
    .catch((err) => {
        console.error('Error connecting to mongo', err.reason)
    })


module.exports = db;