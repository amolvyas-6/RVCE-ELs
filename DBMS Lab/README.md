# DBMS Lab - Full-Stack Data Management & Forecasting

A multi-tier application combining modern web development with AI-driven time-series forecasting.

## 🚀 Overview

This project showcases a robust system architecture:
- **Frontend**: A modern, interactive user interface.
- **Backend (Express)**: A powerful API server for data management and orchestration.
- **AI Forecasting Service (FastAPI)**: An integrated AI service for advanced data analysis and forecasting.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19, Vite
- **Styling**: Tailwind CSS v4, Radix UI (Base UI), Lucide React
- **Data Fetching**: Axios, React Router 7
- **Visualization**: Recharts
- **Components**: Shadcn/ui

### Backend (Node.js/Express)
- **Framework**: Express 5 (TypeScript)
- **Database**: 
  - **Relational**: PostgreSQL (via Prisma ORM)
  - **NoSQL**: MongoDB (via Mongoose)
- **Auth**: JSON Web Tokens (JWT), BcryptJS
- **Data Handling**: Multer (file uploads), CSV-parser

### AI/ML Part (Python)
- **Framework**: FastAPI
- **Forecasting**: Nixtla
- **Data Analysis**: Pandas, Numpy
- **Package Manager**: [uv](https://docs.astral.sh/uv/)

## 📂 Project Structure

- `frontend/`: React-based web interface.
- `backend/`: Node.js Express server with Prisma and Mongoose.
- `aiml_part/`: FastAPI service for time-series forecasting.
- `Docs/`: DFD and ER diagrams.

## ⚙️ Setup and Installation

### 1. Prerequisites
- Node.js 20+
- Python 3.11+
- PostgreSQL and MongoDB instances

### 2. Backend Setup
```bash
cd backend
npm install
npx prisma generate
npm run dev
```

### 3. AI Service Setup
```bash
cd aiml_part
uv sync
uv run python main.py
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🏃 How to Run

1.  Start the **PostgreSQL** and **MongoDB** databases.
2.  Launch the **Backend** (Express) on port 3000.
3.  Launch the **AI Service** (FastAPI) on port 8000.
4.  Start the **Frontend** and navigate to `http://localhost:5173`.
