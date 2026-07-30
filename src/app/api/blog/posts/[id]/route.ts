import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postId = parseInt(id);

    if (isNaN(postId)) {
      return NextResponse.json(
        { error: "Invalid post ID" },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.findUnique({
      where: { id: postId },
      include: {
        categories: {
          include: { category: true },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postId = parseInt(id);

    if (isNaN(postId)) {
      return NextResponse.json(
        { error: "Invalid post ID" },
        { status: 400 }
      );
    }

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

    const existing = await prisma.blogPost.findUnique({
      where: { id: postId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    if (slug && slug !== existing.slug) {
      const slugExists = await prisma.blogPost.findUnique({ where: { slug } });
      if (slugExists) {
        return NextResponse.json(
          { error: "A post with this slug already exists" },
          { status: 400 }
        );
      }
    }

    let publishedAtValue = existing.publishedAt;
    if (publishedAt !== undefined) {
      publishedAtValue = publishedAt ? new Date(publishedAt) : null;
    } else if (status === "published" && !existing.publishedAt) {
      publishedAtValue = new Date();
    }

    const post = await prisma.$transaction(async (tx) => {
      if (categoryIds !== undefined) {
        await tx.blogPostCategory.deleteMany({ where: { postId } });
        if (categoryIds.length > 0) {
          await tx.blogPostCategory.createMany({
            data: categoryIds.map((categoryId: number) => ({
              postId,
              categoryId,
            })),
          });
        }
      }

      return tx.blogPost.update({
        where: { id: postId },
        data: {
          ...(slug && { slug }),
          ...(title && { title }),
          ...(content && { content }),
          ...(excerpt !== undefined && { excerpt: excerpt || null }),
          ...(image !== undefined && { image: image || null }),
          ...(authorName && { authorName }),
          ...(authorPhoto !== undefined && { authorPhoto: authorPhoto || null }),
          ...(status && { status }),
          ...(publishedAt !== undefined && { publishedAt: publishedAtValue }),
          ...(isFeatured !== undefined && { isFeatured }),
          ...(isActive !== undefined && { isActive }),
          ...(sortOrder !== undefined && { sortOrder }),
        },
        include: {
          categories: {
            include: { category: true },
          },
        },
      });
    });

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error updating post:", error);
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
    const { id } = await params;
    const postId = parseInt(id);

    if (isNaN(postId)) {
      return NextResponse.json(
        { error: "Invalid post ID" },
        { status: 400 }
      );
    }

    const existing = await prisma.blogPost.findUnique({
      where: { id: postId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    await prisma.blogPost.delete({
      where: { id: postId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
