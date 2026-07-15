import AboutPage from "@/components/pages/about-page";
import { getActiveGalleryImages } from "@/lib/gallery";

export default async function About() {
  const galleryImages = await getActiveGalleryImages();
  return <AboutPage galleryImages={galleryImages} />;
}
