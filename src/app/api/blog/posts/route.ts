import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const active = searchParams.get("active");
    const featured = searchParams.get("featured");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "6")));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status;
    }

    if (active === "true") {
      where.isActive = true;
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    if (category) {
      where.categories = {
        some: {
          category: { slug: category },
        },
      };
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: {
          categories: {
            include: { category: true },
          },
        },
        orderBy: [
          { isFeatured: "desc" },
          { publishedAt: "desc" },
          { createdAt: "desc" },
        ],
        skip,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
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
      title,
      content,
      excerpt,
      image,
      authorName,
      authorPhoto,
      status,
      publishedAt,
      isFeatured,
      isActive,
      sortOrder,
      categoryIds,
    } = body;

    if (!slug || !title || !content) {
      return NextResponse.json(
        { error: "slug, title, and content are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.create({
      data: {
        slug,
        title,
        content,
        excerpt: excerpt || null,
        image: image || null,
        authorName: authorName || "DIMATA",
        authorPhoto: authorPhoto || null,
        status: status || "draft",
        publishedAt: publishedAt ? new Date(publishedAt) : status === "published" ? new Date() : null,
        isFeatured: isFeatured || false,
        isActive: isActive !== undefined ? isActive : true,
        sortOrder: sortOrder || 0,
        categories: categoryIds?.length
          ? {
              create: categoryIds.map((categoryId: number) => ({
                categoryId,
              })),
            }
          : undefined,
      },
      include: {
        categories: {
          include: { category: true },
        },
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
