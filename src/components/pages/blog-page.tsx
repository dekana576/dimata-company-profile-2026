"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Calendar, ChevronLeft, ChevronRight, Search, ArrowRight, RefreshCw,
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

function PostCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="aspect-[16/10] w-full animate-pulse bg-gray-100 dark:bg-gray-800" />
      <div className="flex flex-col gap-3 p-5">
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
        <div className="h-3 w-full animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
        <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
      </div>
    </div>
  );
}

export function BlogPage() {
  const { t, locale } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const abortRef = useRef<AbortController | null>(null);

  const fetchPosts = async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(false);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "6" });
      if (selectedCategory) params.set("category", selectedCategory);
      if (searchTerm) params.set("search", searchTerm);

      const res = await fetch(`/api/blog/posts?${params}`, { signal: controller.signal });
      const data = await res.json();
      setPosts(data.posts || []);
      setPagination(data.pagination || null);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      console.error("Error fetching posts:", err);
      setError(true);
    } finally {
      if (abortRef.current === controller) setLoading(false);
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
    return () => abortRef.current?.abort();
  }, [page, selectedCategory, searchTerm]);

  // Debounce free typing in the search box; Enter/submit skips the wait.
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== searchTerm) {
        setPage(1);
        setSearchTerm(searchInput);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const categoryName = (cat: Category) => {
    return locale === "id" ? cat.nameId : cat.nameEn;
  };

  const featuredPost = posts.find((p) => p.isFeatured);
  const regularPosts = featuredPost
    ? posts.filter((p) => p.id !== featuredPost.id)
    : posts;
  const showFeatured = Boolean(featuredPost) && page === 1 && !selectedCategory;
  const gridPosts = showFeatured ? regularPosts : posts;
  const isInitialLoad = loading && posts.length === 0 && !error;
  const isRefetching = loading && posts.length > 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearchTerm(searchInput);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-700 to-indigo-900 py-24 dark:from-blue-950 dark:via-blue-900 dark:to-indigo-950">
        {/* Ambient glow accents */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10" />
        <div className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-500/10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />

        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {t("blog.hero.title")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100/90 dark:text-blue-200/80">
            {t("blog.hero.description")}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Filter + Search — combined into one tidy control row */}
        <div className="mb-12 flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:shadow-none sm:flex-row sm:items-center sm:justify-between">
          <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden">
            <button
              onClick={() => { setSelectedCategory(""); setPage(1); }}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                !selectedCategory
                  ? "bg-blue-600 text-white shadow-sm dark:bg-blue-500"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
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
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selectedCategory === cat.slug
                      ? "bg-blue-600 text-white shadow-sm dark:bg-blue-500"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  {categoryName(cat)}
                </button>
              ))}
          </div>

          <form onSubmit={handleSearch} className="sm:w-72">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t("blog.searchPlaceholder")}
                className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-4 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-blue-400 dark:focus:bg-gray-800 dark:focus:ring-blue-400/20"
              />
            </div>
          </form>
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center dark:border-gray-800 dark:bg-gray-900">
            <p className="text-gray-600 dark:text-gray-400">{t("blog.errorLoading")}</p>
            <button
              onClick={() => fetchPosts()}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <RefreshCw className="h-4 w-4" />
              {t("blog.retry")}
            </button>
          </div>
        )}

        {/* Initial loading — skeleton grid */}
        {isInitialLoad && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!error && !isInitialLoad && (
          <div className={isRefetching ? "pointer-events-none opacity-50 transition-opacity" : "transition-opacity"}>
            {/* Featured Post */}
            {showFeatured && (
              <div className="mb-14">
                <Link
                  href={`/blog/${featuredPost!.slug}`}
                  className="group grid overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition-shadow hover:shadow-xl dark:border-gray-800 dark:bg-gray-900 dark:shadow-none dark:hover:shadow-none dark:hover:border-gray-700 md:grid-cols-2"
                >
                  <div className="relative overflow-hidden">
                    {featuredPost!.image ? (
                      <img
                        src={featuredPost!.image}
                        alt={featuredPost!.title}
                        className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105 md:h-full"
                      />
                    ) : (
                      <div className="flex h-64 items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-800 dark:to-indigo-900 md:h-full">
                        <span className="text-4xl font-bold text-white/50">DIMATA</span>
                      </div>
                    )}
                    <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white shadow-sm dark:bg-blue-500">
                      {t("blog.featured")}
                    </span>
                  </div>
                  <div className="flex flex-col justify-center p-8">
                    <div className="mb-3 flex flex-wrap gap-2">
                      {featuredPost!.categories?.map((pc) => (
                        <span
                          key={pc.category.id}
                          className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
                        >
                          {categoryName(pc.category)}
                        </span>
                      ))}
                    </div>
                    <h2 className="mb-3 text-2xl font-bold leading-snug text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-50 dark:group-hover:text-blue-400">
                      {featuredPost!.title}
                    </h2>
                    <p className="mb-5 line-clamp-3 text-gray-600 dark:text-gray-400">
                      {featuredPost!.excerpt}
                    </p>
                    <div className="mt-auto flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                      {featuredPost!.authorPhoto && (
                        <img
                          src={featuredPost!.authorPhoto}
                          alt={featuredPost!.authorName}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      )}
                      <span className="font-medium text-gray-700 dark:text-gray-300">{featuredPost!.authorName}</span>
                      <span className="text-gray-300 dark:text-gray-700">•</span>
                      <Calendar className="h-4 w-4" />
                      <span>
                        {featuredPost!.publishedAt
                          ? formatDate(featuredPost!.publishedAt)
                          : ""}
                      </span>
                      <ArrowRight className="ml-auto h-4 w-4 text-blue-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-blue-400" />
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Post Grid */}
            {gridPosts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-24 text-center dark:border-gray-800 dark:bg-gray-900">
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm
                    ? t("blog.noSearchResults").replace("{query}", searchTerm)
                    : t("blog.noPosts")}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {gridPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:shadow-none dark:hover:border-gray-700 dark:hover:shadow-none"
                  >
                    <div className="relative overflow-hidden">
                      {post.image ? (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                          <span className="text-2xl font-bold text-gray-300 dark:text-gray-700">DIMATA</span>
                        </div>
                      )}
                      {post.categories && post.categories.length > 0 && (
                        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-blue-700 shadow-sm backdrop-blur-sm dark:bg-gray-900/90 dark:text-blue-300">
                          {categoryName(post.categories[0].category)}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="mb-2 line-clamp-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-50 dark:group-hover:text-blue-400">
                        {post.title}
                      </h3>
                      <p className="mb-4 line-clamp-2 flex-1 text-sm text-gray-600 dark:text-gray-400">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-2 border-t border-gray-50 pt-3 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
                        {post.authorPhoto && (
                          <img
                            src={post.authorPhoto}
                            alt={post.authorName}
                            className="h-6 w-6 rounded-full object-cover"
                          />
                        )}
                        <span className="font-medium text-gray-700 dark:text-gray-300">{post.authorName}</span>
                        <span className="text-gray-300 dark:text-gray-700">•</span>
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
              <div className="mt-14 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!pagination.hasPrev}
                  className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:disabled:hover:bg-gray-900"
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
                          <span className="px-1 text-gray-400 dark:text-gray-600">...</span>
                        )}
                        <button
                          onClick={() => setPage(p)}
                          className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                            pagination.page === p
                              ? "bg-blue-600 text-white shadow-sm dark:bg-blue-500"
                              : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
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
                  className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:disabled:hover:bg-gray-900"
                >
                  {t("blog.next")} <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
