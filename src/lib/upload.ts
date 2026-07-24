import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const GALLERY_UPLOAD_DIR = join(process.cwd(), "public", "uploads", "gallery");
const EVENTS_UPLOAD_DIR = join(process.cwd(), "public", "uploads", "events");
const PROJECTS_UPLOAD_DIR = join(process.cwd(), "public", "uploads", "projects");
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_WIDTH = 1920;

type UploadType = "gallery" | "events" | "projects";

export async function ensureUploadDir(type: UploadType = "gallery"): Promise<void> {
  const dirs: Record<UploadType, string> = {
    gallery: GALLERY_UPLOAD_DIR,
    events: EVENTS_UPLOAD_DIR,
    projects: PROJECTS_UPLOAD_DIR,
  };
  await mkdir(dirs[type], { recursive: true });
}

export function generateFilename(originalName: string, type: UploadType = "gallery"): string {
  const ext = originalName.split(".").pop() || "jpg";
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const prefixes: Record<UploadType, string> = {
    gallery: "gallery",
    events: "event",
    projects: "project",
  };
  return `${prefixes[type]}-${timestamp}-${random}.${ext}`;
}

export async function saveFile(
  buffer: Buffer,
  filename: string,
  type: UploadType = "gallery"
): Promise<string> {
  await ensureUploadDir(type);
  const dirs: Record<UploadType, string> = {
    gallery: GALLERY_UPLOAD_DIR,
    events: EVENTS_UPLOAD_DIR,
    projects: PROJECTS_UPLOAD_DIR,
  };
  const filePath = join(dirs[type], filename);
  await writeFile(filePath, buffer);
  return `/uploads/${type}/${filename}`;
}

export function isImageFile(mimetype: string): boolean {
  return ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
    mimetype
  );
}

export { MAX_SIZE, MAX_WIDTH, GALLERY_UPLOAD_DIR as UPLOAD_DIR, EVENTS_UPLOAD_DIR, PROJECTS_UPLOAD_DIR };
