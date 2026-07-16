import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
