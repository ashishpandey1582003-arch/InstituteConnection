# CampusConnect 🚀

CampusConnect is a comprehensive Campus Recruiter and Placement Management System. It bridges the gap between students, recruiters, and placement coordinators (admins) by providing a centralized platform to manage recruitment drives, track student applications, view recruitment schedules, maintain activity audit trails, and prepare for interviews.

---

## 🏗️ System Architecture

CampusConnect is designed as a decoupled client-server monorepo containing two main components:

1. **Backend API (`/backend`)**: A RESTful service built with Node.js, Express, and MongoDB (via Mongoose). It handles authentication, database storage, file uploads, notifications, activity logs, PDF exports, and Excel report generation.
2. **Frontend client (`/frontend`)**: A modern Single Page Application (SPA) built with React, Vite, Tailwind CSS, React Router DOM, and Recharts.

### Project Structure

```text
CampusConnect/
├── backend/
│   ├── config/             # DB configuration (Mongoose)
│   ├── controllers/        # Route controllers (request-response logic)
│   ├── middleware/         # Auth guards, file uploads (Multer), global error handlers
│   ├── models/             # Mongoose schemas (Student, Recruiter, Application, etc.)
│   ├── routes/             # Express API routing tables
│   ├── uploads/            # Local directory for uploaded resumes & profile pictures
│   ├── utils/              # NodeMailer helper, JWT generator, admin creator
│   ├── server.js           # Server entry point
│   └── package.json        # Backend dependencies & script definitions
│
└── frontend/
    ├── public/             # Static public assets
    ├── src/
    │   ├── components/     # Reusable layout & common components
    │   ├── context/        # React context providers (Auth, Theme)
    │   ├── hooks/          # Custom hooks (e.g., API requester axios wrapper)
    │   ├── pages/          # Auth, Admin, and Student pages
    │   ├── App.jsx         # Client-side router configuration
    │   ├── index.css       # Tailwind stylesheet entry
    │   └── main.jsx        # Frontend entry point
    ├── package.json        # Frontend dependencies & build script definitions
    └── vite.config.js      # Vite build bundler configuration
```

---

## ✨ Features

### 👤 Student Portal
- **Dashboard**: General statistics of active job applications, updates, and placement milestones.
- **Profile & Resume Builder**: Manage professional details, academic scores, and upload resumes and profile pictures (backed by Multer).
- **Recruiter Directory**: Search, filter, and bookmark potential companies visiting the campus.
- **Recruitment Calendar**: View schedules, timelines, and interview dates.
- **Preparation Hub**: Access curated prep resources, typical placement interview questions, and prep guides.
- **Application Flow**: View eligibility cutoffs (CGPA, Branch), apply to drives, or withdraw applications.

### 🛡️ Admin & Placement Coordinator Portal
- **Analytics Dashboard**: Dynamic charts visualizing student applications, recruiter visit trends, and selection rates (using Recharts).
- **Recruiter Manager**: Create, update, or remove recruiters. Detail recruitment requirements (CTC, eligible branches, CGPA cutoff, date of visit, status, attachments).
- **Student Tracker**: View registered student tables, update profile statuses, and search profiles.
- **Applications Hub**: Manage all student applications per drive. Review resumes, update applicant states (applied, selected, rejected), and export details to Excel/PDF.
- **Notifications Hub**: Broadcast campus-wide updates or targeted warnings.
- **Activity logs**: View audit logs tracking coordinator actions for security and compliance.

---

## 🛠️ Tech Stack

### Backend
- **Node.js & Express**: High-performance HTTP server & router.
- **Mongoose & MongoDB**: Object Data Modeling (ODM) for document schemas.
- **Helmet**: Secures the API by setting various security headers.
- **Express Rate Limit**: Prevents DDoS and brute-force attacks on the API.
- **JWT & Cookie Parser**: Secure cookie-based stateless authentication.
- **Multer**: Multi-part form-data handling for resumes and profile images.
- **Nodemailer**: Standard SMTP-driven emails for authentication and password resets.
- **PDFKit & XLSX**: Generates applications and recruiter reports on-the-fly.

### Frontend
- **React & Vite**: Extremely fast dev server and optimized production bundler.
- **React Router DOM**: Client-side single-page routing.
- **Axios**: Network requester with central interceptors for request/response handling.
- **React Hook Form & Zod**: Form state handling and type-safe validation schema definitions.
- **Tailwind CSS**: Utility-first CSS framework for interface layouts.
- **Recharts**: Responsive chart visualizations for the admin dashboard.
- **Lucide React**: Clean vector icons.

---

## ⚙️ Configuration & Local Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or a local MongoDB instance

### 2. Backend Configuration
Create a `.env` file in the `/backend` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_signing_secret_key
JWT_EXPIRE=30d
COOKIE_EXPIRE=30
NODE_ENV=development

# SMTP Mock Configs for testing emails (e.g. from Ethereal Mail or Gmail SMTP)
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_EMAIL=your_smtp_username
SMTP_PASSWORD=your_smtp_password
SMTP_FROM_EMAIL=noreply@campusconnect.edu
SMTP_FROM_NAME=CampusConnect
```

### 3. Running Backend Locally
```bash
cd backend
npm install
npm run dev
```

### 4. Running Frontend Locally
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🚀 Deployment Guide

This guide details deploying the Backend on **Render** and the Frontend on **Vercel**.

### Step 1: Backend Deployment on Render

Render is ideal for Node.js Express APIs.

1. **Push your code to GitHub/GitLab**.
2. **Log into [Render](https://render.com/)** and click **New > Web Service**.
3. **Connect your repository**.
4. **Configure your service**:
   - **Name**: `campusconnect-backend`
   - **Root Directory**: `backend` (Crucial: Render will scope commands to this directory)
   - **Environment/Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Select Free or Starter
5. **Configure Environment Variables**:
   Click **Advanced** and add the keys from your backend `.env` file:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRE`
   - `COOKIE_EXPIRE`
   - `NODE_ENV` = `production`
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_EMAIL`, `SMTP_PASSWORD`
   - `SMTP_FROM_EMAIL`, `SMTP_FROM_NAME`
6. **Deploy**. Once successfully deployed, Render will provide you with a backend URL (e.g., `https://campusconnect-backend.onrender.com`).

> [!WARNING]
> **Ephemeral Storage Limitation**
> Render's free instances do not have persistent disks. Files uploaded locally to the `/uploads` directory (like Resumes and Profile pictures) will disappear when the instance restarts or spins down.
> **Solution**: For production deployments, integrate an external cloud storage provider (e.g., Cloudinary, Amazon S3, or Google Cloud Storage) or attach a Render Persistent Disk.

---

### Step 2: Configure Frontend for Production

Before deploying the frontend, make sure it is configured to point to the production backend.

1. **Environment Variables**:
   In [useAxios.js](file:///c:/Users/ASHISH%20PANDEY/OneDrive/Desktop/CampusConnect/frontend/src/hooks/useAxios.js), modify the `baseURL` to read from Vite's environment variables:
   ```javascript
   const api = axios.create({
     baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
     withCredentials: true,
   });
   ```
2. **Client-Side Routing on Vercel**:
   Vercel needs to know how to handle client-side routes (e.g. `/student/dashboard`). Create a `vercel.json` file in the **`/frontend`** folder:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
   This ensures that all page requests route back to `index.html` allowing React Router DOM to manage page transitions smoothly.

---

### Step 3: Frontend Deployment on Vercel

1. **Log into [Vercel](https://vercel.com/)** and click **Add New > Project**.
2. **Import your Git repository**.
3. **Configure the Project**:
   - **Framework Preset**: `Vite` (Vercel should automatically detect this)
   - **Root Directory**: `frontend` (Crucial: Vercel will scope deployments to this folder)
   - **Build & Development Settings**: Keep defaults (Build command: `vite build`, Output directory: `dist`)
4. **Add Environment Variables**:
   In the Environment Variables section, add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://campusconnect-backend.onrender.com/api` (Replace with your actual Render URL)
5. **Click Deploy**. Vercel will build your static files and generate your frontend deployment URL.

---

## 🔒 Security Best Practices Implemented
- **Helmet Headers**: Protection against cross-site scripting (XSS), clickjacking, and mime sniffing.
- **CORS Config**: Lock down cross-origin requests to client-side domains.
- **HTTPOnly Cookies**: JWT tokens are stored in `HTTPOnly` cookies, preventing retrieval via client-side scripts (`document.cookie`), mitigating XSS token theft.
- **Rate Limiting**: Protects backend controllers against brute force attacks.
- **Input validation**: Enforced validation schemas using Zod both on the client and controller levels.

---

### 📄 Reference Files
- Backend Server: [server.js](file:///c:/Users/ASHISH%20PANDEY/OneDrive/Desktop/CampusConnect/backend/server.js)
- API Interceptor Hook: [useAxios.js](file:///c:/Users/ASHISH%20PANDEY/OneDrive/Desktop/CampusConnect/frontend/src/hooks/useAxios.js)
- Routing Configuration: [App.jsx](file:///c:/Users/ASHISH%20PANDEY/OneDrive/Desktop/CampusConnect/frontend/src/App.jsx)
- Backend Dependencies: [package.json](file:///c:/Users/ASHISH%20PANDEY/OneDrive/Desktop/CampusConnect/backend/package.json)
- Frontend Dependencies: [package.json](file:///c:/Users/ASHISH%20PANDEY/OneDrive/Desktop/CampusConnect/frontend/package.json)
#   I n s t i t u t e C o n n e c t i o n  
 