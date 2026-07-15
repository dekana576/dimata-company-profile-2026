import { prisma } from "./prisma";

export interface GalleryImage {
  id: number;
  path: string;
  description: string | null;
}

export async function getActiveGalleryImages(): Promise<GalleryImage[]> {
  try {
    const images = await prisma.galleryImage.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        path: true,
        description: true,
      },
    });
    return images;
  } catch (error) {
    console.error("Failed to fetch gallery images:", error);
    return [];
  }
}
