"use client";

import Link from "next/link";
import { Calendar, User, ArrowLeft, Clock, Share2 } from "lucide-react";

interface Category {
  id: number;
  slug: string;
  nameId: string;
  nameEn: string;
}

interface PostCategory {
  category: Category;
}

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  image: string | null;
  authorName: string;
  authorPhoto: string | null;
  status: string;
  publishedAt: Date | null;
  isFeatured: boolean;
  isActive: boolean;
  categories: PostCategory[];
  createdAt: Date;
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatReadingTime(content: string) {
  const words = content.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export function BlogDetailPage({ post }: { post: BlogPost }) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Simplified Breadcrumb */}
      <div className='mx-auto max-w-4xl px-4 pt-8'>
        <nav className='mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
          <Link href='/' className='hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
            Home
          </Link>
          <span>/</span>
          <Link href='/blog' className='hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
            Blog
          </Link>
          <span>/</span>
          <span className='text-gray-900 dark:text-gray-100 truncate max-w-[200px]'>
            {post.title}
          </span>
        </nav>

        <Link
          href='/blog'
          className='mb-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors'
        >
          <ArrowLeft className='h-4 w-4' /> Back to Blog
        </Link>
      </div>

      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Category tags */}
        {post.categories?.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-2">
            {post.categories.map((pc) => (
              <span
                key={pc.category.id}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium tracking-wide text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
              >
                {pc.category.nameId}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
          {post.title}
        </h1>

        {/* Meta row */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-6 dark:border-gray-800">
          <div className="flex items-center gap-3">
            {post.authorPhoto ? (
              <img
                src={post.authorPhoto}
                alt={post.authorName}
                className="h-10 w-10 rounded-full object-cover ring-1 ring-gray-100 dark:ring-gray-800"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-500/10">
                <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            )}
            <div className="leading-tight">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{post.authorName}</p>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {post.publishedAt ? formatDate(post.publishedAt) : "Draft"}
                </span>
                <span className="text-gray-300 dark:text-gray-700">•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatReadingTime(post.content)}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-800 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>

        {/* Cover image — same max-width as text column, subtle glow ring for a bit of pop */}
        {post.image && (
          <div className="mt-8 overflow-hidden rounded-2xl shadow-sm ring-1 ring-gray-900/5 dark:shadow-none dark:ring-white/10">
            <img
              src={post.image}
              alt={post.title}
              className="aspect-[16/9] w-full object-cover"
            />
          </div>
        )}

        {/* Body */}
        <div
          className="prose prose-gray dark:prose-invert mt-10 max-w-none prose-headings:font-semibold prose-headings:text-gray-900 dark:prose-headings:text-gray-50 prose-p:leading-relaxed prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline dark:prose-a:text-blue-400 prose-img:rounded-xl prose-img:shadow-sm dark:prose-img:shadow-none prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50/60 prose-blockquote:px-4 prose-blockquote:py-1 prose-blockquote:not-italic dark:prose-blockquote:border-blue-400 dark:prose-blockquote:bg-blue-500/10 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-code:text-gray-800 dark:prose-code:text-gray-200 prose-hr:border-gray-100 dark:prose-hr:border-gray-800"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}
