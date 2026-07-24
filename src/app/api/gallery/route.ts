import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/**
 * @swagger
 * /api/gallery:
 *   get:
 *     tags: [Gallery]
 *     summary: List gallery images
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: string
 *           enum: ["true"]
 *         description: If "true", return only active images
 *     responses:
 *       200:
 *         description: List of gallery images
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 images:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/GalleryImage"
 */
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

/**
 * @swagger
 * /api/gallery:
 *   post:
 *     tags: [Gallery]
 *     summary: Create a gallery image
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [filename, originalName, path]
 *             properties:
 *               filename:
 *                 type: string
 *               originalName:
 *                 type: string
 *               path:
 *                 type: string
 *               description:
 *                 type: string
 *               sortOrder:
 *                 type: number
 *     responses:
 *       201:
 *         description: Image created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 image:
 *                   $ref: "#/components/schemas/GalleryImage"
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
export async function POST(request: Request) {
  const user = await getCurrentUser(request);
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
