import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const GALLERY_UPLOAD_DIR = join(process.cwd(), "public", "uploads", "gallery");
const EVENTS_UPLOAD_DIR = join(process.cwd(), "public", "uploads", "events");
const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_WIDTH = 1920;

export async function ensureUploadDir(type: "gallery" | "events" = "gallery"): Promise<void> {
  const dir = type === "events" ? EVENTS_UPLOAD_DIR : GALLERY_UPLOAD_DIR;
  await mkdir(dir, { recursive: true });
}

export function generateFilename(originalName: string, type: "gallery" | "events" = "gallery"): string {
  const ext = originalName.split(".").pop() || "jpg";
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const prefix = type === "events" ? "event" : "gallery";
  return `${prefix}-${timestamp}-${random}.${ext}`;
}

export async function saveFile(
  buffer: Buffer,
  filename: string,
  type: "gallery" | "events" = "gallery"
): Promise<string> {
  await ensureUploadDir(type);
  const dir = type === "events" ? EVENTS_UPLOAD_DIR : GALLERY_UPLOAD_DIR;
  const filePath = join(dir, filename);
  await writeFile(filePath, buffer);
  return `/uploads/${type}/${filename}`;
}

export function isImageFile(mimetype: string): boolean {
  return ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
    mimetype
  );
}

export { MAX_SIZE, MAX_WIDTH, GALLERY_UPLOAD_DIR as UPLOAD_DIR, EVENTS_UPLOAD_DIR };
