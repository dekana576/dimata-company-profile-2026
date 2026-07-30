"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, Trash2, Image as ImageIcon, Loader2, X } from "lucide-react";
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

export default function CmsAboutPage() {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // State untuk Cropping
  const [imgSrc, setImgSrc] = useState("");
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  // Rasio gambar (3:4 sesuai UI frontend)
  const aspect = 3 / 4;

  // 1. Ambil gambar saat ini
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

  // 2. Handler saat file dipilih (hanya menampilkan ke UI Crop, belum di-upload)
  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Reset crop
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // 3. Menyesuaikan kotak crop ke tengah saat gambar berhasil di-load
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(
      makeAspectCrop({ unit: "%", width: 90 }, aspect, width, height),
      width,
      height
    );
    setCrop(initialCrop);
  };

  // 4. Fungsi memproses potongan gambar menggunakan HTML5 Canvas
  const getCroppedImg = async (
    image: HTMLImageElement,
    crop: PixelCrop
  ): Promise<Blob> => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width;
    canvas.height = crop.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No 2d context");

    // Gambar ulang bagian yang di-crop ke dalam canvas
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    // Ubah canvas menjadi file Blob siap kirim
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve(blob);
      }, "image/jpeg", 0.95); // Quality 95%
    });
  };

  // 5. Eksekusi Upload ke API
  const handleUploadCropped = async () => {
    if (!completedCrop || !imgRef.current) return;

    setIsLoading(true);
    setMessage("");

    try {
      const blob = await getCroppedImg(imgRef.current, completedCrop);
      
      const formData = new FormData();
      // Mengemas blob sebagai file jpg
      formData.append("image", blob, "founder-cropped.jpg");

      const res = await fetch("/api/about/founder", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setCurrentImage(data.image);
        setImgSrc(""); // Tutup mode crop setelah sukses
        setMessage("Gambar berhasil dipotong dan diperbarui!");
      } else {
        setMessage(data.error || "Gagal upload gambar.");
      }
    } catch (error) {
      setMessage("Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  // 6. Delete gambar
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

      <div className="bg-card border rounded-xl p-6 max-w-3xl">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Foto Founder</h2>

        {message && (
          <div className="mb-4 p-3 bg-primary/10 text-primary rounded-lg text-sm">
            {message}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Sisi Kiri: Tampilan Gambar Saat Ini */}
          <div className="w-full md:w-1/3">
            <p className="text-sm text-muted-foreground mb-2">Gambar saat ini:</p>
            <div className="aspect-[3/4] w-full bg-muted rounded-lg overflow-hidden border flex items-center justify-center relative group">
              {currentImage ? (
                <>
                  <img
                    src={currentImage}
                    alt="Founder"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={handleDelete}
                      disabled={isLoading}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition shadow-lg"
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

          {/* Sisi Kanan: Form Upload / Area Cropping */}
          <div className="w-full md:w-2/3 flex flex-col gap-4">
            {!imgSrc ? (
              // Mode Default: Tampilkan input file
              <div className="bg-muted/30 p-6 rounded-xl border border-dashed">
                <label className="text-sm font-medium block mb-3">
                  Upload Gambar Baru (Rasio 3:4)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onSelectFile}
                  className="block w-full text-sm text-foreground file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                  Pilih gambar dari perangkat Anda. Gambar akan dipotong secara proporsional sebelum diunggah agar pas di website.
                </p>
              </div>
            ) : (
              // Mode Cropping: Muncul setelah file dipilih
              <div className="flex flex-col gap-4 bg-muted/20 p-4 rounded-xl border">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Sesuaikan Posisi Gambar</span>
                  <button 
                    onClick={() => setImgSrc("")} 
                    className="text-muted-foreground hover:text-foreground p-1 rounded-md"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Area react-image-crop */}
                <div className="bg-black/5 rounded-lg overflow-hidden flex justify-center max-h-[50vh]">
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={aspect}
                    className="max-h-full"
                  >
                    <img
                      ref={imgRef}
                      alt="Crop preview"
                      src={imgSrc}
                      onLoad={onImageLoad}
                      className="max-h-[50vh] w-auto object-contain"
                    />
                  </ReactCrop>
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setImgSrc("");
                      setCompletedCrop(undefined);
                    }}
                    disabled={isLoading}
                    className="flex-1 py-2.5 px-4 rounded-lg font-medium border border-border bg-background hover:bg-muted transition text-sm"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleUploadCropped}
                    disabled={isLoading || !completedCrop}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 px-4 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition shadow-md text-sm"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    {isLoading ? "Menyimpan..." : "Crop & Simpan"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}