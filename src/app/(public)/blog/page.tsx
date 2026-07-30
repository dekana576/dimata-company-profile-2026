import { BlogPage } from "@/components/pages/blog-page";

export const metadata = {
  title: "Blog | DIMATA IT Solutions",
  description: "Artikel, berita, dan wawasan terbaru seputar transformasi digital, teknologi informasi, dan solusi IT dari DIMATA.",
  openGraph: {
    title: "Blog | DIMATA IT Solutions",
    description: "Artikel, berita, dan wawasan terbaru seputar transformasi digital dan solusi IT.",
  },
};

export default function Blog() {
  return <BlogPage />;
}
