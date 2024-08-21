const MainCategory = require('../models/MainCatgorey');

exports.CreateMainCategorey = async (req, res) => {
    try {
        const { title, SubCategorey } = req.body;
        const newMainCategory = new MainCategory({ title, SubCategorey });
        await newMainCategory.save();
        res.status(201).json({ success: true, data: newMainCategory });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.UpdateMainCategorey = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, SubCategorey } = req.body;
        const updatedMainCategory = await MainCategory.findByIdAndUpdate(
            id,
            { title, SubCategorey },
            { new: true, runValidators: true }
        );
        if (!updatedMainCategory) {
            return res.status(404).json({ success: false, error: "Main category not found" });
        }
        res.status(200).json({ success: true, data: updatedMainCategory });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.GetAllMainCategorey = async (req, res) => {
    try {
        const mainCategories = await MainCategory.find();
        res.status(200).json({ success: true, data: mainCategories });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.GetSubCategreyByMainCategorey = async (req, res) => {
    try {
        const { id } = req.params;
        const mainCategory = await MainCategory.findById(id);
        if (!mainCategory) {
            return res.status(404).json({ success: false, error: "Main category not found" });
        }
        res.status(200).json({ success: true, data: mainCategory.SubCategorey });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


exports.deleteMainCategorey = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMainCategory = await MainCategory.findByIdAndDelete(id);
        if (!deletedMainCategory) {
            return res.status(404).json({ success: false, error: "Main category not found" });
        }
        res.status(200).json({ success: true, data: deletedMainCategory });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
