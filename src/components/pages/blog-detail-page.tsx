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
    <div className='min-h-screen'>
      {/* Simplified Breadcrumb */}
      <div className='mx-auto max-w-4xl px-4 pt-8'>
        <nav className='mb-6 flex items-center gap-2 text-sm text-gray-500'>
          <Link href='/' className='hover:text-blue-600 transition-colors'>
            Home
          </Link>
          <span>/</span>
          <Link href='/blog' className='hover:text-blue-600 transition-colors'>
            Blog
          </Link>
          <span>/</span>
          <span className='text-gray-900 truncate max-w-[200px]'>
            {post.title}
          </span>
        </nav>

        <Link
          href='/blog'
          className='mb-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors'
        >
          <ArrowLeft className='h-4 w-4' /> Back to Blog
        </Link>
      </div>

      {/* Content */}
      <article className='mx-auto max-w-4xl px-4 py-10'>
        {/* Meta Header */}
        <div className='mb-8'>
          <div className='mb-4 flex flex-wrap items-center gap-3'>
            {post.categories?.map((pc) => (
              <span
                key={pc.category.id}
                className='rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700'
              >
                {pc.category.nameId}
              </span>
            ))}
            <span className='flex items-center gap-1 text-xs text-gray-500'>
              <Clock className='h-3.5 w-3.5' />
              {formatReadingTime(post.content)}
            </span>
          </div>

          <h1 className='text-3xl font-bold text-gray-900 sm:text-4xl leading-tight'>
            {post.title}
          </h1>

          <div className='mt-6 flex flex-wrap items-center gap-6 border-b border-gray-100 pb-6'>
            <div className='flex items-center gap-3'>
              {post.authorPhoto ? (
                <img
                  src={post.authorPhoto}
                  alt={post.authorName}
                  className='h-10 w-10 rounded-full object-cover ring-2 ring-gray-100'
                />
              ) : (
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
                  <User className='h-5 w-5 text-blue-600' />
                </div>
              )}
              <div>
                <p className='text-sm font-medium text-gray-900'>
                  {post.authorName}
                </p>
                <p className='text-xs text-gray-500'>Author</p>
              </div>
            </div>
            <div className='flex items-center gap-2 text-sm text-gray-500'>
              <Calendar className='h-4 w-4' />
              {post.publishedAt ? formatDate(post.publishedAt) : "Draft"}
            </div>
            <button
              onClick={handleShare}
              className='ml-auto inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors'
            >
              <Share2 className='h-4 w-4' /> Share
            </button>
          </div>
        </div>

        {/* Cover Image */}
        {post.image && (
          <div className='mx-auto max-w-5xl px-4 mb-8'>
            <div className='overflow-hidden rounded-2xl shadow-lg'>
              <img
                src={post.image}
                alt={post.title}
                className='w-full h-[400px] object-cover'
              />
            </div>
          </div>
        )}

        {/* Content Body */}
        <div
          className='prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-img:rounded-xl prose-img:shadow-md prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-strong:text-gray-900'
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}
