import AboutPage from "@/components/pages/about-page";
import { getActiveGalleryImages } from "@/lib/gallery";

export const revalidate = 60;

export default async function About() {
  const galleryImages = await getActiveGalleryImages();
  return <AboutPage galleryImages={galleryImages} />;
}
