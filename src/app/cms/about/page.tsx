"use client";

import { useState, useEffect } from "react";
import { Upload, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";

export default function CmsAboutPage() {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Ambil gambar saat ini
  const fetchImage = async () => {
    try {
      const res = await fetch("/api/about/founder");
      const data = await res.json();
      setCurrentImage(data.image);
    } catch (error) {
      console.error("Error fetching image", error);
    }
  };

  useEffect(() => {
    fetchImage();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/about/founder", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (res.ok) {
        setCurrentImage(data.image);
        setFile(null);
        setMessage("Gambar berhasil diperbarui!");
      } else {
        setMessage(data.error || "Gagal upload gambar.");
      }
    } catch (error) {
      setMessage("Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus gambar ini?")) return;
    
    setIsLoading(true);
    try {
      const res = await fetch("/api/about/founder", { method: "DELETE" });
      if (res.ok) {
        setCurrentImage(null);
        setMessage("Gambar berhasil dihapus.");
      }
    } catch (error) {
      setMessage("Gagal menghapus gambar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Kelola Halaman About</h1>
      
      <div className="bg-card border rounded-xl p-6 max-w-xl">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Foto Founder</h2>
        
        {message && (
          <div className="mb-4 p-3 bg-primary/10 text-primary rounded-lg text-sm">
            {message}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Tampilan Gambar Saat Ini */}
          <div className="w-full md:w-1/2">
            <p className="text-sm text-muted-foreground mb-2">Gambar saat ini:</p>
            <div className="aspect-[3/4] w-48 bg-muted rounded-lg overflow-hidden border flex items-center justify-center relative group">
              {currentImage ? (
                <>
                  <img src={currentImage} alt="Founder" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={handleDelete}
                      disabled={isLoading}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                      title="Hapus Gambar"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <ImageIcon className="w-10 h-10 text-muted-foreground/30" />
              )}
            </div>
          </div>

          {/* Form Upload */}
          <form onSubmit={handleUpload} className="w-full md:w-1/2 flex flex-col gap-4">
            <div>
              <label className="text-sm text-muted-foreground block mb-2">Upload Gambar Baru:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
              <p className="text-xs text-muted-foreground mt-2">Gambar sebelumnya akan otomatis tertimpa/terhapus.</p>
            </div>
            
            <button
              type="submit"
              disabled={!file || isLoading}
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 px-4 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
              {isLoading ? "Mengunggah..." : "Upload & Simpan"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}