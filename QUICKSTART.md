# Quick Start Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or connection string)
- npm or yarn

## Step 1: Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/voting-system
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
ADMIN_EMAIL=admin@club.com
NODE_ENV=development
```

Start MongoDB (if running locally):
```bash
# Windows (if installed as service, it should auto-start)
# Or use MongoDB Compass

# Mac/Linux
mongod
```

Start the backend:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

## Step 2: Frontend Setup

Open a new terminal:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## Step 3: First Time Setup

1. **Create Admin Account**: 
   - Go to `http://localhost:3000/admin-login`
   - Login with the email you set in `ADMIN_EMAIL` (e.g., `admin@club.com`)
   - Use any password (it will be set on first login)

2. **Create Fixed Positions** (Optional):
   - After admin login, go to Admin Dashboard > Positions
   - Create "President" and "Vice President" with:
     - `isFixed: true`
     - `isElected: false`

3. **Create Elected Positions**:
   - Create positions like "General Secretary", "Treasurer", etc.
   - Set `isElected: true` and `isFixed: false`

4. **Create an Election**:
   - Go to Admin Dashboard > Elections
   - Create a new election with start and end dates
   - Select which positions are part of this election

5. **Test Member Signup**:
   - Go to `http://localhost:3000/signup`
   - Sign up with a profile photo (required)
   - Apply as a candidate for a position
   - Admin can approve the application

6. **Vote**:
   - Members can vote once per position
   - Results are visible only after election ends

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check your `MONGODB_URI` in `.env`
- For local MongoDB: `mongodb://localhost:27017/voting-system`

### Port Already in Use
- Change `PORT` in backend `.env` file
- Update `REACT_APP_API_URL` in frontend `.env` accordingly

### CORS Errors
- Backend is configured to accept requests from `http://localhost:3000`
- Make sure frontend is running on port 3000

### Profile Photo Upload Fails
- Make sure `backend/uploads/` directory exists
- Check file size (max 2MB) and type (JPG/PNG only)

## Next Steps

- Read the full README.md for detailed documentation
- Customize the admin email in backend `.env`
- Set up production environment variables
- Configure MongoDB for production

