import db from "../../../../database/prisma.database.js";
export const registerFarmerProfile = async (req, res) => {
    try {
        const { farmerProfile } = req.body;
        if (!farmerProfile) {
            return res.status(400).json({ error: "farmerProfile is required" });
        }
        const { fullName, dob, mobileNumber, aadhaarNumber, address } = farmerProfile;
        if (!fullName || !dob || !mobileNumber || !aadhaarNumber || !address) {
            return res.status(400).json({
                error: "All fields (fullName, dob, mobileNumber, aadhaarNumber, address) are required",
            });
        }
        const parsedDob = new Date(dob);
        if (isNaN(parsedDob.getTime())) {
            return res.status(400).json({ error: "Invalid date format for dob" });
        }
        const farmer = await db.farmer.create({
            data: {
                fullName,
                dob: parsedDob,
                mobileNumber,
                aadhaarNumber,
                address,
            },
            select: {
                id: true,
            },
        });
        return res.status(201).json({
            message: "Farmer profile created successfully",
            farmerId: farmer.id,
        });
    }
    catch (error) {
        console.error(error);
        if (error.code === "P2002") {
            return res.status(409).json({
                error: `Duplicate entry: ${error.meta?.target?.join(", ")}`,
            });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};
//# sourceMappingURL=farmer.auth.controller.js.map