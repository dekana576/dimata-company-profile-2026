import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/**
 * @swagger
 * /api/project:
 *   get:
 *     tags: [Project]
 *     summary: Get all projects
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: string
 *         description: Filter active projects ("true")
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by project category
 *     responses:
 *       200:
 *         description: List of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 projects:
 *                   type: array
 *                   items:
 *                     type: object
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
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get("active");
    const category = searchParams.get("category");

    const where: Record<string, unknown> = {};

    if (active === "true") {
      where.isActive = true;
    }

    if (category) {
      where.category = category;
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/project:
 *   post:
 *     tags: [Project]
 *     summary: Create a new project
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [slug, titleId, titleEn, descriptionId, descriptionEn, category]
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
 *       201:
 *         description: Project created
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
export async function POST(request: Request) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      slug, titleId, titleEn, descriptionId, descriptionEn,
      client, category, technologies, image, status,
      startDate, endDate, externalUrl, sortOrder, isActive,
    } = body;

    if (!slug || !titleId || !titleEn || !descriptionId || !descriptionEn || !category) {
      return NextResponse.json(
        { error: "Slug, titleId, titleEn, descriptionId, descriptionEn, and category are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.project.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "A project with this slug already exists" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        slug,
        titleId,
        titleEn,
        descriptionId,
        descriptionEn,
        client: client || null,
        category,
        technologies: technologies || "",
        image: image || null,
        status: status || "completed",
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        externalUrl: externalUrl || null,
        sortOrder: sortOrder || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
