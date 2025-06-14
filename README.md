# Smart Billing System

A full-stack smart billing system designed to streamline billing with ML-based object detection and manual billing.

---

## Prerequisites

- Node.js (v16 or above)
- npm or yarn
- MySQL installed and running locally

---

## 1. Clone the Repository

```bash
git clone https://github.com/AIDVISION2020/Smart-Billing-System.git
cd Smart-Billing-System
```

---

## 2. Setup Backend

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install backend dependencies:

```bash
npm install
```

3. Create a `.env` file inside the `backend` folder with the following content (modify as needed):

```env
PORT=5000
DB_USERNAME=YOUR_DB_USERNAME
DB_PASSWORD=YOUR_DB_PASSWORD
DB_NAME=YOUR_DB_NAME
DB_HOST=YOUR_DB_HOST
JWT_SECRET=YOUR_JWT_SECRET
```

4. Make sure your MySQL database with your DB name exists and is running locally.

5. Start the backend server:

```bash
npm run server
```

The backend will be available at `http://localhost:5000`.

---

## 3. Setup Frontend

1. Open a new terminal and go to the frontend directory:

```bash
cd frontend
```

2. Install frontend dependencies:

```bash
npm install
```

3. Create a `.env` file inside the `frontend` folder with this content:

```env
VITE_BACKEND_BASE_URL=http://localhost:5000
```

4. Start the frontend development server:

```bash
npm run dev
```

The frontend typically runs at `http://localhost:3001`.

---

## 4. Access the Application

Open your browser and navigate to:

```
http://localhost:3001
```

You should now see the Smart Billing System frontend connected to the backend API.

---

## Troubleshooting

- Ensure MySQL is running and `.env` database credentials are correct.
- Restart backend and frontend servers after any `.env` changes.
- If you face dependency issues, try deleting `node_modules` and reinstalling:

```bash
rm -rf node_modules
npm install
```

- Check terminal logs for startup or runtime errors.

---

## Summary of Commands

```bash
# Clone the repo
git clone https://github.com/AIDVISION2020/Smart-Billing-System.git
cd Smart-Billing-System

# Backend setup and run
cd backend
npm install
# Create .env here
npm run server

# Frontend setup and run (in a new terminal)
cd frontend
npm install
# Create .env here
npm run dev
```

---

## Video Tutorial (How to use)

[Download from Google Drive](https://drive.google.com/file/d/1aNZf2q2AC-PkWPvXVcK3jrXaoO5k1_Ye/view)

Happy billing! 🚀
