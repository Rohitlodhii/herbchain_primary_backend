import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import db from "../../../../database/prisma.database.js";
import { DocumentType } from "@prisma/client";


export const PersonalProfileInformation = async (req: Request, res: Response) => {
  try {
    const { fullName, dob, address, password } = req.body;

    // ✅ validation
    if (!fullName || !dob || !address || !password) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    // ✅ check if user is authenticated (from authMiddleware)
    if (!req.user || !req.user.farmerId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // ✅ hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ update farmer record
    const updatedFarmer = await db.farmer.update({
      where: { id: req.user.farmerId },
      data: {
        fullName,
        dob: new Date(dob), 
        address,
        password: hashedPassword,
      },
    });

    res.status(200).json({
      message: "Profile updated successfully",
      farmer: {
        id: updatedFarmer.id,
        fullName: updatedFarmer.fullName,
        dob: updatedFarmer.dob,
        address: updatedFarmer.address,
        mobileNumber: updatedFarmer.mobileNumber,
      },
    });
  } catch (error: any) {
    console.error("Error updating profile:", error);

    if (error.code === "P2025") {
      // Prisma: record not found
      return res.status(404).json({ error: "Farmer not found" });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
};




export const LandInformation = async (req: Request, res: Response) => {
    try {
      const { totalHectare, khasraNumber, coordinates } = req.body;
  
      // ✅ validate input
      if (!totalHectare || !khasraNumber || !coordinates || !Array.isArray(coordinates)) {
        return res.status(400).json({
          error: "totalHectare, khasraNumber and coordinates[] are required",
        });
      }
  
      if (!req.user || !req.user.farmerId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
  
      const farmerId = req.user.farmerId;
  
      // ✅ ensure all coordinates are valid numbers
      const validCoordinates = coordinates.map((c: any) => ({
        lat: parseFloat(c.lat),
        lng: parseFloat(c.lng),
      }));
  
      // ✅ store as GeoJSON Polygon (if multiple points) or just keep array
      const geoJson = {
        type: "Polygon",
        coordinates: [
          validCoordinates.map((c) => [c.lng, c.lat]), // GeoJSON uses [lng, lat]
        ],
      };
  
      // ✅ upsert LandInfo
      const landInfo = await db.landInfo.upsert({
        where: { farmerId },
        update: {
          totalHectare: parseFloat(totalHectare),
          khasraNumber,
          coordinates: geoJson, // stored as JSON in DB
        },
        create: {
          farmerId,
          totalHectare: parseFloat(totalHectare),
          khasraNumber,
          coordinates: geoJson,
        },
      });
  
      res.status(200).json({
        message: "Land information saved successfully",
        landInfo,
      });
    } catch (error) {
      console.error("Error saving land info:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };




  export const DocumentInformation = async (req: Request, res: Response) => {
    try {
      if (!req.user || !req.user.farmerId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
  
      const { type, url } = req.body;
  
      if (!type || !url) {
        return res.status(400).json({
          error: "Document type and URL are required",
        });
      }
  
      if (!Object.values(DocumentType).includes(type)) {
        return res.status(400).json({
          error: `Invalid document type. Must be one of: ${Object.values(DocumentType).join(", ")}`,
        });
      }
  
      const farmerId = req.user.farmerId;
  
      // ✅ Create document (since multiple docs per farmer are allowed)
      const document = await db.document.create({
        data: {
          type,
          url,
          farmerId,
        },
      });
  
      return res.status(201).json({
        message: "Document uploaded successfully",
        document,
      });
    } catch (error) {
      console.error("Error uploading document:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
  

  
  export const CropInformation = async (req: Request, res: Response) => {
    try {
      if (!req.user || !req.user.farmerId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
  
      const { name } = req.body;
  
      if (!name) {
        return res.status(400).json({ error: "Crop name is required" });
      }
  
      const farmerId = req.user.farmerId;
  
      // ✅ Create a new crop
      const crop = await db.crop.create({
        data: {
          name,
          farmerId,
        },
      });
  
      res.status(201).json({
        message: "Crop added successfully",
        crop,
      });
    } catch (error) {
      console.error("Error adding crop:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };