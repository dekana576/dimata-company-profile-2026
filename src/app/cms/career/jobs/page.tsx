"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Plus, Pencil, Trash2, Briefcase, X, Search,
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
} from "lucide-react";

interface Department {
  id: number;
  nameId: string;
  nameEn: string;
}

interface Job {
  id: number;
  slug: string;
  titleId: string;
  titleEn: string;
  departmentId: number;
  department: Department;
  location: string;
  type: string;
  summaryId: string;
  summaryEn: string;
  responsibilitiesId: string;
  responsibilitiesEn: string;
  requirementsId: string;
  requirementsEn: string;
  applyUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

interface JobFormData {
  slug: string;
  titleId: string;
  titleEn: string;
  departmentId: number;
  location: string;
  type: string;
  summaryId: string;
  summaryEn: string;
  responsibilitiesId: string[];
  responsibilitiesEn: string[];
  requirementsId: string[];
  requirementsEn: string[];
  applyUrl: string;
  sortOrder: number;
  isActive: boolean;
}

type SortKey = keyof Job;

function SortIcon({ col, sortConfig }: { col: SortKey; sortConfig: { key: SortKey; direction: "asc" | "desc" } }) {
  if (sortConfig.key !== col) return null;
  return sortConfig.direction === "asc"
    ? <ChevronUp className="inline h-4 w-4" />
    : <ChevronDown className="inline h-4 w-4" />;
}

export default function CmsJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [activeTab, setActiveTab] = useState<"id" | "en">("id");
  const [formData, setFormData] = useState<JobFormData>({
    slug: "", titleId: "", titleEn: "", departmentId: 0, location: "", type: "Full-time",
    summaryId: "", summaryEn: "",
    responsibilitiesId: [""], responsibilitiesEn: [""],
    requirementsId: [""], requirementsEn: [""],
    applyUrl: "", sortOrder: 0, isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [filterActive, setFilterActive] = useState("all");
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: "asc" | "desc" }>({
    key: "sortOrder", direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await fetch("/api/departments");
      const data = await res.json();
      setDepartments(data.departments || []);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchDepartments();
  }, []);

  const processedJobs = useMemo(() => {
    let result = [...jobs];

    if (filterDept !== "all") {
      result = result.filter((j) => j.departmentId === parseInt(filterDept));
    }

    if (filterActive !== "all") {
      result = result.filter((j) => j.isActive === (filterActive === "true"));
    }

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(
        (j) =>
          j.titleId.toLowerCase().includes(lowerSearch) ||
          j.titleEn.toLowerCase().includes(lowerSearch) ||
          j.location.toLowerCase().includes(lowerSearch) ||
          j.department?.nameId?.toLowerCase().includes(lowerSearch) ||
          j.department?.nameEn?.toLowerCase().includes(lowerSearch)
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
  }, [jobs, searchTerm, filterDept, filterActive, sortConfig]);

  const ITEMS_PER_PAGE = 10;

  const totalPages = Math.ceil(processedJobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = processedJobs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterDept = (value: string) => {
    setFilterDept(value);
    setCurrentPage(1);
  };

  const handleFilterActive = (value: string) => {
    setFilterActive(value);
    setCurrentPage(1);
  };

  const handleSort = (key: SortKey) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (lang: "id" | "en", title: string) => {
    setFormData((prev) => {
      const key = lang === "id" ? "titleId" : "titleEn";
      return {
        ...prev,
        [key]: title,
        slug: editingJob ? prev.slug : (lang === "id" ? generateSlug(title) : prev.slug),
      };
    });
  };

  const openCreateModal = () => {
    setEditingJob(null);
    setActiveTab("id");
    setFormData({
      slug: "", titleId: "", titleEn: "", departmentId: departments[0]?.id || 0,
      location: "", type: "Full-time",
      summaryId: "", summaryEn: "",
      responsibilitiesId: [""], responsibilitiesEn: [""],
      requirementsId: [""], requirementsEn: [""],
      applyUrl: "", sortOrder: jobs.length + 1, isActive: true,
    });
    setError("");
    setShowModal(true);
  };

  const openEditModal = (job: Job) => {
    setEditingJob(job);
    setActiveTab("id");

    const parseJsonArray = (str: string): string[] => {
      try {
        const parsed = JSON.parse(str);
        return Array.isArray(parsed) && parsed.length ? parsed : [""];
      } catch {
        return [""];
      }
    };

    setFormData({
      slug: job.slug,
      titleId: job.titleId,
      titleEn: job.titleEn,
      departmentId: job.departmentId,
      location: job.location,
      type: job.type,
      summaryId: job.summaryId,
      summaryEn: job.summaryEn,
      responsibilitiesId: parseJsonArray(job.responsibilitiesId),
      responsibilitiesEn: parseJsonArray(job.responsibilitiesEn),
      requirementsId: parseJsonArray(job.requirementsId),
      requirementsEn: parseJsonArray(job.requirementsEn),
      applyUrl: job.applyUrl || "",
      sortOrder: job.sortOrder,
      isActive: job.isActive,
    });
    setError("");
    setShowModal(true);
  };

  const handleArrayChange = (field: "responsibilitiesId" | "responsibilitiesEn" | "requirementsId" | "requirementsEn", index: number, value: string) => {
    setFormData((prev) => {
      const arr = [...prev[field]];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  };

  const addArrayItem = (field: "responsibilitiesId" | "responsibilitiesEn" | "requirementsId" | "requirementsEn") => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeArrayItem = (field: "responsibilitiesId" | "responsibilitiesEn" | "requirementsId" | "requirementsEn", index: number) => {
    setFormData((prev) => {
      const arr = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: arr.length ? arr : [""] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleId.trim() || !formData.titleEn.trim() || !formData.location.trim()) {
      setError("All fields are required");
      return;
    }
    if (!formData.departmentId) {
      setError("Please select a department");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const url = editingJob ? `/api/jobs/${editingJob.id}` : "/api/jobs";
      const method = editingJob ? "PUT" : "POST";

      const body = {
        ...formData,
        responsibilitiesId: formData.responsibilitiesId.filter((r) => r.trim()),
        responsibilitiesEn: formData.responsibilitiesEn.filter((r) => r.trim()),
        requirementsId: formData.requirementsId.filter((r) => r.trim()),
        requirementsEn: formData.requirementsEn.filter((r) => r.trim()),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setShowModal(false);
      fetchJobs();
    } catch {
      setError("Failed to save job");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchJobs();
      }
    } catch (err) {
      console.error("Error deleting job:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading jobs...</div>
      </div>
    );
  }

  const renderArrayField = (
    label: string,
    field: "responsibilitiesId" | "responsibilitiesEn" | "requirementsId" | "requirementsEn",
    items: string[],
    placeholder: string
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label} *</label>
      {items.map((item, idx) => (
        <div key={idx} className="flex gap-2 mb-2">
          <input
            type="text"
            value={item}
            onChange={(e) => handleArrayChange(field, idx, e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder={`${placeholder} ${idx + 1}`}
          />
          <button
            type="button"
            onClick={() => removeArrayItem(field, idx)}
            className="rounded-lg border border-gray-300 px-2 py-2 text-gray-400 hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addArrayItem(field)}
        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
      >
        <Plus className="h-4 w-4" /> Add item
      </button>
    </div>
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Career Jobs</h1>
          <p className="text-sm text-gray-500 mt-1">Manage job listings for the career page.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Job
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterDept}
          onChange={(e) => handleFilterDept(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">All Departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.nameEn}</option>
          ))}
        </select>
        <select
          value={filterActive}
          onChange={(e) => handleFilterActive(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                onClick={() => handleSort("titleId")}
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-gray-700"
              >
                Title (ID) <SortIcon col="titleId" sortConfig={sortConfig} />
              </th>
              <th
                onClick={() => handleSort("titleEn")}
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-gray-700"
              >
                Title (EN) <SortIcon col="titleEn" sortConfig={sortConfig} />
              </th>
              <th
                onClick={() => handleSort("departmentId")}
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-gray-700"
              >
                Department <SortIcon col="departmentId" sortConfig={sortConfig} />
              </th>
              <th
                onClick={() => handleSort("location")}
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-gray-700"
              >
                Location <SortIcon col="location" sortConfig={sortConfig} />
              </th>
              <th
                onClick={() => handleSort("type")}
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-gray-700"
              >
                Type <SortIcon col="type" sortConfig={sortConfig} />
              </th>
              <th
                onClick={() => handleSort("isActive")}
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-gray-700"
              >
                Active <SortIcon col="isActive" sortConfig={sortConfig} />
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedJobs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                  No jobs found.
                </td>
              </tr>
            ) : (
              paginatedJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{job.titleId}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {job.titleEn}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {job.department?.nameEn || "—"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {job.location}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                      {job.type}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        job.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {job.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                    <button
                      onClick={() => openEditModal(job)}
                      className="mr-3 text-blue-600 hover:text-blue-800"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-3">
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded p-1 hover:bg-gray-200 disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded p-1 hover:bg-gray-200 disabled:opacity-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 pt-10 pb-10">
          <div className="mx-4 w-full max-w-3xl rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                {editingJob ? "Edit Job" : "Add Job"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Language Tabs */}
              <div className="flex gap-2 border-b">
                <button
                  type="button"
                  onClick={() => setActiveTab("id")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "id"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Bahasa Indonesia
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("en")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "en"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  English
                </button>
              </div>

              {/* Common fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {activeTab === "id" ? "Title (Bahasa Indonesia) *" : "Title (English) *"}
                  </label>
                  <input
                    type="text"
                    value={activeTab === "id" ? formData.titleId : formData.titleEn}
                    onChange={(e) => handleTitleChange(activeTab, e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g. Backend Engineer"
                  />
                </div>

                {activeTab === "id" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Slug</label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Department *</label>
                      <select
                        value={formData.departmentId}
                        onChange={(e) => setFormData((prev) => ({ ...prev, departmentId: parseInt(e.target.value) }))}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value={0}>Select Department</option>
                        {departments.map((d) => (
                          <option key={d.id} value={d.id}>{d.nameEn}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Location *</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g. Denpasar · Hybrid"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Type</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Magang">Magang</option>
                        <option value="Contract">Contract</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Sort Order</label>
                      <input
                        type="number"
                        value={formData.sortOrder}
                        onChange={(e) => setFormData((prev) => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Apply URL</label>
                      <input
                        type="url"
                        value={formData.applyUrl}
                        onChange={(e) => setFormData((prev) => ({ ...prev, applyUrl: e.target.value }))}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="flex items-end pb-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isActive"
                          checked={formData.isActive}
                          onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "en" && (
                  <>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Slug</label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Department *</label>
                      <select
                        value={formData.departmentId}
                        onChange={(e) => setFormData((prev) => ({ ...prev, departmentId: parseInt(e.target.value) }))}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value={0}>Select Department</option>
                        {departments.map((d) => (
                          <option key={d.id} value={d.id}>{d.nameEn}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Location *</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g. Denpasar · Hybrid"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Type</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Magang">Magang</option>
                        <option value="Contract">Contract</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Sort Order</label>
                      <input
                        type="number"
                        value={formData.sortOrder}
                        onChange={(e) => setFormData((prev) => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Apply URL</label>
                      <input
                        type="url"
                        value={formData.applyUrl}
                        onChange={(e) => setFormData((prev) => ({ ...prev, applyUrl: e.target.value }))}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="flex items-end pb-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isActiveEn"
                          checked={formData.isActive}
                          onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="isActiveEn" className="text-sm text-gray-700">Active</label>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Language-specific content */}
              {activeTab === "id" ? (
                <>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Summary (Bahasa Indonesia) *</label>
                    <textarea
                      value={formData.summaryId}
                      onChange={(e) => setFormData((prev) => ({ ...prev, summaryId: e.target.value }))}
                      rows={2}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  {renderArrayField("Responsibilities (Bahasa Indonesia)", "responsibilitiesId", formData.responsibilitiesId, "Responsibility")}
                  {renderArrayField("Requirements (Bahasa Indonesia)", "requirementsId", formData.requirementsId, "Requirement")}
                </>
              ) : (
                <>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Summary (English) *</label>
                    <textarea
                      value={formData.summaryEn}
                      onChange={(e) => setFormData((prev) => ({ ...prev, summaryEn: e.target.value }))}
                      rows={2}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  {renderArrayField("Responsibilities (English)", "responsibilitiesEn", formData.responsibilitiesEn, "Responsibility")}
                  {renderArrayField("Requirements (English)", "requirementsEn", formData.requirementsEn, "Requirement")}
                </>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingJob ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
