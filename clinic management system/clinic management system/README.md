# Clinic Management System

**College Project - MERN Stack**

A complete, simple clinic management system built with MongoDB, Express.js, React, and Node.js. This project follows basic undergraduate-level concepts and is designed for college project demonstration and viva.

---

## 📋 Project Overview

This Clinic Management System helps manage:
- Patient registration and records
- Doctor consultations
- Prescription and medicine scheduling
- Lab test reports
- Billing management
- Patient history tracking

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (with Vite)
- **React Router** - for navigation
- **Axios** - for API calls
- **TailwindCSS** - for styling
- **Hooks**: useState, useEffect

### Backend
- **Node.js** - runtime environment
- **Express.js** - web framework
- **MongoDB** - database
- **Mongoose** - ODM for MongoDB
- **CORS** - cross-origin resource sharing
- **Body-Parser** - parsing request bodies

---

## 📁 Project Structure

```
clinic-management-system/
│
├── server/                    # Backend
│   ├── models/               # Mongoose schemas
│   │   ├── Patient.js
│   │   ├── Prescription.js
│   │   ├── LabReport.js
│   │   └── Bill.js
│   ├── routes/               # API routes
│   │   ├── patientRoutes.js
│   │   ├── prescriptionRoutes.js
│   │   ├── labRoutes.js
│   │   └── billRoutes.js
│   ├── server.js             # Main server file
│   └── package.json
│
├── client/                    # Frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   └── Navbar.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── PatientManagement.jsx
│   │   │   ├── Consultation.jsx
│   │   │   ├── Prescription.jsx
│   │   │   ├── LabTest.jsx
│   │   │   ├── Billing.jsx
│   │   │   └── PatientHistory.jsx
│   │   ├── services/         # API service layer
│   │   │   └── api.js
│   │   ├── App.jsx           # Main app component
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js installed (v14 or higher)
- MongoDB installed and running locally
- npm or yarn package manager

### 1. Clone or Download the Project
```bash
cd "clinic management system"
```

### 2. Backend Setup

```bash
# Navigate to server folder
cd server

# Install dependencies
npm install

# Start MongoDB (in a separate terminal)
# On Windows:
mongod

# Start the backend server
npm run dev
```

The backend server will run on **http://localhost:5000**

### 3. Frontend Setup

Open a new terminal:

```bash
# Navigate to client folder
cd client

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

The frontend will run on **http://localhost:3000**

---

## 🚀 How to Run

1. **Start MongoDB** - Make sure MongoDB is running locally
2. **Start Backend** - Run `npm run dev` in the `server` folder
3. **Start Frontend** - Run `npm run dev` in the `client` folder
4.**In server run seedAdmin file node seedAdmin.js
5. **Open Browser** - Navigate to http://localhost:3000

---

## 👥 User Roles

The system supports 3 user roles (simple role selection, no authentication):

1. **Admin** - Full access to all features
2. **Doctor** - Consultation and prescription management
3. **Receptionist** - Patient registration and billing

---

## 📌 Features

### 1. Home Page
- Attractive landing page with hero section
- Header image showcasing clinic services
- Call-to-action buttons (Get Started, Learn More)
- Features overview section
- Benefits section with step-by-step guide
- Professional footer

### 2. Login
- Simple role-based login
- No password required (college project simplification)
- Role stored in localStorage

### 2. Dashboard
- Role-based dashboard views
- Quick stats and metrics
- Quick action cards

### 3. Patient Management
- Register new patients
- View all patients
- View individual patient details
- Controlled form components using useState

### 4. Doctor Consultation
- Select patient
- Record symptoms and diagnosis
- Add prescription with multiple medicines
- Medicine details: name, type, dosage, timing, duration

### 5. Prescription Viewing
- View all prescriptions for a patient
- Medicine schedule with timing
- Ointment and tablet tracking

### 6. Lab Tests
- Add lab test reports
- View lab results for patients
- Text-based result entry

### 7. Billing
- Generate bills with:
  - Consultation fee
  - Medicine cost
  - Lab charges
- **Auto-calculate total** using JavaScript
- View billing history

### 8. Patient History
- Complete patient overview
- Previous visits and consultations
- All prescriptions
- Lab test results
- Billing records

---

## 🔌 API Endpoints

### Patients
- `POST /api/patients` - Add new patient
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID

### Prescriptions
- `POST /api/prescriptions` - Add prescription
- `GET /api/prescriptions/:patientId` - Get patient prescriptions

### Lab Reports
- `POST /api/labs` - Add lab report
- `GET /api/labs/:patientId` - Get patient lab reports

### Bills
- `POST /api/bills` - Create bill
- `GET /api/bills/:patientId` - Get patient bills

---

## 🎨 Design Theme

- **Primary Color**: #ebf5ff (Light Blue)
- **Background**: Off-white (#f8fafc)
- **Cards**: White
- **Accent**: Blue (#3b82f6)
- Clean, minimal, professional clinic-style design

---

## 📚 Concepts Used (For Viva)

### React Concepts
1. **Functional Components** - All components are functional
2. **useState Hook** - For managing component state
3. **useEffect Hook** - For side effects and data fetching
4. **Controlled Components** - Form inputs controlled by state
5. **Props** - Passing data between components
6. **React Router** - Navigation between pages
7. **Event Handling** - onClick, onChange, onSubmit
8. **Conditional Rendering** - Showing/hiding elements based on state
9. **Array Methods** - map(), filter() for rendering lists

### Backend Concepts
1. **Express.js** - Web framework
2. **REST API** - GET, POST, PUT, DELETE
3. **Mongoose** - MongoDB ODM
4. **Schemas and Models** - Data structure definition
5. **Middleware** - app.use() for logging, CORS, body-parser
6. **Async/Await** - Handling asynchronous operations
7. **Error Handling** - try-catch blocks

### Database Concepts
1. **MongoDB** - NoSQL database
2. **Collections** - patients, prescriptions, labReports, bills
3. **Documents** - JSON-like data storage
4. **References** - Linking documents using ObjectId

---

## 🎓 For College Submission

### Key Points for Viva
1. **MERN Stack** - Explain each technology
2. **Component-based architecture** - React components
3. **State management** - useState and useEffect
4. **API integration** - How frontend calls backend
5. **Database design** - Mongoose schemas
6. **Routing** - React Router for navigation
7. **Middleware** - Custom logging middleware

### Demonstration Flow
1. Login with different roles
2. Register a patient
3. Create a consultation with prescription
4. Add lab report
5. Generate bill (show auto-calculation)
6. View patient history

---


