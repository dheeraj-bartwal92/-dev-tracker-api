const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Dev Tracker API",
    version: "1.0.0",
    description: "OpenAPI documentation for authentication, project, and task endpoints"
  },
  servers: [{ url: "http://localhost:3000", description: "Local server" }],
  tags: [{ name: "Auth" }, { name: "Projects" }, { name: "Tasks" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    parameters: {
      projectId: {
        name: "projectId",
        in: "path",
        required: true,
        description: "MongoDB ObjectId of the project",
        schema: { type: "string", example: "65f1b80a345d7f17b82f7d31" }
      },
      taskId: {
        name: "taskId",
        in: "path",
        required: true,
        description: "MongoDB ObjectId of the task",
        schema: { type: "string", example: "65f1b8fd345d7f17b82f7d45" }
      },
      commentId: {
        name: "commentId",
        in: "path",
        required: true,
        description: "MongoDB ObjectId of the task comment",
        schema: { type: "string", example: "65f1b9e4345d7f17b82f7d89" }
      },
      userId: {
        name: "userId",
        in: "path",
        required: true,
        description: "MongoDB ObjectId of the user/member",
        schema: { type: "string", example: "65f1b7b3345d7f17b82f7d11" }
      }
    },
    schemas: {
      AuthRegisterRequest: {
        type: "object",
        required: ["name", "userName", "email", "password"],
        properties: {
          name: { type: "string", example: "John Doe" },
          userName: { type: "string", example: "john_doe" },
          email: { type: "string", format: "email", example: "john@example.com" },
          password: { type: "string", format: "password", example: "StrongPass#123" }
        }
      },
      AuthLoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "john@example.com" },
          password: { type: "string", format: "password", example: "StrongPass#123" }
        }
      },
      RefreshTokenRequest: {
        type: "object",
        required: ["refreshToken"],
        properties: {
          refreshToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh.token" }
        }
      },
      ProjectCreateRequest: {
        type: "object",
        required: ["title"],
        properties: {
          title: { type: "string", example: "Tracker API" },
          description: { type: "string", example: "Backend for tracking team work" }
        }
      },
      ProjectUpdateRequest: {
        type: "object",
        properties: {
          title: { type: "string", example: "Tracker API v2" },
          description: { type: "string", example: "Updated description" }
        }
      },
      AddMemberRequest: {
        type: "object",
        required: ["memberId"],
        properties: {
          memberId: { type: "string", example: "65f1b7b3345d7f17b82f7d11" }
        }
      },
      TaskCreateRequest: {
        type: "object",
        required: ["title", "project"],
        properties: {
          title: { type: "string", example: "Implement pagination" },
          description: { type: "string", example: "Add cursor based pagination to tasks API" },
          project: { type: "string", example: "65f1b80a345d7f17b82f7d31" },
          assignee: { type: "string", nullable: true, example: "65f1b7b3345d7f17b82f7d11" },
          status: { type: "string", enum: ["todo", "in-progress", "on-hold", "done"], example: "todo" },
          priority: { type: "string", enum: ["low", "medium", "high", "critical", "blocker"], example: "high" },
          type: { type: "string", enum: ["bug", "story", "epic", "task"], example: "task" },
          dueDate: { type: "string", format: "date-time", example: "2026-12-31T23:59:59.000Z" }
        }
      },
      TaskPatchRequest: {
        type: "object",
        properties: {
          title: { type: "string", example: "Implement secure pagination" },
          description: { type: "string", example: "Also include auth checks" },
          status: { type: "string", enum: ["todo", "in-progress", "on-hold", "done"], example: "in-progress" },
          priority: { type: "string", enum: ["low", "medium", "high", "critical", "blocker"], example: "medium" },
          type: { type: "string", enum: ["bug", "story", "epic", "task"], example: "bug" },
          assignee: { type: "string", nullable: true, example: "65f1b7b3345d7f17b82f7d11" },
          dueDate: { type: "string", format: "date-time", example: "2026-12-31T23:59:59.000Z" }
        }
      },
      AssignTaskRequest: {
        type: "object",
        required: ["assigneeId"],
        properties: {
          assigneeId: { type: "string", example: "65f1b7b3345d7f17b82f7d11" }
        }
      },
      CommentRequest: {
        type: "object",
        required: ["body"],
        properties: {
          body: { type: "string", example: "Please prioritize this task." }
        }
      }
    }
  },
  paths: {
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register user",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/AuthRegisterRequest" } } }
        },
        responses: { 201: { description: "User created" } }
      }
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/AuthLoginRequest" } } }
        },
        responses: { 200: { description: "Login success" } }
      }
    },
    "/api/auth/refresh-token": {
      post: {
        tags: ["Auth"],
        summary: "Refresh access token",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RefreshTokenRequest" } } }
        },
        responses: { 200: { description: "Token refreshed" } }
      }
    },
    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout user",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RefreshTokenRequest" } } }
        },
        responses: { 200: { description: "Logged out" } }
      }
    },
    "/api/projects": {
      post: {
        tags: ["Projects"],
        summary: "Create project",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ProjectCreateRequest" } } }
        },
        responses: { 201: { description: "Project created" } }
      },
      get: {
        tags: ["Projects"],
        summary: "Get projects",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Projects fetched" } }
      }
    },
    "/api/projects/{projectId}": {
      put: {
        tags: ["Projects"],
        summary: "Update project",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/projectId" }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ProjectUpdateRequest" } } }
        },
        responses: { 200: { description: "Project updated" } }
      },
      delete: {
        tags: ["Projects"],
        summary: "Delete project",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/projectId" }],
        responses: { 200: { description: "Project deleted" } }
      }
    },
    "/api/projects/{projectId}/members": {
      post: {
        tags: ["Projects"],
        summary: "Add member",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/projectId" }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/AddMemberRequest" } } }
        },
        responses: { 200: { description: "Member added" } }
      },
      get: {
        tags: ["Projects"],
        summary: "Get members",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/projectId" }],
        responses: { 200: { description: "Members fetched" } }
      }
    },
    "/api/projects/{projectId}/members/{userId}": {
      delete: {
        tags: ["Projects"],
        summary: "Remove member",
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: "#/components/parameters/projectId" },
          { $ref: "#/components/parameters/userId" }
        ],
        responses: { 200: { description: "Member removed" } }
      }
    },
    "/api/tasks": {
      post: {
        tags: ["Tasks"],
        summary: "Create task",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/TaskCreateRequest" } } }
        },
        responses: { 201: { description: "Task created" } }
      }
    },
    "/api/tasks/project/{projectId}": {
      get: {
        tags: ["Tasks"],
        summary: "Get tasks by project",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/projectId" }],
        responses: { 200: { description: "Tasks fetched" } }
      }
    },
    "/api/tasks/{taskId}": {
      get: {
        tags: ["Tasks"],
        summary: "Get task",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/taskId" }],
        responses: { 200: { description: "Task fetched" } }
      },
      patch: {
        tags: ["Tasks"],
        summary: "Update task",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/taskId" }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/TaskPatchRequest" } } }
        },
        responses: { 200: { description: "Task updated" } }
      },
      delete: {
        tags: ["Tasks"],
        summary: "Delete task",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/taskId" }],
        responses: { 200: { description: "Task deleted" } }
      }
    },
    "/api/tasks/{taskId}/assign": {
      patch: {
        tags: ["Tasks"],
        summary: "Assign task",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/taskId" }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/AssignTaskRequest" } } }
        },
        responses: { 200: { description: "Task assigned" } }
      }
    },
    "/api/tasks/{taskId}/unassign": {
      patch: {
        tags: ["Tasks"],
        summary: "Unassign task",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/taskId" }],
        responses: { 200: { description: "Task unassigned" } }
      }
    },
    "/api/tasks/{taskId}/comments": {
      post: {
        tags: ["Tasks"],
        summary: "Add comment",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/taskId" }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CommentRequest" } } }
        },
        responses: { 201: { description: "Comment added" } }
      },
      get: {
        tags: ["Tasks"],
        summary: "Get comments",
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/taskId" }],
        responses: { 200: { description: "Comments fetched" } }
      }
    },
    "/api/tasks/{taskId}/comments/{commentId}": {
      patch: {
        tags: ["Tasks"],
        summary: "Update comment",
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: "#/components/parameters/taskId" },
          { $ref: "#/components/parameters/commentId" }
        ],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CommentRequest" } } }
        },
        responses: { 200: { description: "Comment updated" } }
      },
      delete: {
        tags: ["Tasks"],
        summary: "Delete comment",
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: "#/components/parameters/taskId" },
          { $ref: "#/components/parameters/commentId" }
        ],
        responses: { 200: { description: "Comment deleted" } }
      }
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
          dom_id: '#swagger-ui',
          deepLinking: true
        });
      };
    </script>
  </body>
</html>`);
  });
};

module.exports = setupSwagger;
