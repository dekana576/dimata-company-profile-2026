"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight, Filter } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface Event {
  id: number;
  slug: string;
  title: string;
  description: string;
  image: string | null;
  location: string | null;
  startDate: string;
  endDate: string;
  category: string | null;
  status: string;
}

export function EventsPage() {
  const { t } = useLanguage();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events?active=true");
      const data = await res.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = filter === "all"
    ? events
    : events.filter((event) => event.status === filter);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-foreground/50">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-separator bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {t("events.hero.title")}
            </h1>
            <p className="mt-4 text-lg text-foreground/60">
              {t("events.hero.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="border-b border-separator bg-background py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <Filter className="h-4 w-4 text-foreground/50" />
            {[
              { value: "all", label: "All" },
              { value: "upcoming", label: "Upcoming" },
              { value: "ongoing", label: "Ongoing" },
              { value: "completed", label: "Completed" },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  filter === item.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="mx-auto h-12 w-12 text-foreground/20" />
              <p className="mt-4 text-foreground/50">No events found</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => {
                const statusBadge = getStatusBadge(event.status);
                return (
                  <Link
                    key={event.id}
                    href={`/events/${event.slug}`}
                    className="group relative overflow-hidden rounded-xl border border-separator bg-background transition-all hover:border-primary/30 hover:shadow-lg"
                  >
                    {/* Image */}
                    <div className="aspect-[16/10] overflow-hidden bg-foreground/5">
                      {event.image ? (
                        <img
                          src={event.image}
                          alt={event.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Calendar className="h-12 w-12 text-foreground/10" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                          {statusBadge.label}
                        </span>
                        {event.category && (
                          <span className="inline-flex items-center rounded-full bg-foreground/5 px-2.5 py-0.5 text-xs font-medium text-foreground/60">
                            {event.category}
                          </span>
                        )}
                      </div>

                      <h3 className="font-display text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>

                      <p className="mt-2 text-sm text-foreground/60 line-clamp-2">
                        {event.description}
                      </p>

                      <div className="mt-4 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-foreground/50">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>
                            {formatDate(event.startDate)}
                            {event.startDate !== event.endDate && ` — ${formatDate(event.endDate)}`}
                          </span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2 text-xs text-foreground/50">
                            <MapPin className="h-3.5 w-3.5" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>More information</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
