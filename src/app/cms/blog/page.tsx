"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Pencil, Trash2, X, Search, FileText,
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  Eye, Clock, CheckCircle,
} from "lucide-react";

interface CategoryItem {
  id: number;
  slug: string;
  nameId: string;
  nameEn: string;
}

interface PostCategory {
  category: CategoryItem;
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
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  categories: PostCategory[];
}

type SortKey = keyof BlogPost;

function SortIcon({ col, sortConfig }: { col: SortKey; sortConfig: { key: SortKey; direction: "asc" | "desc" } }) {
  if (sortConfig.key !== col) return null;
  return sortConfig.direction === "asc"
    ? <ChevronUp className="inline h-4 w-4" />
    : <ChevronDown className="inline h-4 w-4" />;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

export default function CmsBlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterActive, setFilterActive] = useState("all");
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: "asc" | "desc" }>({
    key: "createdAt", direction: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/blog/posts?limit=100");
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const processedPosts = useMemo(() => {
    let result = [...posts];

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter((p) =>
        p.title.toLowerCase().includes(lower) ||
        p.slug.toLowerCase().includes(lower) ||
        p.authorName.toLowerCase().includes(lower)
      );
    }

    if (filterStatus !== "all") {
      result = result.filter((p) => p.status === filterStatus);
    }

    if (filterActive !== "all") {
      result = result.filter((p) => String(p.isActive) === filterActive);
    }

    result.sort((a, b) => {
      const valA = a[sortConfig.key] ?? "";
      const valB = b[sortConfig.key] ?? "";
      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [posts, searchTerm, filterStatus, filterActive, sortConfig]);

  const totalPages = Math.ceil(processedPosts.length / itemsPerPage);
  const paginatedPosts = processedPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key: SortKey) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/blog/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published": return { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle };
      case "draft": return { bg: "bg-yellow-100", text: "text-yellow-800", icon: Clock };
      default: return { bg: "bg-gray-100", text: "text-gray-800", icon: Eye };
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="mt-1 text-sm text-gray-500">Manage blog articles and news</p>
        </div>
        <button
          onClick={() => router.push("/cms/blog/create")}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> New Post
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <select
          value={filterActive}
          onChange={(e) => { setFilterActive(e.target.value); setCurrentPage(1); }}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="all">All Visibility</option>
          <option value="true">Active Only</option>
          <option value="false">Inactive Only</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full whitespace-nowrap">
          <thead className="bg-gray-50">
            <tr>
              <th className="cursor-pointer px-4 py-3 text-left text-sm font-medium text-gray-600 hover:bg-gray-100" onClick={() => handleSort("title")}>
                <div className="flex items-center gap-1">Title {sortConfig.key === "title" && (sortConfig.direction === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}</div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Categories</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Author</th>
              <th className="cursor-pointer px-4 py-3 text-left text-sm font-medium text-gray-600 hover:bg-gray-100" onClick={() => handleSort("status")}>
                <div className="flex items-center gap-1">Status {sortConfig.key === "status" && (sortConfig.direction === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}</div>
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Featured</th>
              <th className="cursor-pointer px-4 py-3 text-center text-sm font-medium text-gray-600 hover:bg-gray-100" onClick={() => handleSort("publishedAt")}>
                <div className="flex items-center justify-center gap-1">Published {sortConfig.key === "publishedAt" && (sortConfig.direction === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}</div>
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Active</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">Loading...</td>
              </tr>
            ) : paginatedPosts.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">No posts found.</td>
              </tr>
            ) : (
              paginatedPosts.map((post) => {
                const statusBadge = getStatusBadge(post.status);
                const StatusIcon = statusBadge.icon;
                return (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {post.image ? (
                          <img src={post.image} alt={post.title} className="h-10 w-10 rounded object-cover" />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-gray-100"><FileText className="h-5 w-5 text-gray-400" /></div>
                        )}
                        <div className="max-w-[250px] truncate md:max-w-[400px]">
                          <div className="truncate font-medium text-gray-900" title={post.title}>{post.title}</div>
                          <div className="text-xs text-gray-400">{post.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {post.categories?.slice(0, 2).map((pc) => (
                          <span key={pc.category.id} className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">{pc.category.nameId}</span>
                        ))}
                        {post.categories?.length > 2 && (
                          <span className="text-xs text-gray-400">+{post.categories.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{post.authorName}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                        <StatusIcon className="h-3 w-3" /> {post.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {post.isFeatured ? (
                        <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">Featured</span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">
                      {post.publishedAt ? formatDate(post.publishedAt) : <span className="text-xs text-gray-400">Not set</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${post.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {post.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/cms/blog/${post.id}/edit`)}
                          className="rounded p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          title="Edit Post"
                        ><Pencil className="h-4 w-4" /></button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete Post"
                        ><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Show</span>
          <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="rounded border border-gray-300 bg-white px-2 py-1 focus:border-blue-500 focus:outline-none">
            <option value={5}>5</option><option value={10}>10</option><option value={20}>20</option><option value={50}>50</option>
          </select>
          <span>entries</span>
          <span className="ml-4">
            Showing {paginatedPosts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, processedPosts.length)} of {processedPosts.length} entries
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="flex items-center justify-center rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50"><ChevronLeft className="h-4 w-4" /></button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
            .map((page, i, arr) => (
              <div key={page} className="flex items-center">
                {i > 0 && arr[i - 1] !== page - 1 && <span className="px-2 text-gray-400">...</span>}
                <button onClick={() => setCurrentPage(page)} className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium ${currentPage === page ? "bg-blue-600 text-white" : "border border-gray-300 text-gray-600 hover:bg-gray-50"}`}>{page}</button>
              </div>
            ))}
          <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="flex items-center justify-center rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  );
}
