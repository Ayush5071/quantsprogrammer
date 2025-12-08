
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { getDataFromToken } from "@/helpers/getToken";
import { v2 as cloudinary } from "cloudinary";

connect();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST - Update profile photo (base64)
export async function POST(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    console.log("[ProfilePhotoAPI] userId:", userId);
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { profilePhoto } = await request.json();
    console.log("[ProfilePhotoAPI] profilePhoto type:", typeof profilePhoto, "length:", profilePhoto?.length);
    if (profilePhoto) {
      console.log("[ProfilePhotoAPI] profilePhoto (first 100 chars):", profilePhoto.slice(0, 100));
    }

    if (!profilePhoto) {
      return NextResponse.json({ error: "Profile photo is required" }, { status: 400 });
    }

    // Validate base64 image (should start with data:image)
    if (!profilePhoto.startsWith('data:image')) {
      return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
    }

    // Check size (limit to ~2MB base64 which is ~1.5MB image)
    if (profilePhoto.length > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "Image too large. Max 1.5MB" }, { status: 400 });
    }

    // Upload to Cloudinary
    const uploadRes = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        profilePhoto,
        {
          folder: "profile_photos",
          resource_type: "image",
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    // @ts-ignore
    const url = uploadRes.secure_url;
    // @ts-ignore
    const publicId = uploadRes.public_id;

    await User.findByIdAndUpdate(userId, { profilePhoto: url });

    return NextResponse.json({
      success: true,
      message: "Profile photo updated successfully",
      url,
      publicId,
    });
  } catch (error: any) {
    console.error("[ProfilePhotoAPI] Error updating profile photo:", error);
    return NextResponse.json({ error: "Failed to update photo" }, { status: 500 });
  }
}

// DELETE - Remove profile photo
export async function DELETE(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await User.findByIdAndUpdate(userId, { $unset: { profilePhoto: 1 } });

    return NextResponse.json({ 
      success: true, 
      message: "Profile photo removed" 
    });
  } catch (error: any) {
    console.error("Error removing profile photo:", error);
    return NextResponse.json({ error: "Failed to remove photo" }, { status: 500 });
  }
}
