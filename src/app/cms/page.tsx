"use client";

import { useEffect, useState } from "react";
import { Image, Activity } from "lucide-react";

interface Stats {
  totalImages: number;
  activeImages: number;
}

export default function CmsDashboard() {
  const [stats, setStats] = useState<Stats>({ totalImages: 0, activeImages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        const images = data.images || [];
        setStats({
          totalImages: images.length,
          activeImages: images.filter((img: { isActive: boolean }) => img.isActive).length,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-2 text-gray-600">Welcome to Dimata CMS</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-blue-100 p-3">
              <Image className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Images</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalImages}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-green-100 p-3">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Images</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeImages}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
