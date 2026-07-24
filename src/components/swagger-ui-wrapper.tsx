"use client";

import dynamic from "next/dynamic";

const SwaggerUIWrapper = dynamic(() => import("@/components/swagger-ui"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 items-center justify-center">
      <div className="text-gray-500">Loading API docs...</div>
    </div>
  ),
});

export default function SwaggerUIClient() {
  return <SwaggerUIWrapper />;
}
