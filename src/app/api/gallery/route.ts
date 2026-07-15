import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const activeOnly = url.searchParams.get("active") === "true";

    const where = activeOnly ? { isActive: true } : {};

    const images = await prisma.galleryImage.findMany({
      where,
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Gallery fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { filename, originalName, path, description, sortOrder } =
      await request.json();

    if (!filename || !originalName || !path) {
      return NextResponse.json(
        { error: "Filename, originalName, and path are required" },
        { status: 400 }
      );
    }

    const image = await prisma.galleryImage.create({
      data: {
        filename,
        originalName,
        path,
        description: description || null,
        sortOrder: sortOrder ?? 0,
      },
    });

    return NextResponse.json({ image }, { status: 201 });
  } catch (error) {
    console.error("Gallery create error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
