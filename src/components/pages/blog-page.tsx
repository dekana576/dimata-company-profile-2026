"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar, ChevronLeft, ChevronRight, Search, ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface Category {
  id: number;
  slug: string;
  nameId: string;
  nameEn: string;
  isActive: boolean;
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
  publishedAt: string | null;
  isFeatured: boolean;
  categories: PostCategory[];
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogPage() {
  const { t, locale } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "6" });
      if (selectedCategory) params.set("category", selectedCategory);
      if (searchTerm) params.set("search", searchTerm);

      const res = await fetch(`/api/blog/posts?${params}`);
      const data = await res.json();
      setPosts(data.posts || []);
      setPagination(data.pagination || null);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/blog/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [page, selectedCategory, searchTerm]);

  const categoryName = (cat: Category) => {
    return locale === "id" ? cat.nameId : cat.nameEn;
  };

  const featuredPost = posts.find((p) => p.isFeatured) || posts[0];
  const regularPosts = featuredPost
    ? posts.filter((p) => p.id !== featuredPost.id)
    : posts.slice(1);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPosts();
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            {t("blog.hero.title")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            {t("blog.hero.description")}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <button
            onClick={() => { setSelectedCategory(""); setPage(1); }}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              !selectedCategory
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {t("blog.all")}
          </button>
          {categories
            .filter((c) => c.isActive)
            .map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.slug); setPage(1); }}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === cat.slug
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {categoryName(cat)}
              </button>
            ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-10">
          <div className="relative mx-auto max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("blog.searchPlaceholder")}
              className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </form>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        )}

        {!loading && (
          <>
            {/* Featured Post */}
            {featuredPost && page === 1 && !selectedCategory && (
              <div className="mb-12">
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="group grid overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow hover:shadow-xl md:grid-cols-2"
                >
                  <div className="relative overflow-hidden">
                    {featuredPost.image ? (
                      <img
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105 md:h-full"
                      />
                    ) : (
                      <div className="flex h-64 items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 md:h-full">
                        <span className="text-4xl font-bold text-white/50">DIMATA</span>
                      </div>
                    )}
                    <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white">
                      Featured
                    </span>
                  </div>
                  <div className="flex flex-col justify-center p-8">
                    <div className="mb-3 flex flex-wrap gap-2">
                      {featuredPost.categories?.map((pc) => (
                        <span
                          key={pc.category.id}
                          className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                        >
                          {categoryName(pc.category)}
                        </span>
                      ))}
                    </div>
                    <h2 className="mb-3 text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="mb-4 text-gray-600 line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                    <div className="mt-auto flex items-center gap-3 text-sm text-gray-500">
                      {featuredPost.authorPhoto && (
                        <img
                          src={featuredPost.authorPhoto}
                          alt={featuredPost.authorName}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      )}
                      <span className="font-medium text-gray-700">{featuredPost.authorName}</span>
                      <span className="text-gray-300">•</span>
                      <Calendar className="h-4 w-4" />
                      <span>
                        {featuredPost.publishedAt
                          ? formatDate(featuredPost.publishedAt)
                          : ""}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Post Grid */}
            {regularPosts.length === 0 && posts.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-gray-500">{t("blog.noPosts")}</p>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {(regularPosts.length > 0 ? regularPosts : posts).map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative overflow-hidden">
                      {post.image ? (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-48 items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                          <span className="text-2xl font-bold text-gray-300">DIMATA</span>
                        </div>
                      )}
                      {post.categories && post.categories.length > 0 && (
                        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-blue-700 shadow-sm backdrop-blur-sm">
                          {categoryName(post.categories[0].category)}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="mb-2 text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="mb-4 text-sm text-gray-600 line-clamp-2 flex-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {post.authorPhoto && (
                          <img
                            src={post.authorPhoto}
                            alt={post.authorName}
                            className="h-6 w-6 rounded-full object-cover"
                          />
                        )}
                        <span className="font-medium text-gray-700">{post.authorName}</span>
                        <span className="text-gray-300">•</span>
                        <span>
                          {post.publishedAt
                            ? formatDate(post.publishedAt)
                            : ""}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!pagination.hasPrev}
                  className="flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white"
                >
                  <ChevronLeft className="h-4 w-4" /> {t("blog.prev")}
                </button>
                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  )
                    .filter(
                      (p) =>
                        p === 1 ||
                        p === pagination.totalPages ||
                        Math.abs(p - pagination.page) <= 1
                    )
                    .map((p, i, arr) => (
                      <div key={p} className="flex items-center">
                        {i > 0 && arr[i - 1] !== p - 1 && (
                          <span className="px-1 text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => setPage(p)}
                          className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                            pagination.page === p
                              ? "bg-blue-600 text-white shadow-sm"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {p}
                        </button>
                      </div>
                    ))}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={!pagination.hasNext}
                  className="flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white"
                >
                  {t("blog.next")} <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
