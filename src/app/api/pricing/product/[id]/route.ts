import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/**
 * @swagger
 * /api/pricing/product/{id}:
 *   delete:
 *     tags: [Pricing]
 *     summary: Delete a pricing product
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
 *         description: Product deleted
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *   put:
 *     tags: [Pricing]
 *     summary: Update a pricing product
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
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               icon:
 *                 type: string
 *               iconDark:
 *                 type: string
 *               descriptionId:
 *                 type: string
 *               descriptionEn:
 *                 type: string
 *               sortOrder:
 *                 type: integer
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Product updated
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.pricingProduct.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting pricing product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { icon, iconDark, descriptionId, descriptionEn, sortOrder, isActive } =
      body;

    const product = await prisma.pricingProduct.update({
      where: { id: Number(id) },
      data: {
        ...(icon !== undefined && { icon }),
        ...(iconDark !== undefined && { iconDark }),
        ...(descriptionId !== undefined && { descriptionId }),
        ...(descriptionEn !== undefined && { descriptionEn }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Error updating pricing product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
