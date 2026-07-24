import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * @swagger
 * /api/events:
 *   get:
 *     tags: [Events]
 *     summary: List all events
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter events by status
 *       - in: query
 *         name: active
 *         schema:
 *           type: string
 *           enum: ["true"]
 *         description: Filter active events only
 *     responses:
 *       200:
 *         description: List of events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const active = searchParams.get("active");

    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status;
    }

    if (active === "true") {
      where.isActive = true;
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/events:
 *   post:
 *     tags: [Events]
 *     summary: Create a new event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - slug
 *               - description
 *               - startDate
 *               - endDate
 *             properties:
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               description:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *               location:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               category:
 *                 type: string
 *               status:
 *                 type: string
 *                 default: upcoming
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Event created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 event:
 *                   $ref: '#/components/schemas/Event'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, description, content, image, location, startDate, endDate, category, status, isActive } = body;

    if (!title || !slug || !description || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Title, slug, description, startDate, and endDate are required" },
        { status: 400 }
      );
    }

    const existingEvent = await prisma.event.findUnique({ where: { slug } });
    if (existingEvent) {
      return NextResponse.json(
        { error: "An event with this slug already exists" },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title,
        slug,
        description,
        content: content || null,
        image: image || null,
        location: location || null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        category: category || null,
        status: status || "upcoming",
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
