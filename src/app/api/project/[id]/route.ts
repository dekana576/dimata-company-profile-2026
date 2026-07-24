import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/**
 * @swagger
 * /api/project/{id}:
 *   put:
 *     tags: [Project]
 *     summary: Update a project
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               slug:
 *                 type: string
 *               titleId:
 *                 type: string
 *               titleEn:
 *                 type: string
 *               descriptionId:
 *                 type: string
 *               descriptionEn:
 *                 type: string
 *               client:
 *                 type: string
 *               category:
 *                 type: string
 *               technologies:
 *                 type: string
 *               image:
 *                 type: string
 *               status:
 *                 type: string
 *               startDate:
 *                 type: string
 *               endDate:
 *                 type: string
 *               externalUrl:
 *                 type: string
 *               sortOrder:
 *                 type: number
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Project updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 project:
 *                   type: object
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
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
    const projectId = parseInt(id);

    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      slug, titleId, titleEn, descriptionId, descriptionEn,
      client, category, technologies, image, status,
      startDate, endDate, externalUrl, sortOrder, isActive,
    } = body;

    const existing = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    if (slug && slug !== existing.slug) {
      const slugExists = await prisma.project.findUnique({ where: { slug } });
      if (slugExists) {
        return NextResponse.json(
          { error: "A project with this slug already exists" },
          { status: 400 }
        );
      }
    }

    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        ...(slug && { slug }),
        ...(titleId && { titleId }),
        ...(titleEn && { titleEn }),
        ...(descriptionId && { descriptionId }),
        ...(descriptionEn && { descriptionEn }),
        ...(client !== undefined && { client: client || null }),
        ...(category && { category }),
        ...(technologies !== undefined && { technologies }),
        ...(image !== undefined && { image: image || null }),
        ...(status && { status }),
        ...(startDate !== undefined && { startDate: startDate ? new Date(startDate) : null }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
        ...(externalUrl !== undefined && { externalUrl: externalUrl || null }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/project/{id}:
 *   delete:
 *     tags: [Project]
 *     summary: Delete a project
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
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
    const projectId = parseInt(id);

    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
