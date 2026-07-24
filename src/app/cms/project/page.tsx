"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Cropper from "react-easy-crop";
import {
  Plus,
  Pencil,
  Trash2,
  FolderGit2,
  X,
  Upload,
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Maximize2,
  AlertCircle,
  Info,
} from "lucide-react";

interface Project {
  id: number;
  slug: string;
  titleId: string;
  titleEn: string;
  descriptionId: string;
  descriptionEn: string;
  client: string | null;
  category: string;
  technologies: string;
  image: string | null;
  status: string;
  startDate: string | null;
  endDate: string | null;
  externalUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

interface ProjectFormData {
  slug: string;
  titleId: string;
  titleEn: string;
  descriptionId: string;
  descriptionEn: string;
  client: string;
  category: string;
  technologies: string;
  image: string;
  status: string;
  startDate: string;
  endDate: string;
  externalUrl: string;
  sortOrder: number;
  isActive: boolean;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

type SortKey = keyof Project;

const EMPTY_FORM: ProjectFormData = {
  slug: "",
  titleId: "",
  titleEn: "",
  descriptionId: "",
  descriptionEn: "",
  client: "",
  category: "Web Application",
  technologies: "",
  image: "",
  status: "completed",
  startDate: "",
  endDate: "",
  externalUrl: "",
  sortOrder: 0,
  isActive: true,
};

export default function CmsProjectPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterActive, setFilterActive] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "asc" | "desc";
  }>({ key: "createdAt", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string>("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropAreaPixels, setCropAreaPixels] = useState<CropArea | null>(null);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/project");
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const processedProjects = useMemo(() => {
    let result = [...projects];

    if (filterCategory !== "all") {
      result = result.filter((p) => p.category === filterCategory);
    }
    if (filterStatus !== "all") {
      result = result.filter((p) => p.status === filterStatus);
    }
    if (filterActive !== "all") {
      const isActive = filterActive === "true";
      result = result.filter((p) => p.isActive === isActive);
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.titleId.toLowerCase().includes(lower) ||
          p.titleEn.toLowerCase().includes(lower) ||
          (p.client && p.client.toLowerCase().includes(lower)) ||
          p.category.toLowerCase().includes(lower)
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
  }, [projects, searchTerm, filterCategory, filterStatus, filterActive, sortConfig]);

  const totalPages = Math.ceil(processedProjects.length / itemsPerPage);
  const paginatedProjects = processedProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory, filterStatus, filterActive, itemsPerPage]);

  const handleSort = (key: SortKey) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const handleTitleChange = (field: "titleId" | "titleEn", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      slug: editingProject
        ? prev.slug
        : field === "titleId"
          ? generateSlug(value)
          : prev.slug,
    }));
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData(EMPTY_FORM);
    setImagePreview("");
    setError("");
    setShowModal(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({
      slug: project.slug,
      titleId: project.titleId,
      titleEn: project.titleEn,
      descriptionId: project.descriptionId,
      descriptionEn: project.descriptionEn,
      client: project.client || "",
      category: project.category,
      technologies: project.technologies,
      image: project.image || "",
      status: project.status,
      startDate: project.startDate ? project.startDate.split("T")[0] : "",
      endDate: project.endDate ? project.endDate.split("T")[0] : "",
      externalUrl: project.externalUrl || "",
      sortOrder: project.sortOrder,
      isActive: project.isActive,
    });
    setImagePreview(project.image || "");
    setError("");
    setShowModal(true);
  };

  const getCroppedImg = (
    imageSrc: string,
    pixelCrop: CropArea
  ): Promise<string> => {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(imageSrc);
          return;
        }
        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );
        resolve(canvas.toDataURL("image/jpeg", 0.9));
      };
      image.src = imageSrc;
    });
  };

  const handleCropComplete = useCallback(
    (_croppedArea: unknown, croppedAreaPixels: CropArea) => {
      setCropAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleApplyCrop = async () => {
    if (!rawImageSrc || !cropAreaPixels) return;
    const cropped = await getCroppedImg(rawImageSrc, cropAreaPixels);
    setImagePreview(cropped);
    setCropModalOpen(false);
    setRawImageSrc("");
    setCrop({ x: 0, y: 0 });
    setZoom(1);

    try {
      const res = await fetch(cropped);
      const blob = await res.blob();

      if (blob.size > 5 * 1024 * 1024) {
        setError("Cropped image is too large (max 5MB). Try cropping a smaller area or reducing zoom.");
        return;
      }

      const fd = new FormData();
      fd.append("file", blob, "cropped-project.jpg");

      const uploadRes = await fetch("/api/upload/project", {
        method: "POST",
        body: fd,
      });

      const data = await uploadRes.json();
      if (!uploadRes.ok) {
        setError(data.error || "Failed to upload cropped image");
        return;
      }

      setFormData((prev) => ({ ...prev, image: data.path }));
      setImagePreview(data.path);
    } catch {
      setError("Failed to upload cropped image");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)
    ) {
      setError("Only JPEG, PNG, WebP, and GIF files are allowed");
      return;
    }

    setError("");
    setCropModalOpen(true);

    const reader = new FileReader();
    reader.onload = () => {
      setRawImageSrc(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCropAreaPixels(null);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must be less than 2MB");
      return;
    }

    if (
      !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)
    ) {
      setError("Only JPEG, PNG, WebP, and GIF files are allowed");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/upload/project", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to upload image");
        return;
      }

      setFormData((prev) => ({ ...prev, image: data.path }));
      setImagePreview(data.path);
    } catch {
      setError("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
    setImagePreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const url = editingProject
        ? `/api/project/${editingProject.id}`
        : "/api/project";
      const method = editingProject ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save project");
        return;
      }

      setShowModal(false);
      fetchProjects();
    } catch {
      setError("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`/api/project/${id}`, { method: "DELETE" });
      if (res.ok) fetchProjects();
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string }> = {
      ongoing: { bg: "bg-blue-100", text: "text-blue-800" },
      completed: { bg: "bg-green-100", text: "text-green-800" },
      upcoming: { bg: "bg-amber-100", text: "text-amber-800" },
    };
    return badges[status] || badges.completed;
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Projects Management</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </button>
      </div>

      {/* DataTables Controls */}
      <div className="mb-4 flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 focus-within:border-blue-500 focus-within:bg-white">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search title, client, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-sm focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="Web Application">Web Application</option>
              <option value="Mobile App">Mobile App</option>
              <option value="ERP System">ERP System</option>
              <option value="Custom Software">Custom Software</option>
            </select>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="ongoing">Ongoing</option>
            <option value="upcoming">Upcoming</option>
          </select>

          <select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Visibility</option>
            <option value="true">Active Only</option>
            <option value="false">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full whitespace-nowrap">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="cursor-pointer px-4 py-3 text-left text-sm font-medium text-gray-600 hover:bg-gray-100"
                onClick={() => handleSort("titleId")}
              >
                <div className="flex items-center gap-1">
                  Title
                  {sortConfig.key === "titleId" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    ))}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Client
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Category
              </th>
              <th
                className="cursor-pointer px-4 py-3 text-left text-sm font-medium text-gray-600 hover:bg-gray-100"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-1">
                  Status
                  {sortConfig.key === "status" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    ))}
                </div>
              </th>
              <th
                className="cursor-pointer px-4 py-3 text-left text-sm font-medium text-gray-600 hover:bg-gray-100"
                onClick={() => handleSort("isActive")}
              >
                <div className="flex items-center gap-1">
                  Active
                  {sortConfig.key === "isActive" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    ))}
                </div>
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedProjects.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No projects found matching your criteria.
                </td>
              </tr>
            ) : (
              paginatedProjects.map((project) => {
                const statusBadge = getStatusBadge(project.status);
                return (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {project.image ? (
                          <img
                            src={project.image}
                            alt={project.titleId}
                            className="h-10 w-10 rounded object-cover cursor-pointer hover:opacity-80"
                            onClick={() => setExpandedImage(project.image)}
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-gray-100">
                            <FolderGit2 className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                        <div className="max-w-[250px] md:max-w-[350px]">
                          <div className="truncate font-medium text-gray-900" title={project.titleId}>
                            {project.titleId}
                          </div>
                          <div className="truncate text-xs text-gray-500" title={project.titleEn}>
                            {project.titleEn}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {project.client || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                        {project.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          project.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {project.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {project.externalUrl && (
                          <a
                            href={project.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                            title="Open external URL"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        <button
                          onClick={() => openEditModal(project)}
                          className="rounded p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          title="Edit Project"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
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
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded border border-gray-300 bg-white px-2 py-1 focus:border-blue-500 focus:outline-none"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span>entries</span>
          <span className="ml-4">
            Showing {paginatedProjects.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
            {Math.min(currentPage * itemsPerPage, processedProjects.length)} of {processedProjects.length} entries
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center justify-center rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (p) =>
                p === 1 ||
                p === totalPages ||
                Math.abs(p - currentPage) <= 1
            )
            .map((page, i, arr) => (
              <div key={page} className="flex items-center">
                {i > 0 && arr[i - 1] !== page - 1 && (
                  <span className="px-2 text-gray-400">...</span>
                )}
                <button
                  onClick={() => setCurrentPage(page)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              </div>
            ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="flex items-center justify-center rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Expanded Image Lightbox */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setExpandedImage(null)}
        >
          <button
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            onClick={() => setExpandedImage(null)}
          >
            <X className="h-6 w-6" />
          </button>
          <div
            className="relative flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={expandedImage}
              alt="Expanded preview"
              className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Crop Modal */}
      {cropModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="mx-auto w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Crop Image</h3>
              <button
                onClick={() => {
                  setCropModalOpen(false);
                  setRawImageSrc("");
                }}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative h-64 w-full overflow-hidden rounded-lg bg-black/5">
              <Cropper
                image={rawImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={16 / 9}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            </div>

            <div className="mt-4 flex items-center gap-4">
              <span className="text-sm font-medium text-gray-600">Zoom:</span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600"
              />
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => {
                  setCropModalOpen(false);
                  setRawImageSrc("");
                }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCrop}
                className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
              >
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="mx-auto w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between sticky top-0 bg-white pb-2 z-10 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {editingProject ? "Edit Project" : "Add New Project"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title ID */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Judul (Bahasa Indonesia) *
                </label>
                <input
                  type="text"
                  value={formData.titleId}
                  onChange={(e) => handleTitleChange("titleId", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. Sistem Manajemen Inventaris Terintegrasi"
                  required
                />
              </div>

              {/* Title EN */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Title (English) *
                </label>
                <input
                  type="text"
                  value={formData.titleEn}
                  onChange={(e) => handleTitleChange("titleEn", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. Integrated Inventory Management System"
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  URL Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              {/* Description ID */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Deskripsi (Bahasa Indonesia) *
                </label>
                <textarea
                  value={formData.descriptionId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      descriptionId: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="Deskripsi singkat proyek dalam bahasa Indonesia..."
                  required
                />
              </div>

              {/* Description EN */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Description (English) *
                </label>
                <textarea
                  value={formData.descriptionEn}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      descriptionEn: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="Brief project description in English..."
                  required
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {/* Client */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, client: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. PT. Sukses Makmur"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    required
                  >
                    <option value="Web Application">Web Application</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="ERP System">ERP System</option>
                    <option value="Custom Software">Custom Software</option>
                  </select>
                </div>

                {/* Technologies */}
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Technologies Used
                  </label>
                  <input
                    type="text"
                    value={formData.technologies}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        technologies: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. React, Node.js, MariaDB, Tailwind CSS"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="completed">Completed</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="upcoming">Upcoming</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        sortOrder: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    min={0}
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* External URL */}
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    External URL <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.externalUrl}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        externalUrl: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="https://example.com"
                  />
                  <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    If filled, a &quot;View Project&quot; button will appear on the public page.
                  </p>
                </div>

                {/* Image Upload */}
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Project Image
                  </label>
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="flex-1 w-full space-y-2">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="project-image-upload"
                      />
                      <label
                        htmlFor="project-image-upload"
                        className={`flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-600 transition-colors hover:border-blue-400 hover:bg-blue-50 ${
                          uploading ? "pointer-events-none opacity-50" : ""
                        }`}
                      >
                        <Upload className="h-6 w-6 text-gray-400" />
                        <span className="font-medium text-gray-700">
                          {uploading ? "Uploading..." : "Click to upload & crop image"}
                        </span>
                        <span className="text-xs text-gray-500">
                          JPEG, PNG, WebP up to 2MB (16:9 ratio recommended)
                        </span>
                      </label>
                    </div>
                    {imagePreview && (
                      <div className="relative shrink-0 group">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-28 w-40 rounded-lg border border-gray-200 object-cover shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setExpandedImage(imagePreview)}
                        />
                        <button
                          type="button"
                          onClick={() => setExpandedImage(imagePreview)}
                          className="absolute top-1 left-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Expand preview"
                        >
                          <Maximize2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Active Toggle */}
                <div className="sm:col-span-2 mt-2">
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 hover:bg-gray-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isActive: e.target.checked,
                        }))
                      }
                      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="block text-sm font-semibold text-gray-900">
                        Publish Project
                      </span>
                      <span className="block text-xs text-gray-500">
                        Make this project visible to the public on the website.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-70 transition-colors"
                >
                  {submitting
                    ? "Saving..."
                    : editingProject
                      ? "Save Changes"
                      : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
