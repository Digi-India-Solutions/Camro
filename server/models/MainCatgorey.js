const mongoose = require("mongoose");

const MainCat = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    SubCategorey: [{
        type: String
    }]
}, { timestamps: true });

const MainCategory = mongoose.model("MainCategory", MainCat);

module.exports = MainCategory;
