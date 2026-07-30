"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Cropper from "react-easy-crop";
import {
  ArrowLeft, Bold, Italic, Heading2, List, Link2, Image,
  Upload, X, Loader2, Maximize2,
} from "lucide-react";

interface Category {
  id: number;
  slug: string;
  nameId: string;
  nameEn: string;
}

export default function CreateBlogPostPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [authorName, setAuthorName] = useState("DIMATA");
  const [authorPhoto, setAuthorPhoto] = useState("");
  const [authorPhotoPreview, setAuthorPhotoPreview] = useState("");
  const [status, setStatus] = useState("draft");
  const [publishedAt, setPublishedAt] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadingAuthorPhoto, setUploadingAuthorPhoto] = useState(false);

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropAreaPixels, setCropAreaPixels] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const [authorCropOpen, setAuthorCropOpen] = useState(false);
  const [authorRawSrc, setAuthorRawSrc] = useState("");
  const [authorCrop, setAuthorCrop] = useState({ x: 0, y: 0 });
  const [authorZoom, setAuthorZoom] = useState(1);
  const [authorCropPixels, setAuthorCropPixels] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [expandedAuthorPhoto, setExpandedAuthorPhoto] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/blog/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(console.error);
  }, []);

  const generateSlug = (val: string) => {
    return val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(value));
    }
  };

  const insertToolbarTag = (template: string, isInline?: boolean) => {
    const textarea = document.getElementById("blog-content") as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const placeholder = isInline ? selected || "text" : selected || "content";
    const tag = template.replace("{}", placeholder);
    const newContent = content.substring(0, start) + tag + content.substring(end);
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      const cursorPos = start + tag.indexOf(placeholder) + placeholder.length;
      textarea.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      setError("Only JPEG, PNG, WebP, and GIF files are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
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
    };
    reader.readAsDataURL(file);
  };

  const getCroppedImg = (imageSrc: string, pixelCrop: { x: number; y: number; width: number; height: number }): Promise<string> => {
    return new Promise((resolve) => {
      const image = document.createElement("img");
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) { resolve(imageSrc); return; }
        ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
        resolve(canvas.toDataURL("image/jpeg", 0.9));
      };
      image.src = imageSrc;
    });
  };

  const handleCropComplete = useCallback((_croppedArea: unknown, croppedAreaPixels: { x: number; y: number; width: number; height: number }) => {
    setCropAreaPixels(croppedAreaPixels);
  }, []);

  const handleApplyCrop = async () => {
    if (!rawImageSrc || !cropAreaPixels) return;
    setUploading(true);
    setError("");
    try {
      const cropped = await getCroppedImg(rawImageSrc, cropAreaPixels);
      const res = await fetch(cropped);
      const blob = await res.blob();
      if (blob.size > 5 * 1024 * 1024) {
        setError("Cropped image is too large (max 5MB). Try cropping a smaller area.");
        return;
      }
      const fd = new FormData();
      fd.append("image", blob, "cropped-blog.jpg");
      const uploadRes = await fetch("/api/blog/upload", { method: "POST", body: fd });
      const data = await uploadRes.json();
      if (!uploadRes.ok) { setError(data.error || "Upload failed"); return; }
      setImage(data.path);
      setImagePreview(data.path);
      setCropModalOpen(false);
      setRawImageSrc("");
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleAuthorPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Only JPEG, PNG, and WebP files are allowed");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("File size must be less than 2MB");
      return;
    }
    setError("");
    setAuthorCropOpen(true);
    const reader = new FileReader();
    reader.onload = () => {
      setAuthorRawSrc(reader.result as string);
      setAuthorCrop({ x: 0, y: 0 });
      setAuthorZoom(1);
      setAuthorCropPixels(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAuthorCropComplete = useCallback((_croppedArea: unknown, croppedAreaPixels: { x: number; y: number; width: number; height: number }) => {
    setAuthorCropPixels(croppedAreaPixels);
  }, []);

  const handleAuthorApplyCrop = async () => {
    if (!authorRawSrc || !authorCropPixels) return;
    setUploadingAuthorPhoto(true);
    setError("");
    try {
      const cropped = await getCroppedImg(authorRawSrc, authorCropPixels);
      const res = await fetch(cropped);
      const blob = await res.blob();
      if (blob.size > 2 * 1024 * 1024) {
        setError("Cropped image is too large (max 2MB). Try cropping a smaller area.");
        return;
      }
      const fd = new FormData();
      fd.append("image", blob, "cropped-author.jpg");
      const uploadRes = await fetch("/api/blog/upload", { method: "POST", body: fd });
      const data = await uploadRes.json();
      if (!uploadRes.ok) { setError(data.error || "Upload failed"); return; }
      setAuthorPhoto(data.path);
      setAuthorPhotoPreview(data.path);
      setAuthorCropOpen(false);
      setAuthorRawSrc("");
      setAuthorCrop({ x: 0, y: 0 });
      setAuthorZoom(1);
    } catch {
      setError("Upload failed");
    } finally {
      setUploadingAuthorPhoto(false);
    }
  };

  const toggleCategory = (categoryId: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !content) {
      setError("Title, slug, and content are required");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/blog/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug, title, content,
          excerpt: excerpt || null,
          image: image || null,
          authorName,
          authorPhoto: authorPhoto || null,
          status,
          publishedAt: publishedAt || null,
          isFeatured,
          isActive,
          sortOrder,
          categoryIds: selectedCategoryIds,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create post");
        return;
      }
      router.push("/cms/blog");
    } catch {
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => router.back()} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Blog Post</h1>
          <p className="mt-1 text-sm text-gray-500">Write a new article or news post</p>
        </div>
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="grid gap-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
                placeholder="e.g. Transformasi Digital di Era Modern"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">URL Slug *</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Excerpt (short summary)</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
                placeholder="Brief summary shown in blog cards..."
              />
            </div>
          </div>
        </div>

        {/* Content Editor */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Content *</label>
          <div className="rounded-lg border border-gray-300 overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 px-2 py-1.5">
              <button type="button" onClick={() => insertToolbarTag("<strong>{}</strong>", true)} title="Bold" className="rounded p-1.5 text-gray-600 hover:bg-gray-200"><Bold className="h-4 w-4" /></button>
              <button type="button" onClick={() => insertToolbarTag("<em>{}</em>", true)} title="Italic" className="rounded p-1.5 text-gray-600 hover:bg-gray-200"><Italic className="h-4 w-4" /></button>
              <div className="mx-1 h-4 w-px bg-gray-300" />
              <button type="button" onClick={() => insertToolbarTag("<h2>{{}}</h2>")} title="Heading" className="rounded p-1.5 text-gray-600 hover:bg-gray-200"><Heading2 className="h-4 w-4" /></button>
              <button type="button" onClick={() => insertToolbarTag("<ul>\n  <li>{{}}</li>\n</ul>")} title="List" className="rounded p-1.5 text-gray-600 hover:bg-gray-200"><List className="h-4 w-4" /></button>
              <button type="button" onClick={() => insertToolbarTag('<a href="{{}}">link text</a>')} title="Link" className="rounded p-1.5 text-gray-600 hover:bg-gray-200"><Link2 className="h-4 w-4" /></button>
            </div>
            <textarea
              id="blog-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={14}
              className="w-full px-3 py-3 text-sm text-gray-900 focus:outline-none resize-y font-mono"
              placeholder="Write your HTML content here..."
              required
            />
          </div>
          <p className="mt-1 text-xs text-gray-400">Use the toolbar to insert HTML tags, or write HTML directly.</p>
        </div>

        {/* Image & Categories */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Featured Image */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Featured Image</label>
            {imagePreview ? (
              <div className="relative mb-3 group">
                <img src={imagePreview} alt="Preview" className="h-48 w-full rounded-lg object-cover" />
                <button type="button" onClick={() => setExpandedImage(imagePreview)} className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"><Maximize2 className="h-3.5 w-3.5" /></button>
                <button type="button" onClick={() => { setImage(""); setImagePreview(""); }} className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"><X className="h-4 w-4" /></button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-8 hover:border-blue-400 hover:bg-blue-50/50 transition-colors">
                <Upload className="mb-2 h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-500">Click to upload & crop image</span>
                <span className="mt-1 text-xs text-gray-400">JPEG, PNG, WebP • Maks. 5MB • Rasio 16:9 (1920×1080 px)</span>
                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImageUpload} className="hidden" />
              </label>
            )}
            {uploading && <div className="mt-2 flex items-center gap-2 text-sm text-blue-600"><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</div>}
          </div>

          {/* Categories */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Categories</label>
            {categories.length === 0 ? (
              <p className="text-sm text-gray-400">No categories available. Create one first.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      selectedCategoryIds.includes(cat.id)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {cat.nameId}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Author & Settings */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Author */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Author</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Author Name</label>
                <input type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Author Photo</label>
                <div className="flex items-center gap-3">
                  {authorPhotoPreview ? (
                    <div className="relative group">
                      <img src={authorPhotoPreview} alt="Author" className="h-10 w-10 rounded-full object-cover cursor-pointer" onClick={() => setExpandedAuthorPhoto(authorPhotoPreview)} />
                      <button type="button" onClick={() => setExpandedAuthorPhoto(authorPhotoPreview)} className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"><Maximize2 className="h-3.5 w-3.5" /></button>
                      <button type="button" onClick={() => { setAuthorPhoto(""); setAuthorPhotoPreview(""); }} className="absolute -right-1 -top-1 rounded-full bg-red-500 p-0.5 text-white"><X className="h-3 w-3" /></button>
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                      <Upload className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                  <label className="cursor-pointer rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">
                    Upload Photo
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAuthorPhotoUpload} className="hidden" />
                  </label>
                  {uploadingAuthorPhoto && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
                </div>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Publish Date</label>
                <input type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none" />
                <p className="mt-1 text-xs text-gray-400">Leave empty to use current time when published.</p>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Sort Order</label>
                <input type="number" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none" />
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-6">
          <button type="button" onClick={() => router.back()} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Publishing..." : status === "published" ? "Publish Now" : "Save Draft"}
          </button>
        </div>
      </form>

      {expandedImage && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm" onClick={() => setExpandedImage(null)}>
          <button className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20" onClick={() => setExpandedImage(null)}><X className="h-6 w-6" /></button>
          <div className="relative flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img src={expandedImage} alt="Preview" className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl" />
          </div>
        </div>
      )}

      {cropModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="mx-auto w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Crop Image</h3>
              <button onClick={() => { setCropModalOpen(false); setRawImageSrc(""); }} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="relative h-64 w-full overflow-hidden rounded-lg bg-black/5">
              <Cropper image={rawImageSrc} crop={crop} zoom={zoom} aspect={16 / 9} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={handleCropComplete} />
            </div>
            <div className="mt-4 flex items-center gap-4">
              <span className="text-sm font-medium text-gray-600">Zoom:</span>
              <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600" />
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => { setCropModalOpen(false); setRawImageSrc(""); }} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleApplyCrop} disabled={uploading} className="inline-flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 disabled:opacity-50">
                {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
                {uploading ? "Uploading..." : "Apply Crop"}
              </button>
            </div>
          </div>
        </div>
      )}

      {expandedAuthorPhoto && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm" onClick={() => setExpandedAuthorPhoto(null)}>
          <button className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20" onClick={() => setExpandedAuthorPhoto(null)}><X className="h-6 w-6" /></button>
          <div className="relative flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img src={expandedAuthorPhoto} alt="Author" className="max-h-[85vh] max-w-[90vw] rounded-full object-contain shadow-2xl" />
          </div>
        </div>
      )}

      {authorCropOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="mx-auto w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Crop Author Photo</h3>
              <button onClick={() => { setAuthorCropOpen(false); setAuthorRawSrc(""); }} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="relative h-64 w-full overflow-hidden rounded-lg bg-black/5">
              <Cropper image={authorRawSrc} crop={authorCrop} zoom={authorZoom} aspect={1} cropShape="round" onCropChange={setAuthorCrop} onZoomChange={setAuthorZoom} onCropComplete={handleAuthorCropComplete} />
            </div>
            <div className="mt-4 flex items-center gap-4">
              <span className="text-sm font-medium text-gray-600">Zoom:</span>
              <input type="range" min={1} max={3} step={0.1} value={authorZoom} onChange={(e) => setAuthorZoom(parseFloat(e.target.value))} className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600" />
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => { setAuthorCropOpen(false); setAuthorRawSrc(""); }} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleAuthorApplyCrop} disabled={uploadingAuthorPhoto} className="inline-flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 disabled:opacity-50">
                {uploadingAuthorPhoto && <Loader2 className="h-4 w-4 animate-spin" />}
                {uploadingAuthorPhoto ? "Uploading..." : "Apply Crop"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
