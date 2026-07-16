import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EventDetailPage } from "@/components/pages/event-detail-page";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getEvent(slug: string) {
  const event = await prisma.event.findUnique({
    where: { slug, isActive: true },
  });
  return event;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) {
    return {
      title: "Event Not Found | DIMATA IT Solutions",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dimata.com";
  const eventUrl = `${baseUrl}/events/${event.slug}`;

  return {
    title: `${event.title} | DIMATA IT Solutions`,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      url: eventUrl,
      siteName: "DIMATA IT Solutions",
      images: event.image ? [
        {
          url: event.image.startsWith("http") ? event.image : `${baseUrl}${event.image}`,
          width: 1200,
          height: 630,
          alt: event.title,
        },
      ] : [],
      locale: "id_ID",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: event.description,
      images: event.image ? [
        event.image.startsWith("http") ? event.image : `${baseUrl}${event.image}`,
      ] : [],
    },
    alternates: {
      canonical: eventUrl,
    },
  };
}

export default async function EventDetail({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) {
    notFound();
  }

  return <EventDetailPage event={event} />;
}
