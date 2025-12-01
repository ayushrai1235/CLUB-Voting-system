# Deployment Guide

This guide will help you deploy the Voting System application. The backend will be deployed on **Render**, and the frontend on **Vercel**.

## Prerequisites

- GitHub account
- [Render](https://render.com/) account
- [Vercel](https://vercel.com/) account
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or any MongoDB provider)

---

## Part 1: Backend Deployment (Render)

1.  **Push to GitHub**: Ensure your project is pushed to a GitHub repository.
2.  **Create Web Service**:
    - Log in to Render.
    - Click "New +" -> "Web Service".
    - Connect your GitHub repository.
3.  **Configure Service**:
    - **Name**: `voting-system-backend` (or your choice)
    - **Root Directory**: `backend`
    - **Environment**: `Node`
    - **Build Command**: `npm install`
    - **Start Command**: `node src/server.js`
4.  **Environment Variables**:
    - Scroll down to "Environment Variables" and add:
        - `MONGODB_URI`: Your MongoDB connection string (e.g., `mongodb+srv://...`).
        - `JWT_SECRET`: A strong random string for security.
        - `ADMIN_EMAIL`: The email address for the admin account (e.g., `admin@example.com`).
        - `NODE_ENV`: `production` (Recommended for performance).
        - `PORT`: `10000` (Render sets this automatically, but good to be aware).
5.  **Deploy**: Click "Create Web Service". Wait for the deployment to finish.
6.  **Copy URL**: Once live, copy the backend URL (e.g., `https://voting-system-backend.onrender.com`).

---

## Part 2: Frontend Deployment (Vercel)

1.  **Import Project**:
    - Log in to Vercel.
    - Click "Add New..." -> "Project".
    - Import your GitHub repository.
2.  **Configure Project**:
    - **Framework Preset**: Create React App (should be detected automatically).
    - **Root Directory**: Click "Edit" and select `frontend`.
3.  **Environment Variables**:
    - Expand "Environment Variables".
    - Add:
        - `REACT_APP_API_URL`: The **production** backend URL ending with `/api`.
            - Example: `https://voting-system-backend.onrender.com/api`
            - **Do NOT** include localhost or combine multiple URLs.
4.  **Deploy**: Click "Deploy".
5.  **Verify**: Visit the deployed frontend URL.

---

## Troubleshooting

-   **CORS Issues**: If the frontend cannot talk to the backend, check the backend logs. You might need to update the `cors` configuration in `backend/src/server.js` to allow your Vercel domain.
-   **MongoDB Connection**: Ensure your MongoDB Atlas "Network Access" allows access from anywhere (`0.0.0.0/0`) so Render can connect.
