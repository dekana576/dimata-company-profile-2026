"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Cropper from "react-easy-crop";
import {
  Plus,
  Trash2,
  Edit,
  GripVertical,
  X,
  Upload,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Maximize2,
  Info,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface GalleryImage {
  id: number;
  filename: string;
  originalName: string;
  path: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

type FilterType = "all" | "active" | "hidden";

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [expandedImage, setExpandedImage] = useState<GalleryImage | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // --- Pagination States ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Tampilkan 8 gambar per halaman

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      setImages(data.images || []);
    } catch {
      showNotification("error", "Failed to load images");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // --- Logic untuk Menyaring (Filter) & Mengurutkan (Sort) Data ---
  const processedImages = useMemo(() => {
    let result = [...images];

    // Filter
    if (filter === "active") {
      result = result.filter((img) => img.isActive);
    } else if (filter === "hidden") {
      result = result.filter((img) => !img.isActive);
    }

    // Sort berdasarkan sortOrder (ascending / terkecil ke terbesar)
    result.sort((a, b) => a.sortOrder - b.sortOrder);

    return result;
  }, [images, filter]);

  // Reset ke halaman 1 jika filter berubah atau jumlah gambar berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, images.length]);

  // --- Logic Paginasi ---
  const totalPages = Math.ceil(processedImages.length / itemsPerPage);
  const paginatedImages = processedImages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      showNotification("success", "Image deleted successfully");
      fetchImages();
    } catch {
      showNotification("error", "Failed to delete image");
    }
  };

  const handleToggleActive = async (image: GalleryImage) => {
    try {
      const res = await fetch(`/api/gallery/${image.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !image.isActive }),
      });
      if (!res.ok) throw new Error("Failed to update");
      showNotification(
        "success",
        `Image ${image.isActive ? "hidden" : "published"} successfully`
      );
      fetchImages();
    } catch {
      showNotification("error", "Failed to update image visibility");
    }
  };

  const handleUpdateDescription = async (
    id: number,
    description: string
  ) => {
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      if (!res.ok) throw new Error("Failed to update");
      showNotification("success", "Description updated successfully");
      fetchImages();
    } catch {
      showNotification("error", "Failed to update description");
    }
  };

  const handleUpdateSortOrder = async (id: number, sortOrder: number) => {
    try {
      // Optimistic update for smoother UI
      setImages((prev) =>
        prev.map((img) => (img.id === id ? { ...img, sortOrder } : img))
      );

      const res = await fetch(`/api/gallery/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder }),
      });
      if (!res.ok) {
        // Revert on fail
        fetchImages();
        throw new Error("Failed to update");
      }
    } catch {
      showNotification("error", "Failed to update sort order");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-500">Loading gallery...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header & Controls */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Organize, upload, and manage images displayed on your website.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Tabs Filter */}
          <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1">
            {(["all", "active", "hidden"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                  filter === f
                    ? "bg-white text-blue-600 shadow-sm ring-1 ring-gray-200"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Image
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`mb-6 flex items-center gap-2 rounded-lg p-3 text-sm font-medium border ${
            notification.type === "success"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          {notification.message}
        </div>
      )}

      {/* Main Content Area */}
      {images.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
          <div className="rounded-full bg-white p-3 shadow-sm ring-1 ring-gray-200">
            <ImageIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-gray-900">No images uploaded yet</h3>
          <p className="mt-1 text-sm text-gray-500 max-w-sm">
            Start building your gallery by uploading high-quality images. They will appear here once added.
          </p>
          <button
            onClick={() => setShowUpload(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Upload className="h-4 w-4" />
            Upload First Image
          </button>
        </div>
      ) : processedImages.length === 0 ? (
        <div className="mt-8 rounded-xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
          <Filter className="mx-auto h-8 w-8 text-gray-400" />
          <h3 className="mt-4 text-sm font-semibold text-gray-900">No images match this filter</h3>
          <p className="mt-1 text-sm text-gray-500">Try changing your filter settings to see more images.</p>
        </div>
      ) : (
        <>
          {/* Images Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginatedImages.map((image) => (
              <div
                key={image.id}
                className={`group flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-200 hover:shadow-md ${
                  !image.isActive ? "border-gray-200 opacity-80" : "border-gray-200"
                }`}
              >
                {/* Image Preview & Overlay Actions */}
                <div 
                  className="relative aspect-[4/3] cursor-pointer overflow-hidden bg-gray-100" 
                  onClick={() => setExpandedImage(image)}
                >
                  <img
                    src={image.path}
                    alt={image.description || image.originalName}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Action Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/60 via-black/0 to-black/30 p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); setExpandedImage(image); }}
                        className="flex h-8 w-8 items-center justify-center rounded-md bg-white/90 text-gray-700 backdrop-blur hover:bg-white hover:text-blue-600"
                        title="Expand View"
                      >
                        <Maximize2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingImage(image); }}
                        className="flex h-8 w-8 items-center justify-center rounded-md bg-white/90 text-gray-700 backdrop-blur hover:bg-white hover:text-blue-600"
                        title="Edit Description"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(image.id); }}
                        className="flex h-8 w-8 items-center justify-center rounded-md bg-red-50 text-red-600 backdrop-blur hover:bg-red-100 hover:text-red-700"
                        title="Delete Image"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                    {!image.isActive && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-yellow-100/90 px-2 py-1 text-xs font-semibold text-yellow-800 backdrop-blur-sm">
                        <EyeOff className="h-3 w-3" /> Hidden
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Details/Footer */}
                <div className="flex flex-1 flex-col p-4">
                  <p className="line-clamp-2 min-h-[2.5rem] text-sm text-gray-600">
                    {image.description || <span className="text-gray-400 italic">No description provided</span>}
                  </p>
                  
                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                    {/* Sort Order Input */}
                    <div className="flex items-center gap-2" title="Lower number appears first">
                      <GripVertical className="h-4 w-4 text-gray-400" />
                      <label className="sr-only">Sort Order</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={image.sortOrder}
                          onChange={(e) =>
                            handleUpdateSortOrder(image.id, parseInt(e.target.value) || 0)
                          }
                          className="w-16 rounded-md border border-gray-300 py-1 pl-2 pr-1 text-sm font-medium text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          min="0"
                        />
                      </div>
                    </div>

                    {/* Toggle Visibility */}
                    <button
                      onClick={() => handleToggleActive(image)}
                      className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                        image.isActive 
                          ? "bg-green-50 text-green-700 hover:bg-green-100" 
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {image.isActive ? (
                        <><Eye className="h-3.5 w-3.5" /> Published</>
                      ) : (
                        <><EyeOff className="h-3.5 w-3.5" /> Draft</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, processedImages.length)} of {processedImages.length} images
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .map((page, i, arr) => (
                    <div key={page} className="flex items-center">
                      {i > 0 && arr[i - 1] !== page - 1 && <span className="px-2 text-gray-400">...</span>}
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
                  className="flex items-center justify-center rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSuccess={() => {
            setShowUpload(false);
            fetchImages();
            showNotification("success", "Image uploaded successfully");
          }}
        />
      )}

      {/* Edit Modal */}
      {editingImage && (
        <EditModal
          image={editingImage}
          onClose={() => setEditingImage(null)}
          onSuccess={(description) => {
            setEditingImage(null);
            handleUpdateDescription(editingImage.id, description);
          }}
        />
      )}

      {/* Lightbox Modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
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
              src={expandedImage.path}
              alt={expandedImage.description || expandedImage.originalName}
              className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
            />
            {expandedImage.description && (
              <div className="mt-4 max-w-2xl text-center text-sm font-medium text-white/90">
                {expandedImage.description}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Upload Modal ─── */

function UploadModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropArea, setCropArea] = useState<CropArea | null>(null);
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > 2 * 1024 * 1024) {
      setError("File size must be less than 2MB");
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(selected.type)) {
      setError("Only JPEG, PNG, WebP, and GIF files are allowed");
      return;
    }

    setFile(selected);
    setError("");
    setCroppedImage(null);

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(selected);
  };

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: CropArea
  ): Promise<string> => {
    const image = new window.Image();
    image.src = imageSrc;
    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const canvas = document.createElement("canvas");
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) return imageSrc;

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

    return canvas.toDataURL("image/jpeg", 0.9);
  };

  const handleCropComplete = useCallback(
    (_croppedArea: unknown, croppedAreaPixels: CropArea) => {
      setCropArea(croppedAreaPixels);
    },
    []
  );

  const handleApplyCrop = async () => {
    if (!preview || !cropArea) return;
    const cropped = await getCroppedImg(preview, cropArea);
    setCroppedImage(cropped);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");

    try {
      const imageToUpload = croppedImage || preview;
      let blob: Blob;
      if (imageToUpload?.startsWith("data:")) {
        const res = await fetch(imageToUpload);
        blob = await res.blob();
      } else {
        blob = file;
      }

      const formData = new FormData();
      formData.append("file", blob, file.name);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const data = await uploadRes.json();
        throw new Error(data.error || "Upload failed");
      }

      const { filename, originalName, path } = await uploadRes.json();

      const createRes = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename,
          originalName,
          path,
          description: description || null,
          sortOrder,
        }),
      });

      if (!createRes.ok) throw new Error("Failed to create record");

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="mx-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 className="text-lg font-bold text-gray-900">Upload New Image</h2>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="mt-5 space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Select Image File (Max 2MB)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 focus:outline-none"
            />
          </div>

          {/* Crop Area */}
          {preview && !croppedImage && (
            <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">Crop Image (Optional)</label>
                <button
                  onClick={handleApplyCrop}
                  className="rounded-md bg-gray-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-900"
                >
                  Apply Crop
                </button>
              </div>
              <div className="relative h-64 w-full overflow-hidden rounded-lg bg-black/5">
                <Cropper
                  image={preview}
                  crop={crop}
                  zoom={zoom}
                  aspect={4 / 3}
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
            </div>
          )}

          {/* Preview Result */}
          {(croppedImage || preview) && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Final Preview</label>
                {croppedImage && (
                  <button
                    onClick={() => {
                      setCroppedImage(null);
                      setCrop({ x: 0, y: 0 });
                      setZoom(1);
                    }}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700"
                  >
                    Cancel Crop
                  </button>
                )}
              </div>
              <img
                src={croppedImage || preview || undefined}
                alt="Upload Preview"
                className="h-48 w-full rounded-lg border border-gray-200 object-cover shadow-sm"
              />
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Short Description / Caption
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="E.g., Our team celebrating at the 2026 Tech Summit..."
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Display Order
              </label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                min="0"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="mt-1 flex items-center gap-1 text-[11px] text-gray-500">
                <Info className="h-3 w-3" /> Lower number = shown first
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-5">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? (
              "Uploading..."
            ) : (
              <>
                <Upload className="h-4 w-4" /> Save Image
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Edit Modal ─── */

function EditModal({
  image,
  onClose,
  onSuccess,
}: {
  image: GalleryImage;
  onClose: () => void;
  onSuccess: (description: string) => void;
}) {
  const [description, setDescription] = useState(image.description || "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 className="text-lg font-bold text-gray-900">Edit Details</h2>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
          <img
            src={image.path}
            alt={image.description || image.originalName}
            className="h-48 w-full object-cover"
          />
        </div>

        <div className="mt-5">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Description / Caption
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter a description for this image..."
          />
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSuccess(description)}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function ImageIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
      />
    </svg>
  );
}