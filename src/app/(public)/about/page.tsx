import { readdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import AboutPage from "@/components/pages/about-page";

// Karena berbasis file statis yang diubah secara dinamis, pastikan halaman tidak di cache permanen
export const dynamic = "force-dynamic";

export default async function PublicAboutPage() {
  const UPLOAD_DIR = path.join(process.cwd(), "public/img/about");
  
  // Default gambar jika tidak ada
  let founderImage = "/img/founder.jpg"; 

  try {
    if (existsSync(UPLOAD_DIR)) {
      const files = await readdir(UPLOAD_DIR);
      if (files.length > 0) {
        // Ambil path gambar pertama yang ada di folder img/about
        founderImage = `/img/about/${files[0]}`;
      } else {
        founderImage = ""; // Kosong jika benar-benar tidak ada foto
      }
    }
  } catch (error) {
    console.error("Gagal membaca folder gambar founder", error);
  }

  // TODO: Ambil gallery dari database jika Anda menggunakan Prisma
  // const galleryImages = await prisma.gallery.findMany({...})
  const galleryImages: any[] = []; 

  return (
    <AboutPage 
      founderImage={founderImage} 
      galleryImages={galleryImages} 
    />
  );
}