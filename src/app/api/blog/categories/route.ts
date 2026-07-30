import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.blogCategory.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { posts: true } } },
    });
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, nameId, nameEn, sortOrder, isActive } = body;

    if (!slug || !nameId || !nameEn) {
      return NextResponse.json(
        { error: "slug, nameId, and nameEn are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.blogCategory.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "A category with this slug already exists" },
        { status: 400 }
      );
    }

    const category = await prisma.blogCategory.create({
      data: {
        slug,
        nameId,
        nameEn,
        sortOrder: sortOrder || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
