# CampusFix 🛠️

### Campus Complaint & Maintenance Management System

A beginner-friendly, production-ready **MERN stack** web application that streamlines reporting, reviewing, assigning, and resolving campus maintenance issues such as broken ceiling fans, water leakages, Wi-Fi outages, and classroom infrastructure defects.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Deploy-Render-46E3B7?logo=render&logoColor=black)](https://render.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📋 Table of Contents
1. [Problem Statement](#1-problem-statement)
2. [Application Workflow](#2-application-workflow)
3. [User Roles & Permissions](#3-user-roles--permissions)
4. [Tech Stack](#4-tech-stack)
5. [System Architecture](#5-system-architecture)
6. [Project Structure](#6-project-structure)
7. [Database Models](#7-database-models)
8. [REST API Endpoints](#8-rest-api-endpoints)
9. [Local Setup Guide](#9-local-setup-guide)
10. [Database Setup (MongoDB Atlas)](#10-database-setup-mongodb-atlas)
11. [Environment Variables](#11-environment-variables)
12. [Seed Data & Demo Credentials](#12-seed-data--demo-credentials)
13. [Deployment Guide: Vercel](#13-deployment-guide-vercel)
14. [Deployment Guide: Render](#14-deployment-guide-render)
15. [Interview Guide: How to Explain CampusFix](#15-interview-guide-how-to-explain-campusfix)
16. [Future Improvements](#16-future-improvements)

---

## 1. Problem Statement

Students frequently face everyday campus infrastructure challenges:
* **Electrical:** Broken ceiling fans, flickering tubelights, switchboard sparks
* **Internet/Wi-Fi:** Offline access points, low signal in hostels
* **Plumbing:** Washroom pipe bursts, leaking taps, cold water geysers
* **Classroom & Lab:** Broken projector HDMI pins, damaged audio systems
* **Furniture:** Wobbly benches, broken study desks, damaged chairs
* **Cleaning:** Untended spills, classroom dust, garbage overflow

Traditionally, students report these issues through informal WhatsApp groups, phone calls, or word-of-mouth. These methods result in lost requests, zero accountability, and students left in the dark about progress.

**CampusFix** provides a transparent, single-platform grievance lifecycle:
Students lodge complaints ➔ Admins triage and assign personnel ➔ Staff fix and document resolutions ➔ Students track real-time status.

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
| **Student** | • Register student account and log in<br>• Lodge complaints (Title, Category, Location, Priority, Description)<br>• View personal complaint dashboard with live status cards<br>• View detailed complaint history & staff resolution notes<br>• Cancel (permanently delete) complaints **only** while in `Pending` state |
| **Admin** | • Secure administrative login<br>• Full campus-wide visibility across all departments<br>• High-level metrics: Total, Pending, In Progress, Resolved<br>• Real-time search by complaint title or student name<br>• Multi-criteria filtering by Status, Category, and Priority<br>• Assign complaints to specific maintenance staff<br>• Override priority and grievance status |
| **Staff** | • Secure staff login<br>• Dedicated work queue showing tickets assigned to them<br>• Transition ticket status from `Assigned` to `In Progress`<br>• Close tickets as `Resolved` by submitting an explanatory Resolution Note |

---

## 4. Tech Stack

### Frontend
* **React (v18)** — Component-based architecture with clean React state & Context API
* **Vite** — Sub-second Hot Module Replacement (HMR) & optimized production bundling
* **Tailwind CSS** — Utility-first, clean, modern styling (no heavy UI frameworks)
* **React Router (v6)** — Client-side SPA routing with protected role-based guards
* **Axios** — HTTP client with Bearer token interceptor
* **Lucide React** — Minimalist, professional SVG icon set

### Backend
* **Node.js** & **Express.js** — Modular REST API web service
* **MongoDB** & **Mongoose** — Flexible document store & ODM
* **JSON Web Token (JWT)** — Stateless user authentication
* **bcryptjs** — Salted password hashing (10 rounds)
* **cors** — Cross-Origin Resource Sharing
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
│             Express REST API (Render / Vercel)         │
│         AuthMiddleware ── Router ── Controllers        │
└───────────────────────────┬────────────────────────────┘
                            │ Mongoose Connection
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
├── client/                     # Frontend Application
│   ├── public/
│   │   └── _redirects          # SPA client-side routing rule for Render
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ComplaintCard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── StatusBadge.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global user session & JWT state
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ComplaintDetails.jsx
│   │   │   ├── CreateComplaint.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── StaffDashboard.jsx
│   │   │   └── StudentDashboard.jsx
│   │   ├── services/
│   │   │   └── api.js          # Centralized Axios API service
│   │   ├── App.jsx             # Route definitions & guards
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Tailwind directives
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vercel.json             # Vercel SPA rewrite rules
│   ├── vite.config.js
│   ├── .env.example
│   └── .env
│
├── server/                     # Backend Application
│   ├── config/
│   │   └── db.js               # MongoDB connection with serverSelectionTimeout
│   ├── controllers/            # Controller logic
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── complaintController.js
│   │   └── staffController.js
│   ├── middleware/             # Middleware
│   │   ├── authMiddleware.js   # JWT protect middleware
│   │   └── roleMiddleware.js   # Role authorization middleware
│   ├── models/                 # Database Schemas
│   │   ├── Complaint.js
│   │   └── User.js
│   ├── routes/                 # Express Routers
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── complaintRoutes.js
│   │   └── staffRoutes.js
│   ├── seed.js                 # Database seed script
│   ├── server.js               # Express server entry point
│   ├── vercel.json             # Serverless configuration for Vercel
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
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register student (sets `role: student`) |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Private | Fetch logged-in user profile |

### Complaints (Student & General)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/complaints` | Private (Student) | Create new complaint |
| `GET` | `/api/complaints` | Private | Role-aware: Student gets own, Admin gets all |
| `GET` | `/api/complaints/:id` | Private | Fetch single complaint details |
| `PUT` | `/api/complaints/:id` | Private | Update complaint details |
| `DELETE` | `/api/complaints/:id` | Private (Student) | Cancel complaint (`Pending` status only) |

### Admin Operations
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Admin | Overall counts: Total, Pending, In Progress, Resolved |
| `GET` | `/api/admin/staff` | Admin | Get list of staff users for assignment dropdown |
| `PUT` | `/api/admin/complaints/:id/assign` | Admin | Assign complaint to staff member |
| `PUT` | `/api/admin/complaints/:id/priority` | Admin | Change priority (`Low`, `Medium`, `High`) |
| `PUT` | `/api/admin/complaints/:id/status` | Admin | Change status & optional admin note |

### Staff Operations
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/staff/complaints` | Staff | Fetch complaints assigned to logged-in staff |
| `PUT` | `/api/staff/complaints/:id/status` | Staff | Update status to `In Progress` |
| `PUT` | `/api/staff/complaints/:id/resolve` | Staff | Resolve complaint with required `resolutionNote` |

---

## 9. Local Setup Guide

### Prerequisites
* **Node.js** (v18 or higher)
* **npm** (v9 or higher)
* A MongoDB connection string (from MongoDB Atlas or local MongoDB)

### Step 1: Clone Repository
```bash
git clone https://github.com/gulshan29-kumar/collage_complaint_website.git
cd collage_complaint_website
```

### Step 2: Backend Setup
```bash
cd server
npm install
cp .env.example .env
```
Open `server/.env` and configure:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/campusfix?retryWrites=true&w=majority
JWT_SECRET=supersecretjwtkey_campusfix_2026
CLIENT_URL=http://localhost:5173
```

Seed database with demo accounts & sample complaints:
```bash
npm run seed
```

Start backend dev server:
```bash
npm run dev
# Running on http://localhost:5000
```

### Step 3: Frontend Setup
In a new terminal window:
```bash
cd client
npm install
cp .env.example .env
```
Ensure `client/.env` has:
```env
VITE_API_URL=http://localhost:5000
```

Start Vite dev server:
```bash
npm run dev
# Running on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 10. Database Setup (MongoDB Atlas)

1. Create a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free **M0 Shared Cluster**.
3. **Database Access:**
   * Create a database user (e.g. `campusadmin`).
   * Choose password authentication and set a strong password.
   * Privileges: `Read and write to any database`.
4. **Network Access:**
   * Add IP: Choose `Allow Access from Anywhere` (`0.0.0.0/0`) so cloud hosts can connect.
5. **Connect:**
   * Select **Drivers** (Node.js).
   * Copy the connection string and replace `<password>` with your database user password:
     ```text
     mongodb+srv://campusadmin:<password>@cluster0.abcde.mongodb.net/campusfix?retryWrites=true&w=majority
     ```
6. Add this URI as `MONGO_URI` in `server/.env`.

---

## 11. Environment Variables

### Backend (`server/.env`)
| Variable | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `PORT` | No | Express port (default: 5000) | `5000` |
| `MONGO_URI` | Yes | MongoDB Atlas connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Yes | Secret key for signing tokens | `campusfix_jwt_key_2026` |
| `CLIENT_URL` | Yes | Frontend origin for CORS | `http://localhost:5173` |

### Frontend (`client/.env`)
| Variable | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `VITE_API_URL` | Yes | Base URL of backend REST API | `http://localhost:5000` |

---

## 12. Seed Data & Demo Credentials

Run `npm run seed` in the `server` directory to populate:

| Role | Email | Password | Features to Test |
| :--- | :--- | :--- | :--- |
| **Student** | `student@campusfix.com` | `Student@123` | Create complaints, view live cards, cancel pending complaints |
| **Staff** | `staff@campusfix.com` | `Staff@123` | View assigned queue, mark "In Progress", write resolution note |
| **Admin** | `admin@campusfix.com` | `Admin@123` | Full metrics, search/filter table, assign staff, change priority |

> 💡 **Quick Demo Feature:** The login screen has built-in **1-Click Demo Buttons** (Student, Staff, Admin) to instantly auto-fill credentials for quick evaluator demonstrations.

---

## 13. Deployment Guide: Vercel

Both the frontend and backend are pre-configured with `vercel.json` for Vercel deployment.

### 1. Deploy Backend on Vercel
1. Go to [vercel.com](https://vercel.com) and click **Add New... → Project**.
2. Select your repository: `collage_complaint_website`.
3. Set **Root Directory** to `server`.
4. Add Environment Variables:
   * `MONGO_URI` = `<Your MongoDB Atlas URI>`
   * `JWT_SECRET` = `<Your Secret String>`
   * `CLIENT_URL` = `http://localhost:5173` *(update after frontend is deployed)*
   * `NODE_ENV` = `production`
5. Click **Deploy**. Copy the live API URL (e.g. `https://campusfix-api.vercel.app`).

### 2. Deploy Frontend on Vercel
1. In Vercel, click **Add New... → Project**.
2. Select the same repository: `collage_complaint_website`.
3. Set **Root Directory** to `client`.
4. Framework Preset: **Vite**.
5. Add Environment Variable:
   * `VITE_API_URL` = `https://campusfix-api.vercel.app` *(Backend URL without trailing slash)*
6. Click **Deploy**. Copy the live frontend URL (e.g. `https://campusfix.vercel.app`).

### 3. Update Backend CORS
* Go to your backend Vercel project Settings → Environment Variables.
* Update `CLIENT_URL` to `https://campusfix.vercel.app`.
* Trigger a redeployment of the backend.

---

## 14. Deployment Guide: Render

### 1. Deploy Backend (Web Service)
1. Go to [render.com](https://render.com) ➔ **New + ➔ Web Service**.
2. Connect your GitHub repository.
3. Settings:
   * **Root Directory:** `server`
   * **Build Command:** `npm install`
   * **Start Command:** `npm start`
4. Add Environment Variables:
   * `MONGO_URI` = `<Your MongoDB Atlas URI>`
   * `JWT_SECRET` = `<Your Secret>`
   * `CLIENT_URL` = `https://campusfix.onrender.com`
5. Click **Create Web Service**. Copy your backend URL (`https://campusfix-api.onrender.com`).

### 2. Deploy Frontend (Static Site)
1. In Render ➔ **New + ➔ Static Site**.
2. Settings:
   * **Root Directory:** `client`
   * **Build Command:** `npm install && npm run build`
   * **Publish Directory:** `dist`
3. Add Environment Variable:
   * `VITE_API_URL` = `https://campusfix-api.onrender.com`
4. Click **Create Static Site**.

---

## 15. Interview Guide: How to Explain CampusFix

When discussing this project in an internship or software engineering interview:

1. **The Problem:**
   > *"Campuses often rely on unorganized verbal complaints or WhatsApp messages for maintenance issues. CampusFix solves this with an end-to-end digital grievance pipeline with role-based access control."*

2. **Architecture & State Management:**
   > *"I used React with Vite for rapid bundling, Tailwind CSS for clean UI, and Express with Mongoose for REST APIs. Rather than introducing complex Redux boilerplates, I used standard React state and an AuthContext for user sessions and JWT persistence, making the codebase maintainable and readable."*

3. **Role-Based Access Control (RBAC):**
   > *"There are three distinct roles: Students, Staff, and Admins. On the backend, we enforce this with an `authMiddleware` that verifies the JWT token and a `roleMiddleware` that protects sensitive routes. On the frontend, `ProtectedRoute` components prevent unauthorized page access."*

4. **Edge Cases Handled:**
   > *"A student can only cancel a complaint while it is in the `Pending` state. Once an admin assigns staff or work starts, cancellation is disabled to prevent conflicting workflows."*

---

## 16. Future Improvements
* Email notifications for ticket updates using Nodemailer
* File & photo evidence attachment uploads using Cloudinary / AWS S3
* Student satisfaction rating (1-5 stars) upon resolution
* Exportable monthly maintenance audit reports in CSV / PDF

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
