import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

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

export async function POST(request: Request) {
  const user = await getCurrentUser();
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
