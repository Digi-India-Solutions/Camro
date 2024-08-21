const Voucher = require('../models/Vouchers.model');  // Adjust the path as needed

// Create a new voucher
exports.createVoucher = async (req, res) => {
    try {
      
        const { CouponeCode, HowMuchPercentageof, Active } = req.body;

        const newVoucher = new Voucher({
            CouponeCode,
            HowMuchPercentageof,
            Active
        });

        const savedVoucher = await newVoucher.save();
        res.status(201).json({
            success: true,
            data: savedVoucher
        });
    } catch (error) {
        // Handle duplicate key error
        if (error.code === 11000 && error.keyPattern && error.keyValue) {
            const duplicateKey = Object.keys(error.keyPattern)[0];
            const duplicateValue = error.keyValue[duplicateKey];
            return res.status(400).json({
                success: false,
                error: `Coupon code '${duplicateValue}' already exists. Please use a different coupon code.`
            });
        }
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

exports.getAllVouchers = async (req,res)=>{
    try {
        const AllVouchers = await Voucher.find()
        if(AllVouchers.length === 0){
            return res.status(403).json({
                success:false,
                msg:"No Vouchers"
            })
        }
        res.status(200).json({
            success:true,
            data:AllVouchers,
            msg:" Vouchers Find"
        })
    } catch (error) {
        res.status(501).json({
            success:true,
            msg:"Internal Server Error Vouchers Find"
        })
        console.log(error)
    }
}
// Update an existing voucher
exports.updateVoucher = async (req, res) => {
    try {
        const { id } = req.params;
        const { CouponeCode, HowMuchPercentageof, Active } = req.body;

        const updatedVoucher = await Voucher.findByIdAndUpdate(id, { 
            CouponeCode, 
            HowMuchPercentageof, 
            Active 
        }, { new: true });

        if (!updatedVoucher) {
            return res.status(404).json({
                success: false,
                error: "Voucher not found"
            });
        }

        res.status(200).json({
            success: true,
            data: updatedVoucher
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

// Delete a voucher
exports.deleteVoucher = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedVoucher = await Voucher.findByIdAndDelete(id);

        if (!deletedVoucher) {
            return res.status(404).json({
                success: false,
                error: "Voucher not found"
            });
        }

        res.status(200).json({
            success: true,
            data: deletedVoucher
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

// Activate a voucher
exports.activateVoucher = async (req, res) => {
    try {
        const { id } = req.params;

        const activatedVoucher = await Voucher.findByIdAndUpdate(id, { Active: true }, { new: true });

        if (!activatedVoucher) {
            return res.status(404).json({
                success: false,
                error: "Voucher not found"
            });
        }

        res.status(200).json({
            success: true,
            data: activatedVoucher
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

// Deactivate a voucher
exports.deactivateVoucher = async (req, res) => {
    try {
        const { id } = req.params;

        const deactivatedVoucher = await Voucher.findByIdAndUpdate(id, { Active: false }, { new: true });

        if (!deactivatedVoucher) {
            return res.status(404).json({
                success: false,
                error: "Voucher not found"
            });
        }

        res.status(200).json({
            success: true,
            data: deactivatedVoucher
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

// Apply a voucher
exports.applyVoucher = async (req, res) => {
    try {
        const { CouponeCode, orderTotal } = req.body;

        const voucher = await Voucher.findOne({ CouponeCode });

        if (!voucher) {
            return res.status(404).json({
                success: false,
                error: "Voucher not found"
            });
        }

        try {
            const discountedTotal = voucher.applyVoucher(orderTotal);
            res.status(200).json({
                success: true,
                data: { discountedTotal }
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};