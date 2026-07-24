import type { Metadata } from "next";
import SwaggerUIClient from "@/components/swagger-ui-wrapper";

export const metadata: Metadata = {
  title: "API Documentation - Dimata",
  description: "Interactive API documentation for Dimata Company Profile",
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white">
      <SwaggerUIClient />
    </div>
  );
}
