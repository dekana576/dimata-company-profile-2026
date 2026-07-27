import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ departments });
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nameId, nameEn, sortOrder, isActive } = body;

    if (!nameId || !nameEn) {
      return NextResponse.json(
        { error: "nameId and nameEn are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.department.findUnique({ where: { nameId } });
    if (existing) {
      return NextResponse.json(
        { error: "A department with this name already exists" },
        { status: 400 }
      );
    }

    const department = await prisma.department.create({
      data: {
        nameId,
        nameEn,
        sortOrder: sortOrder || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({ department }, { status: 201 });
  } catch (error) {
    console.error("Error creating department:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
