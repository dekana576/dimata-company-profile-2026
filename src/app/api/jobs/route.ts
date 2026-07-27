import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get("departmentId");
    const active = searchParams.get("active");

    const where: Record<string, unknown> = {};

    if (departmentId) {
      where.departmentId = parseInt(departmentId);
    }

    if (active === "true") {
      where.isActive = true;
    }

    const jobs = await prisma.job.findMany({
      where,
      include: { department: true },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      slug,
      titleId,
      titleEn,
      departmentId,
      location,
      type,
      summaryId,
      summaryEn,
      responsibilitiesId,
      responsibilitiesEn,
      requirementsId,
      requirementsEn,
      applyUrl,
      sortOrder,
      isActive,
    } = body;

    if (!slug || !titleId || !titleEn || !departmentId || !location || !summaryId || !summaryEn || !responsibilitiesId || !responsibilitiesEn || !requirementsId || !requirementsEn) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.job.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "A job with this slug already exists" },
        { status: 400 }
      );
    }

    const job = await prisma.job.create({
      data: {
        slug,
        titleId,
        titleEn,
        departmentId,
        location,
        type: type || "Full-time",
        summaryId,
        summaryEn,
        responsibilitiesId: JSON.stringify(responsibilitiesId),
        responsibilitiesEn: JSON.stringify(responsibilitiesEn),
        requirementsId: JSON.stringify(requirementsId),
        requirementsEn: JSON.stringify(requirementsEn),
        applyUrl: applyUrl || null,
        sortOrder: sortOrder || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
      include: { department: true },
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
