# Project & Task Manager App

A full-stack mobile application built to manage projects and tasks efficiently. This project demonstrates a robust separation of concerns using React Native for the frontend and Node.js/Express for the backend.

## 🚀 Features
- **OTP-Based Authentication:** Secure login flow with JSON Web Tokens (JWT) for session persistence.
- **Project Management:** Complete CRUD (Create, Read, Update, Delete) functionality for managing projects.
- **Task Tracking:** Add, edit, delete, and toggle the completion status of tasks within specific projects.
- **Task Filtering:** Filter tasks by 'All', 'Pending', or 'Completed' status.
- **State Management:** Utilizes Redux Toolkit (`createSlice`, `createAsyncThunk`) for global state management and async API handling.
- **UI/UX:** Features a clean, responsive design with smooth layout animations and pull-to-refresh functionality.

## 🛠 Tech Stack
- **Frontend:** React Native (Expo), Redux Toolkit, Axios, React Navigation.
- **Backend:** Node.js, Express, TypeScript, JWT.
- **Storage:** Currently utilizing a robust In-Memory data structure to facilitate immediate testing and demonstration without local database configuration overhead.

## 📱 How to Run Locally

### Prerequisites
- Node.js installed
- Expo Go app installed on your physical mobile device
- Both your computer and your mobile device must be connected to the **same Wi-Fi network**.

### 1. Start the Backend
```bash
cd backend
npm install
npm run dev
```
*Note: The backend will run on port 5000. When you request an OTP from the app, check this terminal window to see the generated OTP code.*

### 2. Configure the Frontend IP
Before starting the frontend, you must update the API base URL to match your computer's local Wi-Fi IP address.
1. Find your IPv4 address (run `ipconfig` on Windows or `ifconfig` on Mac).
2. Open `frontend/src/api/axios.js`
3. Update the `baseURL` to: `http://YOUR_IP_ADDRESS:5000/api`

### 3. Start the Frontend
```bash
cd frontend
npm install
npm start
```
Scan the QR code shown in the terminal using the **Expo Go** app on your phone.
