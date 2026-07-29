import { NextResponse } from "next/server";
import { writeFile, readdir, unlink, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

// Path direktori penyimpanan: public/img/about
const UPLOAD_DIR = path.join(process.cwd(), "public/img/about");

// Fungsi helper untuk memastikan folder ada
async function ensureDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

// READ: Mendapatkan gambar saat ini
export async function GET() {
  try {
    await ensureDir();
    const files = await readdir(UPLOAD_DIR);
    if (files.length > 0) {
      // Mengambil file pertama di dalam folder
      return NextResponse.json({ image: `/img/about/${files[0]}` });
    }
    return NextResponse.json({ image: null });
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil gambar" }, { status: 500 });
  }
}

// CREATE / UPDATE: Mengunggah gambar baru & hapus yang lama
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;
    
    if (!file) {
      return NextResponse.json({ error: "Tidak ada file yang diunggah" }, { status: 400 });
    }

    await ensureDir();

    // Hapus semua file (gambar lama) di folder img/about
    const existingFiles = await readdir(UPLOAD_DIR);
    for (const oldFile of existingFiles) {
      await unlink(path.join(UPLOAD_DIR, oldFile));
    }

    // Buat nama unik menggunakan timestamp untuk menghindari browser cache
    const ext = file.name.split(".").pop();
    const newFileName = `founder-${Date.now()}.${ext}`;
    const filePath = path.join(UPLOAD_DIR, newFileName);

    // Simpan file baru
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    return NextResponse.json({ 
      image: `/img/about/${newFileName}`, 
      message: "Gambar Founder berhasil diperbarui" 
    });
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengunggah gambar" }, { status: 500 });
  }
}

// DELETE: Menghapus gambar tanpa mengganti
export async function DELETE() {
  try {
    await ensureDir();
    const existingFiles = await readdir(UPLOAD_DIR);
    for (const file of existingFiles) {
      await unlink(path.join(UPLOAD_DIR, file));
    }
    return NextResponse.json({ message: "Gambar berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus gambar" }, { status: 500 });
  }
}