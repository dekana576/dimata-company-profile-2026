import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/**
 * @swagger
 * /api/pricing/bundle-feature/{id}:
 *   put:
 *     tags: [Pricing]
 *     summary: Update a bundle feature
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
 *               labelId:
 *                 type: string
 *               labelEn:
 *                 type: string
 *               sortOrder:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Bundle feature updated
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *   delete:
 *     tags: [Pricing]
 *     summary: Delete a bundle feature
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
 *         description: Bundle feature deleted
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
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
    const { labelId, labelEn, sortOrder } = body;

    const bundleFeature = await prisma.pricingBundleFeature.update({
      where: { id: Number(id) },
      data: {
        ...(labelId !== undefined && { labelId }),
        ...(labelEn !== undefined && { labelEn }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
    });

    return NextResponse.json({ bundleFeature });
  } catch (error) {
    console.error("Error updating bundle feature:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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

    await prisma.pricingBundleFeature.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting bundle feature:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
