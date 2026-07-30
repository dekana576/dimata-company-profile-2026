import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { BlogDetailPage } from "@/components/pages/blog-detail-page";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug, isActive: true },
    include: {
      categories: { include: { category: true } },
    },
  });

  if (!post) {
    return { title: "Post Not Found | DIMATA IT Solutions" };
  }

  return {
    title: `${post.title} | DIMATA IT Solutions`,
    description: post.excerpt || post.title,
    openGraph: {
      title: `${post.title} | DIMATA Blog`,
      description: post.excerpt || post.title,
      ...(post.image && { images: [{ url: post.image }] }),
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.authorName],
    },
  };
}

export default async function BlogDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug, isActive: true },
    include: {
      categories: {
        include: { category: true },
      },
    },
  });

  if (!post) {
    notFound();
  }

  return <BlogDetailPage post={post} />;
}
