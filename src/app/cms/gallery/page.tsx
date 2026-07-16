"use client";

import { useEffect, useState, useCallback } from "react";
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

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [expandedImage, setExpandedImage] = useState<GalleryImage | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

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
        `Image ${image.isActive ? "hidden" : "shown"} successfully`
      );
      fetchImages();
    } catch {
      showNotification("error", "Failed to update image");
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
      const res = await fetch(`/api/gallery/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder }),
      });
      if (!res.ok) throw new Error("Failed to update");
      fetchImages();
    } catch {
      showNotification("error", "Failed to update sort order");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
          <p className="mt-1 text-gray-600">
            Manage your gallery images for the About page
          </p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Image
        </button>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`mt-4 flex items-center gap-2 rounded-lg p-3 ${
            notification.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
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

      {/* Images Grid */}
      {images.length === 0 ? (
        <div className="mt-8 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No images</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by uploading your first image.
          </p>
          <button
            onClick={() => setShowUpload(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Image
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-lg bg-white shadow"
            >
              {/* Image Preview */}
              <div className="aspect-[4/3] relative cursor-pointer" onClick={() => setExpandedImage(image)}>
                <img
                  src={image.path}
                  alt={image.description || image.originalName}
                  className="h-full w-full object-cover"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors">
                  <div className="absolute right-2 top-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); setExpandedImage(image); }}
                      className="rounded-lg bg-white p-2 text-gray-700 hover:bg-gray-100"
                      title="Expand"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingImage(image); }}
                      className="rounded-lg bg-white p-2 text-gray-700 hover:bg-gray-100"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleToggleActive(image); }}
                      className="rounded-lg bg-white p-2 text-gray-700 hover:bg-gray-100"
                      title={image.isActive ? "Hide" : "Show"}
                    >
                      {image.isActive ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(image.id); }}
                      className="rounded-lg bg-white p-2 text-red-600 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {/* Status Badge */}
                {!image.isActive && (
                  <div className="absolute left-2 top-2">
                    <span className="rounded bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                      Hidden
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    value={image.sortOrder}
                    onChange={(e) =>
                      handleUpdateSortOrder(image.id, parseInt(e.target.value) || 0)
                    }
                    className="w-16 rounded border border-gray-300 px-2 py-1 text-sm"
                    min="0"
                  />
                  <span className="text-xs text-gray-400">0 = first</span>
                </div>
                <p className="mt-2 truncate text-sm text-gray-500">
                  {image.description || "No description"}
                </p>
              </div>
            </div>
          ))}
        </div>
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setExpandedImage(null)}
        >
          <button
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={() => setExpandedImage(null)}
          >
            <X className="h-6 w-6" />
          </button>
          <div
            className="relative max-h-[85vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={expandedImage.path}
              alt={expandedImage.description || expandedImage.originalName}
              className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
            />
            {expandedImage.description && (
              <div className="absolute bottom-0 left-0 right-0 rounded-b-lg bg-black/60 p-4">
                <p className="text-center text-sm text-white">{expandedImage.description}</p>
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
      // Use cropped image or original
      const imageToUpload = croppedImage || preview;

      // Convert data URL to blob for upload
      let blob: Blob;
      if (imageToUpload?.startsWith("data:")) {
        const res = await fetch(imageToUpload);
        blob = await res.blob();
      } else {
        blob = file;
      }

      // Upload file
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

      // Create gallery record
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Upload Image</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Select Image (max 2MB)
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* Crop Area */}
        {preview && !croppedImage && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Crop Image (optional)
            </label>
            <div className="relative h-64 rounded-lg overflow-hidden bg-gray-100">
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
            <div className="mt-2 flex items-center gap-4">
              <label className="text-sm text-gray-600">Zoom:</label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1"
              />
              <button
                onClick={handleApplyCrop}
                className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Apply Crop
              </button>
            </div>
          </div>
        )}

        {/* Preview */}
        {(croppedImage || preview) && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview
            </label>
            <img
              src={croppedImage || preview || undefined}
              alt="Preview"
              className="h-40 w-full rounded-lg object-cover"
            />
            {croppedImage && (
              <button
                onClick={() => {
                  setCroppedImage(null);
                  setCrop({ x: 0, y: 0 });
                  setZoom(1);
                }}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700"
              >
                Reset crop
              </button>
            )}
          </div>
        )}

        {/* Description */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter image description..."
          />
        </div>

        {/* Sort Order */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Sort Order
          </label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
            min="0"
            className="mt-1 block w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
            <Info className="h-3 w-3" />
            Lower number = displayed first (0 = first, 1 = second, ...)
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            {uploading ? "Uploading..." : "Upload"}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Edit Image</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <img
          src={image.path}
          alt={image.description || image.originalName}
          className="mt-4 h-40 w-full rounded-lg object-cover"
        />

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter image description..."
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSuccess(description)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Save
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
