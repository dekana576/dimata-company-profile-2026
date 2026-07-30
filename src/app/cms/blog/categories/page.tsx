"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Plus, Pencil, Trash2, X, Search, Tag,
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
} from "lucide-react";

interface Category {
  id: number;
  slug: string;
  nameId: string;
  nameEn: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  _count: { posts: number };
}

interface CategoryFormData {
  slug: string;
  nameId: string;
  nameEn: string;
  sortOrder: number;
  isActive: boolean;
}

type SortKey = keyof Category;

function SortIcon({ col, sortConfig }: { col: SortKey; sortConfig: { key: SortKey; direction: "asc" | "desc" } }) {
  if (sortConfig.key !== col) return null;
  return sortConfig.direction === "asc"
    ? <ChevronUp className="inline h-4 w-4" />
    : <ChevronDown className="inline h-4 w-4" />;
}

export default function CmsBlogCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    slug: "", nameId: "", nameEn: "", sortOrder: 0, isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: "asc" | "desc" }>({
    key: "sortOrder", direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/blog/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const processedCategories = useMemo(() => {
    let result = [...categories];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter((c) =>
        c.nameId.toLowerCase().includes(lowerSearch) ||
        c.nameEn.toLowerCase().includes(lowerSearch) ||
        c.slug.toLowerCase().includes(lowerSearch)
      );
    }

    result.sort((a, b) => {
      const valA = a[sortConfig.key] ?? "";
      const valB = b[sortConfig.key] ?? "";
      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [categories, searchTerm, sortConfig]);

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(processedCategories.length / ITEMS_PER_PAGE);
  const paginatedCategories = processedCategories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleSort = (key: SortKey) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  const openCreateModal = () => {
    setEditingCat(null);
    setFormData({ slug: "", nameId: "", nameEn: "", sortOrder: categories.length, isActive: true });
    setError("");
    setShowModal(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCat(cat);
    setFormData({
      slug: cat.slug, nameId: cat.nameId, nameEn: cat.nameEn,
      sortOrder: cat.sortOrder, isActive: cat.isActive,
    });
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const url = editingCat
        ? `/api/blog/categories/${editingCat.id}`
        : "/api/blog/categories";
      const method = editingCat ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save category");
        return;
      }

      setShowModal(false);
      fetchCategories();
    } catch (err) {
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`/api/blog/categories/${id}`, { method: "DELETE" });
      if (res.ok) fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  const handleNameIdChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      nameId: value,
      slug: editingCat ? prev.slug : generateSlug(value),
    }));
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Categories</h1>
          <p className="mt-1 text-sm text-gray-500">Manage blog post categories</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {/* Search & Filter */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full whitespace-nowrap">
          <thead className="bg-gray-50">
            <tr>
              <th className="cursor-pointer px-4 py-3 text-left text-sm font-medium text-gray-600 hover:bg-gray-100" onClick={() => handleSort("nameId")}>
                <div className="flex items-center gap-1">Name (ID) {sortConfig.key === "nameId" && (sortConfig.direction === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}</div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name (EN)</th>
              <th className="cursor-pointer px-4 py-3 text-left text-sm font-medium text-gray-600 hover:bg-gray-100" onClick={() => handleSort("slug")}>
                <div className="flex items-center gap-1">Slug {sortConfig.key === "slug" && (sortConfig.direction === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}</div>
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Posts</th>
              <th className="cursor-pointer px-4 py-3 text-center text-sm font-medium text-gray-600 hover:bg-gray-100" onClick={() => handleSort("sortOrder")}>
                <div className="flex items-center justify-center gap-1">Order {sortConfig.key === "sortOrder" && (sortConfig.direction === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}</div>
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Active</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">Loading...</td>
              </tr>
            ) : paginatedCategories.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">No categories found.</td>
              </tr>
            ) : (
              paginatedCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{cat.nameId}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{cat.nameEn}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{cat.slug}</td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600">{cat._count?.posts ?? 0}</td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600">{cat.sortOrder}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cat.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {cat.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(cat)} className="rounded p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors" title="Edit"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(cat.id)} className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Delete"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-1">
          <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="flex items-center justify-center rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50"><ChevronLeft className="h-4 w-4" /></button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
            .map((page, i, arr) => (
              <div key={page} className="flex items-center">
                {i > 0 && arr[i - 1] !== page - 1 && <span className="px-2 text-gray-400">...</span>}
                <button onClick={() => setCurrentPage(page)} className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium ${currentPage === page ? "bg-blue-600 text-white" : "border border-gray-300 text-gray-600 hover:bg-gray-50"}`}>{page}</button>
              </div>
            ))}
          <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="flex items-center justify-center rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50"><ChevronRight className="h-4 w-4" /></button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">{editingCat ? "Edit Category" : "Add New Category"}</h2>
              <button onClick={() => setShowModal(false)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>

            {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Name (Indonesia) *</label>
                <input type="text" value={formData.nameId} onChange={(e) => handleNameIdChange(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none" required />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Name (English) *</label>
                <input type="text" value={formData.nameEn} onChange={(e) => setFormData((prev) => ({ ...prev, nameEn: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none" required />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Slug *</label>
                <input type="text" value={formData.slug} onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none bg-gray-50" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Sort Order</label>
                  <input type="number" value={formData.sortOrder} onChange={(e) => setFormData((prev) => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Active</label>
                  <select value={formData.isActive ? "true" : "false"} onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.value === "true" }))} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none">
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">{submitting ? "Saving..." : editingCat ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
