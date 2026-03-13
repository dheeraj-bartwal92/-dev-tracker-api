const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Dev Tracker API",
    version: "1.0.0",
    description: "Swagger documentation for the Dev Tracker backend APIs"
  },
  servers: [{ url: "http://localhost:3000", description: "Local server" }],
  tags: [{ name: "Auth" }, { name: "Projects" }, { name: "Tasks" }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
    }
  },
  paths: {
    "/api/auth/register": { post: { tags: ["Auth"], summary: "Register a new user", responses: { 201: { description: "User registered" } } } },
    "/api/auth/login": { post: { tags: ["Auth"], summary: "Login user", responses: { 200: { description: "Login successful" } } } },
    "/api/auth/refresh-token": { post: { tags: ["Auth"], summary: "Refresh access token", responses: { 200: { description: "Token refreshed" } } } },
    "/api/auth/logout": { post: { tags: ["Auth"], summary: "Logout current user", security: [{ bearerAuth: [] }], responses: { 200: { description: "Logged out" } } } },
    "/api/projects": {
      post: { tags: ["Projects"], summary: "Create a project", security: [{ bearerAuth: [] }], responses: { 201: { description: "Project created" } } },
      get: { tags: ["Projects"], summary: "Get all projects", security: [{ bearerAuth: [] }], responses: { 200: { description: "Projects fetched" } } }
    },
    "/api/projects/{projectId}": {
      put: { tags: ["Projects"], summary: "Update project", security: [{ bearerAuth: [] }], parameters: [{ in: "path", name: "projectId", required: true, schema: { type: "string" } }], responses: { 200: { description: "Project updated" } } },
      delete: { tags: ["Projects"], summary: "Delete project", security: [{ bearerAuth: [] }], parameters: [{ in: "path", name: "projectId", required: true, schema: { type: "string" } }], responses: { 200: { description: "Project deleted" } } }
    },
    "/api/projects/{projectId}/members": {
      post: { tags: ["Projects"], summary: "Add member", security: [{ bearerAuth: [] }], parameters: [{ in: "path", name: "projectId", required: true, schema: { type: "string" } }], responses: { 200: { description: "Member added" } } },
      get: { tags: ["Projects"], summary: "Get members", security: [{ bearerAuth: [] }], parameters: [{ in: "path", name: "projectId", required: true, schema: { type: "string" } }], responses: { 200: { description: "Members fetched" } } }
    },
    "/api/projects/{projectId}/members/{userId}": {
      delete: { tags: ["Projects"], summary: "Remove member", security: [{ bearerAuth: [] }], parameters: [{ in: "path", name: "projectId", required: true, schema: { type: "string" } }, { in: "path", name: "userId", required: true, schema: { type: "string" } }], responses: { 200: { description: "Member removed" } } }
    },
    "/api/tasks": { post: { tags: ["Tasks"], summary: "Create task", security: [{ bearerAuth: [] }], responses: { 201: { description: "Task created" } } } },
    "/api/tasks/project/{projectId}": { get: { tags: ["Tasks"], summary: "Get tasks by project", security: [{ bearerAuth: [] }], parameters: [{ in: "path", name: "projectId", required: true, schema: { type: "string" } }], responses: { 200: { description: "Tasks fetched" } } } },
    "/api/tasks/{taskId}": {
      get: { tags: ["Tasks"], summary: "Get task by ID", security: [{ bearerAuth: [] }], parameters: [{ in: "path", name: "taskId", required: true, schema: { type: "string" } }], responses: { 200: { description: "Task fetched" } } },
      patch: { tags: ["Tasks"], summary: "Patch task", security: [{ bearerAuth: [] }], parameters: [{ in: "path", name: "taskId", required: true, schema: { type: "string" } }], responses: { 200: { description: "Task updated" } } },
      delete: { tags: ["Tasks"], summary: "Delete task", security: [{ bearerAuth: [] }], parameters: [{ in: "path", name: "taskId", required: true, schema: { type: "string" } }], responses: { 200: { description: "Task deleted" } } }
    },
    "/api/tasks/{taskId}/assign": { patch: { tags: ["Tasks"], summary: "Assign task", security: [{ bearerAuth: [] }], parameters: [{ in: "path", name: "taskId", required: true, schema: { type: "string" } }], responses: { 200: { description: "Task assigned" } } } },
    "/api/tasks/{taskId}/unassign": { patch: { tags: ["Tasks"], summary: "Unassign task", security: [{ bearerAuth: [] }], parameters: [{ in: "path", name: "taskId", required: true, schema: { type: "string" } }], responses: { 200: { description: "Task unassigned" } } } },
    "/api/tasks/{taskId}/comments": {
      post: { tags: ["Tasks"], summary: "Add comment", security: [{ bearerAuth: [] }], parameters: [{ in: "path", name: "taskId", required: true, schema: { type: "string" } }], responses: { 201: { description: "Comment added" } } },
      get: { tags: ["Tasks"], summary: "Get comments", security: [{ bearerAuth: [] }], parameters: [{ in: "path", name: "taskId", required: true, schema: { type: "string" } }], responses: { 200: { description: "Comments fetched" } } }
    },
    "/api/tasks/{taskId}/comments/{commentId}": {
      patch: { tags: ["Tasks"], summary: "Update comment", security: [{ bearerAuth: [] }], parameters: [{ in: "path", name: "taskId", required: true, schema: { type: "string" } }, { in: "path", name: "commentId", required: true, schema: { type: "string" } }], responses: { 200: { description: "Comment updated" } } },
      delete: { tags: ["Tasks"], summary: "Delete comment", security: [{ bearerAuth: [] }], parameters: [{ in: "path", name: "taskId", required: true, schema: { type: "string" } }, { in: "path", name: "commentId", required: true, schema: { type: "string" } }], responses: { 200: { description: "Comment deleted" } } }
    }
  }
};

const setupSwagger = (app) => {
  app.get("/api-docs.json", (req, res) => {
    res.json(swaggerSpec);
  });

  app.get("/api-docs", (req, res) => {
    res.type("html").send(`<!DOCTYPE html>
<html>
  <head>
    <title>Dev Tracker API Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.onload = () => {
        window.ui = SwaggerUIBundle({
          url: '/api-docs.json',
          dom_id: '#swagger-ui'
        });
      };
    </script>
  </body>
</html>`);
  });
};

module.exports = setupSwagger;
