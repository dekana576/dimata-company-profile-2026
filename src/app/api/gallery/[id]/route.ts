import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { unlink } from "fs/promises";
import { join } from "path";

/**
 * @swagger
 * /api/gallery/{id}:
 *   get:
 *     tags: [Gallery]
 *     summary: Get a gallery image by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Gallery image found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 image:
 *                   $ref: "#/components/schemas/GalleryImage"
 *       404:
 *         description: Image not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const image = await prisma.galleryImage.findUnique({
      where: { id: parseInt(id) },
    });

    if (!image) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ image });
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
 * /api/gallery/{id}:
 *   put:
 *     tags: [Gallery]
 *     summary: Update a gallery image
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               sortOrder:
 *                 type: number
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Image updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 image:
 *                   $ref: "#/components/schemas/GalleryImage"
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
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { description, sortOrder, isActive } = await request.json();

    const image = await prisma.galleryImage.update({
      where: { id: parseInt(id) },
      data: {
        ...(description !== undefined && { description }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({ image });
  } catch (error) {
    console.error("Gallery update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/gallery/{id}:
 *   delete:
 *     tags: [Gallery]
 *     summary: Delete a gallery image
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Image deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 *       404:
 *         description: Image not found
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
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const image = await prisma.galleryImage.findUnique({
      where: { id: parseInt(id) },
    });

    if (!image) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Delete file from disk
    const filePath = join(process.cwd(), "public", image.path);
    try {
      await unlink(filePath);
    } catch {
      // File might not exist, continue anyway
    }

    // Delete from database
    await prisma.galleryImage.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Gallery delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
