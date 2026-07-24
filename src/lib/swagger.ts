import swaggerJSDoc from "swagger-jsdoc";
import type { Options } from "swagger-jsdoc";

const options: Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Dimata Company Profile API",
      version: "1.0.0",
      description:
        "REST API for Dimata Company Profile website. Supports cookie-based auth (browser) and Bearer token auth (external apps).",
      contact: {
        name: "Dimata Dev Team",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development",
      },
      {
        url: "http://localhossst:3000",
        description: "Production",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "cms-token",
          description: "JWT token set via login cookie (browser auth)",
        },
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "JWT token from login response body. Use: Authorization: Bearer <token>",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer" },
            email: { type: "string", format: "email" },
            name: { type: "string" },
          },
        },
        Project: {
          type: "object",
          properties: {
            id: { type: "integer" },
            slug: { type: "string" },
            titleId: {
              type: "string",
              description: "Title in Bahasa Indonesia",
            },
            titleEn: { type: "string", description: "Title in English" },
            descriptionId: {
              type: "string",
              description: "Description in Bahasa Indonesia",
            },
            descriptionEn: {
              type: "string",
              description: "Description in English",
            },
            client: { type: "string", nullable: true },
            category: {
              type: "string",
              enum: [
                "Web Application",
                "Mobile App",
                "ERP System",
                "Custom Software",
              ],
            },
            technologies: { type: "string" },
            image: { type: "string", nullable: true },
            status: {
              type: "string",
              enum: ["completed", "ongoing", "upcoming"],
            },
            startDate: { type: "string", format: "date", nullable: true },
            endDate: { type: "string", format: "date", nullable: true },
            externalUrl: { type: "string", format: "uri", nullable: true },
            sortOrder: { type: "integer" },
            isActive: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Event: {
          type: "object",
          properties: {
            id: { type: "integer" },
            title: { type: "string" },
            slug: { type: "string" },
            description: { type: "string" },
            content: { type: "string", nullable: true },
            image: { type: "string", nullable: true },
            location: { type: "string", nullable: true },
            startDate: { type: "string", format: "date" },
            endDate: { type: "string", format: "date" },
            category: { type: "string", nullable: true },
            status: {
              type: "string",
              enum: ["upcoming", "ongoing", "completed"],
            },
            isActive: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        GalleryImage: {
          type: "object",
          properties: {
            id: { type: "integer" },
            filename: { type: "string" },
            originalName: { type: "string" },
            path: { type: "string" },
            description: { type: "string", nullable: true },
            sortOrder: { type: "integer" },
            isActive: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
    tags: [
      { name: "Auth", description: "Authentication (login, logout, me)" },
      { name: "Contact", description: "Contact form" },
      { name: "Gallery", description: "Gallery images" },
      { name: "Events", description: "Events management" },
      { name: "Project", description: "Projects showcase" },
      { name: "Pricing", description: "Pricing management" },
      { name: "Upload", description: "File upload" },
    ],
  },
  apis: ["./src/app/api/**/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
