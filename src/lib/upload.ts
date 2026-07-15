import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads", "gallery");
const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_WIDTH = 1920;

export async function ensureUploadDir(): Promise<void> {
  await mkdir(UPLOAD_DIR, { recursive: true });
}

export function generateFilename(originalName: string): string {
  const ext = originalName.split(".").pop() || "jpg";
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `gallery-${timestamp}-${random}.${ext}`;
}

export async function saveFile(
  buffer: Buffer,
  filename: string
): Promise<string> {
  await ensureUploadDir();
  const filePath = join(UPLOAD_DIR, filename);
  await writeFile(filePath, buffer);
  return `/uploads/gallery/${filename}`;
}

export function isImageFile(mimetype: string): boolean {
  return ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
    mimetype
  );
}

export { MAX_SIZE, MAX_WIDTH, UPLOAD_DIR };
