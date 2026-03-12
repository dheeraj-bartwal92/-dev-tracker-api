# Task Management API

A scalable **RESTful API for project and task management** built with **Node.js, Express, and MongoDB**.
This API enables teams to collaborate on projects, manage tasks efficiently, and control access through project membership and authorization.

---

## 🚀 Features

* 🔐 JWT Authentication
* 📁 Project Management
* ✅ Task Management
* 👥 Project Member Collaboration
* 🛡 Role-based Authorization
* 📦 Modular Architecture (Controller → Service → Model)
* ⚡ Optimized MongoDB queries using Mongoose
* 🧩 RESTful API design

---

## 🛠 Tech Stack

| Technology | Description        |
| ---------- | ------------------ |
| Node.js    | JavaScript runtime |
| Express.js | Backend framework  |
| MongoDB    | NoSQL database     |
| Mongoose   | MongoDB ODM        |
| JWT        | Authentication     |

---

## 📁 Project Structure

```
src
 ├── controllers
 │    ├── authController.js
 │    ├── projectController.js
 │    └── taskController.js
 │
 ├── services
 │    ├── authService.js
 │    ├── projectService.js
 │    └── taskService.js
 │
 ├── models
 │    ├── User.js
 │    ├── Project.js
 │    └── Task.js
 │
 ├── routes
 │    ├── authRoutes.js
 │    ├── projectRoutes.js
 │    └── taskRoutes.js
 │
 ├── middleware
 │    ├── authMiddleware.js
 │    └── errorHandler.js
 │
 └── utils
      └── asyncHandler.js
```

### Architecture

```
Route → Controller → Service → Database
```

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint       | Description        |
| ------ | -------------- | ------------------ |
| POST   | /auth/register | Register user      |
| POST   | /auth/login    | Login user         |
| GET    | /auth/me       | Get logged in user |

---

## Projects

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | /projects            | Create project      |
| GET    | /projects            | Get all projects    |
| GET    | /projects/:projectId | Get project details |
| PATCH  | /projects/:projectId | Update project      |
| DELETE | /projects/:projectId | Delete project      |

---

## Project Members

| Method | Endpoint                             | Description         |
| ------ | ------------------------------------ | ------------------- |
| POST   | /projects/:projectId/members         | Add project member  |
| GET    | /projects/:projectId/members         | Get project members |
| DELETE | /projects/:projectId/members/:userId | Remove member       |

---

## Tasks

| Method | Endpoint                   | Description          |
| ------ | -------------------------- | -------------------- |
| POST   | /projects/:projectId/tasks | Create task               |
| GET    | /projects/:projectId/tasks | Get tasks by project      |
| GET    | /tasks/:taskId             | Get task                  |
| PATCH  | /tasks/:taskId             | Update task               |
| PATCH  | /tasks/:taskId/assign      | Assign task to a user     |
| PATCH  | /tasks/:taskId/unassign    | Remove current assignee   |
| DELETE | /tasks/:taskId             | Delete task               |
| POST   | /tasks/:taskId/comments    | Add comment to task       |
| GET    | /tasks/:taskId/comments    | List task comments        |
| PATCH  | /tasks/:taskId/comments/:commentId | Update own comment |
| DELETE | /tasks/:taskId/comments/:commentId | Delete own comment |

---

# ⚙️ Installation

### Clone the repository

```
git clone https://github.com/your-username/task-management-api.git
cd task-management-api
```

### Install dependencies

```
npm install
```

### Configure environment variables

Create a `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Run the server

```
npm run dev
```

Server runs at:

```
http://localhost:5000
```

---

# 📬 Example API Response

```
GET /projects/:projectId/tasks
```

Response

```json
{
  "success": true,
  "data": [
    {
      "title": "Setup backend",
      "status": "todo"
    }
  ]
}
```

---

# 🔒 Authorization Logic

| Role           | Permissions  |
| -------------- | ------------ |
| Project Owner  | Full access  |
| Project Member | Manage tasks |
| Guest          | Read-only    |

---

# 📈 Future Improvements

* File attachments
* Activity logs
* Notifications
* WebSocket real-time updates
* API rate limiting
* Swagger documentation

---

# 👨‍💻 Author

**Dheeraj Singh**

Backend Developer
