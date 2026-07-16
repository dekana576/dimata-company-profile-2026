"use client";

import Link from "next/link";
import { Calendar, MapPin, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface Event {
  id: number;
  slug: string;
  title: string;
  description: string;
  content: string | null;
  image: string | null;
  location: string | null;
  startDate: Date;
  endDate: Date;
  category: string | null;
  status: string;
}

export function EventDetailPage({ event }: { event: Event }) {
  const { t } = useLanguage();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      upcoming: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300", label: "Upcoming" },
      ongoing: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300", label: "Ongoing" },
      completed: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-300", label: "Completed" },
    };
    return badges[status] || badges.upcoming;
  };

  const statusBadge = getStatusBadge(event.status);

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-separator bg-background py-4">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-foreground/50">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/events" className="hover:text-foreground transition-colors">
              Events
            </Link>
            <span>/</span>
            <span className="text-foreground/70 truncate">{event.title}</span>
          </nav>
        </div>
      </div>

      {/* Back Link */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("events.detail.back")}
        </Link>
      </div>

      {/* Event Content */}
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-20">
        {/* Cover Image */}
        {event.image && (
          <div className="mb-8 overflow-hidden rounded-xl">
            <img
              src={event.image}
              alt={event.title}
              loading="lazy"
              className="h-auto max-h-[400px] w-full object-cover"
            />
          </div>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
            {statusBadge.label}
          </span>
          {event.category && (
            <span className="inline-flex items-center rounded-full bg-foreground/5 px-3 py-1 text-xs font-medium text-foreground/60">
              {event.category}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {event.title}
        </h1>

        {/* Date & Location */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-foreground/60">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              {formatDate(event.startDate)}, {formatTime(event.startDate)}
              {" — "}
              {formatDate(event.endDate)}, {formatTime(event.endDate)}
            </span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-foreground mb-3">About the Event</h2>
          <p className="text-foreground/70 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Content */}
        {event.content && (
          <div className="mt-8 prose prose-foreground max-w-none">
            <div dangerouslySetInnerHTML={{ __html: event.content }} />
          </div>
        )}
      </article>
    </div>
  );
}
