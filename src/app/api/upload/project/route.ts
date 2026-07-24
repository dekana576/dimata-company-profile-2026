import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { saveFile, generateFilename, isImageFile, MAX_SIZE } from "@/lib/upload";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!isImageFile(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, and GIF files are allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File size must be less than 2MB" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = generateFilename(file.name, "projects");
    const path = await saveFile(buffer, filename, "projects");

    return NextResponse.json({
      filename,
      originalName: file.name,
      path,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
