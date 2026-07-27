import { prisma } from "@/lib/prisma";
import { EventDetailPage } from "@/components/pages/event-detail-page";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug, isActive: true },
    select: { title: true, description: true },
  });
  if (!event) return { title: "Event Not Found" };
  return {
    title: `${event.title} | DIMATA IT Solutions`,
    description: event.description,
  };
}

export default async function EventDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug, isActive: true },
  });
  if (!event) notFound();
  return <EventDetailPage event={event} />;
}
