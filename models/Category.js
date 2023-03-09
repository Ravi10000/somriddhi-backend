const mongoose = require('mongoose');
const { Schema } = mongoose;

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.type.ObjectId,
        default: Date.now
    }
});
const Category = mongoose.model('category', CategorySchema);
module.exports = Category;

//create category
//update category
//get all categories
//delete category
