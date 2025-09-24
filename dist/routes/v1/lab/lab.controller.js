import bcrypt from "bcryptjs";
import crypto from "crypto";
import db from "../../../database/prisma.database.js";
export const registerLab = async (req, res) => {
    try {
        const { labName, address, email, phone, accreditation, licenseNumber } = req.body;
        if (!labName || !email) {
            return res.status(400).json({ error: "labName and email are required" });
        }
        // generate random password for admin
        const plainPassword = crypto.randomBytes(6).toString("hex"); // e.g. "a1b2c3d4e5f6"
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        // create lab and admin user
        const lab = await db.lab.create({
            data: {
                name: labName,
                address,
                contactEmail: email,
                contactPhone: phone,
                accreditation,
                licenseNumber,
                users: {
                    create: {
                        name: labName + " Admin", // default admin name
                        email,
                        password: hashedPassword,
                        role: "Admin",
                    },
                },
            },
            include: { users: true },
        });
        const adminUser = lab.users[0];
        if (!adminUser)
            throw Error;
        res.status(201).json({
            message: "Lab registered successfully",
            labId: lab.id,
            admin: {
                adminId: adminUser.id,
                email: adminUser.email,
                password: plainPassword, // return plain password only once
            },
        });
    }
    catch (error) {
        console.error("Register Lab Error:", error);
        res.status(500).json({ error: "Failed to register lab" });
    }
};
//# sourceMappingURL=lab.controller.js.map