"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function SwaggerUIWrapper() {
  return <SwaggerUI url="/api/docs" docExpansion="list" tryItOutEnabled />;
}
