# CampusFix 🛠️

### Campus Complaint & Maintenance Management System

A beginner-friendly, production-ready MERN stack web application that streamlines reporting, reviewing, assigning, and resolving campus maintenance issues such as broken fans, water leakages, Wi-Fi outages, and classroom infrastructure defects.

---

## 📋 Table of Contents
1. [Problem Statement](#problem-statement)
2. [Application Workflow](#application-workflow)
3. [User Roles & Permissions](#user-roles--permissions)
4. [Tech Stack](#tech-stack)
5. [System Architecture](#system-architecture)
6. [Project Structure](#project-structure)
7. [Database Models](#database-models)
8. [REST API Endpoints](#rest-api-endpoints)
9. [Local Setup Guide](#local-setup-guide)
10. [Database Setup (MongoDB Atlas)](#database-setup-mongodb-atlas)
11. [Environment Variables](#environment-variables)
12. [Seed Data & Demo Credentials](#seed-data--demo-credentials)
13. [Render Deployment Guide](#render-deployment-guide)
14. [Future Improvements](#future-improvements)

---

## 1. Problem Statement

Students frequently face everyday campus maintenance problems:
* Broken ceiling fans & flickering tubelights
* Wi-Fi router failures & slow connectivity
* Washroom plumbing leakages & drinking cooler faults
* Broken furniture in classrooms and lecture halls
* Hygiene and sanitization problems

Traditionally, students report these issues through informal WhatsApp groups, verbal complaints, or phone calls. These methods lack traceability, accountability, and status updates.

**CampusFix** solves this by providing a unified, transparent digital grievance pipeline where students lodge issues, administrators review and assign appropriate staff, and maintenance personnel resolve tickets with transparent resolution notes.

---

## 2. Application Workflow

```text
       Student
          ↓
  [Create Complaint] (Status: Pending)
          ↓
     Admin Review
          ↓
  [Assign Staff Member] (Status: Assigned)
          ↓
    Staff Action
          ↓
   [Work on Issue] (Status: In Progress)
          ↓
  [Submit Resolution Note] (Status: Resolved)
          ↓
Student Sees Fixed Status & Resolution Remarks
```

---

## 3. User Roles & Permissions

| Role | Permissions |
| :--- | :--- |
| **Student** | • Register personal student account & login<br>• Create maintenance complaints (Title, Category, Location, Priority, Description)<br>• View personal complaints & real-time status<br>• View complaint details & staff resolution notes<br>• Cancel (delete) complaints if still in **Pending** state |
| **Admin** | • Secure login<br>• View campus-wide complaints across all departments<br>• Live dashboard metrics (Total, Pending, In Progress, Resolved)<br>• Filter complaints by Status, Category, and Priority<br>• Search complaints by title or student name<br>• Assign specific staff members to complaints<br>• Update priority & override status |
| **Staff** | • Secure login<br>• View exclusively tasks assigned to them<br>• Change complaint status to **In Progress**<br>• Mark complaint as **Resolved** by writing an explanatory Resolution Note |

---

## 4. Tech Stack

### Frontend
* **React (v18)** — Component-based user interface
* **Vite** — High-performance frontend build tool
* **Tailwind CSS** — Clean, modern, responsive styling
* **React Router (v6)** — Client-side route management
* **Axios** — HTTP client with Bearer token interceptor
* **Lucide React** — Lightweight, modern icon library

### Backend
* **Node.js** & **Express.js** — RESTful API web framework
* **MongoDB** & **Mongoose** — Document database & ODM
* **JSON Web Token (JWT)** — Stateless user session authentication
* **bcryptjs** — Industry-standard salted password hashing
* **cors** — Cross-Origin Resource Sharing middleware
* **dotenv** — Environment configuration loader

---

## 5. System Architecture

```text
┌────────────────────────────────────────────────────────┐
│                   Web Browser Client                   │
│             React + Vite + Tailwind CSS                │
└───────────────────────────┬────────────────────────────┘
                            │ HTTPS / REST (JWT Auth)
                            ▼
┌────────────────────────────────────────────────────────┐
│              Render Express API Web Service            │
│         AuthMiddleware ── Router ── Controllers        │
└───────────────────────────┬────────────────────────────┘
                            │ Mongoose TCP Connection
                            ▼
┌────────────────────────────────────────────────────────┐
│                  MongoDB Atlas Cloud                   │
│             (Users & Complaints Collections)           │
└────────────────────────────────────────────────────────┘
```

---

## 6. Project Structure

```text
CampusFix/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── ComplaintCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── CreateComplaint.jsx
│   │   │   ├── ComplaintDetails.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── StaffDashboard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   ├── package.json
│   ├── .env.example
│   └── .env
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── complaintController.js
│   │   ├── adminController.js
│   │   └── staffController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Complaint.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── complaintRoutes.js
│   │   ├── adminRoutes.js
│   │   └── staffRoutes.js
│   ├── seed.js
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── .env
│
├── .gitignore
└── README.md
```

---

## 7. Database Models

### User Model (`server/models/User.js`)
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin', 'staff'], default: 'student' },
  createdAt: { type: Date, default: Date.now }
}
```

### Complaint Model (`server/models/Complaint.js`)
```javascript
{
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['Electrical', 'Internet/Wi-Fi', 'Plumbing', 'Cleaning', 'Hostel', 'Classroom', 'Furniture', 'Other'],
    required: true
  },
  location: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: {
    type: String,
    enum: ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Rejected'],
    default: 'Pending'
  },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  resolutionNote: { type: String, default: '' },
  adminNote: { type: String, default: '' },
  createdAt: { type: Date },
  updatedAt: { type: Date }
}
```

---

## 8. REST API Endpoints

### Authentication
* `POST /api/auth/register` — Register a student account
* `POST /api/auth/login` — Log in with email and password
* `GET /api/auth/me` — Fetch currently authenticated user session

### Complaints (Student & General)
* `POST /api/complaints` — Submit a new complaint (Student)
* `GET /api/complaints` — Fetch complaints (Student gets own, Admin gets all)
* `GET /api/complaints/:id` — Get single complaint details
* `PUT /api/complaints/:id` — Update complaint details
* `DELETE /api/complaints/:id` — Cancel complaint (Pending only)

### Admin Operations
* `GET /api/admin/stats` — Dashboard metrics & complaint counts
* `GET /api/admin/staff` — List of all staff members for assignment
* `PUT /api/admin/complaints/:id/assign` — Assign complaint to staff
* `PUT /api/admin/complaints/:id/priority` — Update priority
* `PUT /api/admin/complaints/:id/status` — Update complaint status

### Staff Operations
* `GET /api/staff/complaints` — Fetch complaints assigned to logged-in staff
* `PUT /api/staff/complaints/:id/status` — Update status to In Progress
* `PUT /api/staff/complaints/:id/resolve` — Mark complaint Resolved with resolution note

---

## 9. Local Setup Guide

### Prerequisites
* **Node.js** (v18 or higher)
* **npm** (v9 or higher)
* A running MongoDB instance or a free **MongoDB Atlas** database URI

### 1. Clone the repository
```bash
git clone https://github.com/gulshan29-kumar/collage_complaint_website.git
cd collage_complaint_website
```

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
```
Edit `server/.env` and provide your `MONGO_URI` and `JWT_SECRET`.

Populate initial demo data:
```bash
npm run seed
```

Start backend development server:
```bash
npm run dev
# Server will run on http://localhost:5000
```

### 3. Frontend Setup
Open a second terminal window:
```bash
cd client
npm install
cp .env.example .env
```

Start frontend Vite development server:
```bash
npm run dev
# Client will run on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## 10. Database Setup (MongoDB Atlas)

To use MongoDB Atlas (Cloud):

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in.
2. Create a **Free Shared Cluster (M0)**.
3. Under **Security → Database Access**, create a database user:
   * Example username: `campusadmin`
   * Secure password: `<your_password>`
   * Role: `Read and write to any database`
4. Under **Security → Network Access**, add IP address:
   * Select `Allow Access from Anywhere` (`0.0.0.0/0`) so Render can connect.
5. Under **Deployments → Database → Connect**:
   * Choose **Drivers (Node.js)**.
   * Copy the connection string, for example:
     ```text
     mongodb+srv://campusadmin:<password>@cluster0.abcde.mongodb.net/campusfix?retryWrites=true&w=majority
     ```
   * Replace `<password>` with your database user's password.
6. Paste this URI into `server/.env` as `MONGO_URI`.

---

## 11. Environment Variables

### Backend (`server/.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Port for Express server | `5000` |
| `MONGO_URI` | MongoDB connection URI string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for signing JWTs | `campusfix_jwt_secret_2026` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Frontend (`client/.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base URL of Express backend API | `http://localhost:5000` |

---

## 12. Seed Data & Demo Credentials

To populate demo accounts and 9 sample complaints, run:
```bash
cd server
npm run seed
```

> **Note:** These credentials are for demonstration and testing purposes.

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@campusfix.com` | `Admin@123` |
| **Staff** | `staff@campusfix.com` | `Staff@123` |
| **Student** | `student@campusfix.com` | `Student@123` |

*(The login page also includes 1-click Quick Fill demo buttons for convenient evaluation)*

---

## 13. Render Deployment Guide

### Deploying the Backend (Render Web Service)
1. In your Render Dashboard, click **New + → Web Service**.
2. Connect your GitHub repository.
3. Configure the settings:
   * **Name**: `campusfix-api`
   * **Root Directory**: `server`
   * **Environment**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `npm start`
4. Under **Environment Variables**, add:
   * `MONGO_URI` = `<Your MongoDB Atlas Connection String>`
   * `JWT_SECRET` = `<Your Secure Random Secret>`
   * `CLIENT_URL` = `<Your Deployed Frontend Render URL, e.g. https://campusfix.onrender.com>`
   * `PORT` = `10000` (or leave default, Render sets `PORT` automatically)
5. Click **Create Web Service**.
6. Copy your deployed backend service URL (e.g. `https://campusfix-api.onrender.com`).

---

### Deploying the Frontend (Render Static Site)
1. In your Render Dashboard, click **New + → Static Site**.
2. Connect your GitHub repository.
3. Configure the settings:
   * **Name**: `campusfix-client`
   * **Root Directory**: `client`
   * **Build Command**: `npm install && npm run build`
   * **Publish Directory**: `dist`
4. Under **Environment Variables**, add:
   * `VITE_API_URL` = `https://campusfix-api.onrender.com` (Your backend Render URL without trailing slash)
5. Under **Redirects/Rewrites**:
   * Add a Rewrite rule for single-page applications:
     * **Source**: `/*`
     * **Destination**: `/index.html`
     * **Action**: `Rewrite`
6. Click **Create Static Site**.

---

## 14. Future Improvements
* Email notifications on status updates (Nodemailer)
* Photo/image attachment uploads via Cloudinary or S3
* Student satisfaction rating (1-5 stars) upon complaint resolution
* Department-level PDF report generation for annual audits

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
