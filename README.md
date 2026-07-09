# CampusConnect 🚀

CampusConnect is a **Campus Recruiter and Placement Management System**. It connects **Students, Recruiters, and Placement Coordinators (Admins)** in one place to manage jobs, interviews, and applications.

---

## 🌟 Key Features

### 👤 For Students
* **Dashboard:** Track your job application status.
* **Profile & Resume:** Create your profile and upload your resume.
* **Recruitment Calendar:** View upcoming company visits and interview dates.
* **Preparation Hub:** Access interview preparation guides and questions.

### 🛡️ For Admins (Coordinators)
* **Analytics Dashboard:** Visual charts to see student placement rates.
* **Recruiter Manager:** Add new companies, set criteria (CGPA, Branch), and manage drives.
* **Student Tracker:** View and manage all registered student profiles.
* **Reports:** Export applications and recruiter data to Excel or PDF.

---

## 🛠️ Tech Stack

* **Frontend:** React, Vite, Tailwind CSS, Recharts (for charts)
* **Backend:** Node.js, Express.js, MongoDB (Mongoose)
* **Security:** JWT Auth, HTTPOnly Cookies, Helmet security headers
* **Utilities:** Multer (file uploads), Nodemailer (emails), PDFKit & XLSX (for reports)

---

## ⚙️ How to Run Locally

### 1. Backend Setup
1. Go to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder with these details:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   JWT_EXPIRE=30d
   COOKIE_EXPIRE=30
   NODE_ENV=development
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Go to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Start the React app:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173` in your browser.

---

## 🚀 Deployment

* **Backend:** Deployed on **Render** (Root directory: `backend`)
* **Frontend:** Deployed on **Vercel** (Root directory: `frontend`)