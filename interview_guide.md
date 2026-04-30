# 🚀 Project & Task Manager: Interview "Cheat Sheet"

## 1. What You Built (The Elevator Pitch)
"I built a full-stack mobile application for managing projects and tasks. The frontend is built with React Native and Expo, and uses Redux Toolkit for state management. The backend is a Node.js/Express server with JWT-based authentication. I implemented a complete CRUD (Create, Read, Update, Delete) flow for projects and tasks, and included bonus features like task filtering and UI animations."

## 2. How You Approached the Problem
If asked: *"How did you start building this?"*

**Your Answer:**
1. **Planning the Architecture:** I decided to separate the frontend (React Native) and backend (Node.js) completely to ensure it's scalable.
2. **Backend First:** I started by building the Node.js REST APIs. I created routes for authentication (OTP flow), projects, and tasks. To get things moving quickly and focus on the core logic, I used an **in-memory data structure** (arrays) to store data temporarily, with the intention of swapping it to PostgreSQL later.
3. **Frontend Integration:** Once the APIs were working, I built the React Native screens. I used **Axios** to connect to the backend.
4. **State Management:** I integrated **Redux Toolkit** because passing data (like the user's login token and task lists) between different screens gets messy without a global state manager.

## 3. Key Technical Decisions (Why you did what you did)

**Q: Why Redux instead of just React State (`useState`)?**
*A:* "For simple components, I used local state. But for things like the Authentication Token and the list of Tasks, I needed them to be accessible globally across the app. Redux (specifically `createAsyncThunk`) made it easy to handle loading states, success, and error messages from API calls in one central place."

**Q: How did you handle Authentication?**
*A:* "I built a simulated OTP (One-Time Password) flow. When the user enters their phone number, the backend generates an OTP. Once verified, the backend issues a **JWT (JSON Web Token)**. On the mobile app, I save this token securely using `AsyncStorage`. Then, I set up an **Axios Interceptor** that automatically attaches this JWT to the headers of every future request to keep the routes protected."

**Q: Why is your Database 'In-Memory' instead of PostgreSQL?**
*A:* *(This shows you can adapt and prioritize!)* "I set up the initial dependencies for PostgreSQL and Prisma. However, I ran into environment issues locally. Because the assignment noted that problem-solving and adaptation were key, I decided to pivot. I built a robust in-memory data store for the backend so I could proceed to build a fully functional React Native frontend with Redux. It allowed me to deliver a working prototype to demonstrate the UI and logic flows today. Plugging in the real database is my immediate next step."

**Q: What was the hardest challenge?**
*A:* "Connecting a physical mobile phone to a local backend. Usually, developers just use `localhost`, but `localhost` on a phone points to the phone itself, not the computer. I had to configure my Axios base URL to point to my computer's local Wi-Fi IP address so the app could successfully talk to the backend."

## 4. Bonus Features You Implemented
If they ask what extra things you did:
- **Filtering:** Users can filter tasks by 'All', 'Pending', or 'Completed'.
- **Animations:** Added `LayoutAnimation` when tasks are deleted or status changes for a smoother feel.
- **Theming:** Integrated React Navigation's theme system for consistent colors.
