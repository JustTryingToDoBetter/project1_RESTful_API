const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true}, // incase user gives the wrong input
    price: {type: Number, required: true},
    productImage: {type: String, required: true}
});

module.exports = mongoose.model("Product", productSchema);