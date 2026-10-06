import { readdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import AboutPage from "@/components/pages/about-page";
import { getActiveGalleryImages, type GalleryImage } from "@/lib/gallery";

// Karena berbasis file statis yang diubah secara dinamis, pastikan halaman tidak di cache permanen
export const dynamic = "force-dynamic";

const UPLOAD_DIR = path.join(process.cwd(), "public/img/about");
const GALLERY_DIR = path.join(process.cwd(), "public");

export default async function PublicAboutPage() {
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

  // Ambil gallery dari database, lalu buang entri yang filenya sudah tidak ada di folder upload.
  // Jika hasilnya kosong, AboutPage akan memakai foto dummy.
  let galleryImages: GalleryImage[] = [];
  try {
    const activeImages = await getActiveGalleryImages();
    galleryImages = activeImages.filter((img) =>
      existsSync(path.join(GALLERY_DIR, img.path))
    );
  } catch (error) {
    console.error("Gagal mengambil gallery dari database", error);
  }

  return (
    <AboutPage
      founderImage={founderImage}
      galleryImages={galleryImages}
    />
  );
}
