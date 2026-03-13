# Dev Tracker API

A REST API for team project and task tracking, built with Node.js, Express, and MongoDB.

## Features

- JWT-based authentication
- Project CRUD for authenticated users
- Project member management
- Task CRUD
- Task assignment and unassignment
- Task comments (create, list, update, delete)
- Layered module structure (routes → controller → service → model)

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- `bcryptjs`

## Project Structure

```text
src/
  app.js
  db/db.js
  middleware/
    auth.middleware.js
    error.middleware.js
  modules/
    auth/
    projects/
    task/
    activity/
  utils/
server.js
```

## API Base URL

`/api`

## Endpoints

### Auth

- `POST /api/auth/register` — Register a user
- `POST /api/auth/login` — Login and get token
- `POST /api/auth/logout` — Logout user

### Projects

- `POST /api/projects` — Create project
- `GET /api/projects` — List projects for logged-in user
- `PUT /api/projects/:projectId` — Update project
- `DELETE /api/projects/:projectId` — Delete project
- `POST /api/projects/:projectId/members` — Add a project member
- `GET /api/projects/:projectId/members` — List project members
- `DELETE /api/projects/:projectId/members/:userId` — Remove member

### Tasks

- `POST /api/tasks` — Create task
- `GET /api/tasks/project/:projectId` — Get tasks by project
- `GET /api/tasks/:taskId` — Get task by id
- `PATCH /api/tasks/:taskId` — Update task
- `DELETE /api/tasks/:taskId` — Delete task
- `PATCH /api/tasks/:taskId/assign` — Assign task
- `PATCH /api/tasks/:taskId/unassign` — Unassign task
- `POST /api/tasks/:taskId/comments` — Add task comment
- `GET /api/tasks/:taskId/comments` — List task comments
- `PATCH /api/tasks/:taskId/comments/:commentId` — Update own comment
- `DELETE /api/tasks/:taskId/comments/:commentId` — Delete own comment

## Setup

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 3) Run the app

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Server default URL:

```text
http://localhost:5000
```

## Notes

- The API requires a valid JWT for all project and task routes.
- Include the token in the `Authorization` header as `Bearer <token>`.
