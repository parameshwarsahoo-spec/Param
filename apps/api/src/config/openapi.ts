export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Personal Expense Tracker API",
    version: "0.1.0"
  },
  servers: [{ url: "/api/v1" }],
  security: [{ bearerAuth: [] }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
    }
  },
  paths: {
    "/auth/signup": { post: { summary: "Create a user account" } },
    "/auth/login": { post: { summary: "Login with email and password" } },
    "/auth/refresh": { post: { summary: "Rotate refresh token" } },
    "/expenses": { get: { summary: "List expenses" }, post: { summary: "Create expense" } },
    "/expenses/{id}": { get: { summary: "Get expense" }, patch: { summary: "Update expense" }, delete: { summary: "Delete expense" } },
    "/income": { get: { summary: "List income" }, post: { summary: "Create income" } },
    "/budgets": { get: { summary: "List budgets" }, post: { summary: "Create budget" } },
    "/analytics/summary": { get: { summary: "Dashboard financial summary" } },
    "/analytics/insights": { get: { summary: "Smart financial insights" } },
    "/reports": { post: { summary: "Generate report" } }
  }
};
