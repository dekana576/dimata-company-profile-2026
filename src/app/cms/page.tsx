"use client";

import { useEffect, useState } from "react";
import { Image, Activity, Calendar, CheckCircle } from "lucide-react";

interface Stats {
  totalImages: number;
  activeImages: number;
  totalEvents: number;
  activeEvents: number;
}

export default function CmsDashboard() {
  const [stats, setStats] = useState<Stats>({ totalImages: 0, activeImages: 0, totalEvents: 0, activeEvents: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/gallery").then((res) => res.json()),
      fetch("/api/events").then((res) => res.json()),
    ])
      .then(([galleryData, eventsData]) => {
        const images = galleryData.images || [];
        const events = eventsData.events || [];
        setStats({
          totalImages: images.length,
          activeImages: images.filter((img: { isActive: boolean }) => img.isActive).length,
          totalEvents: events.length,
          activeEvents: events.filter((evt: { isActive: boolean }) => evt.isActive).length,
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

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-purple-100 p-3">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-emerald-100 p-3">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Events</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeEvents}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
