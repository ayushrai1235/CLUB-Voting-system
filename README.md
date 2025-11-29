# College Coding Club Voting System

A fully responsive, secure, full-stack voting web application for college coding clubs.

## Project Structure

```
/
├── frontend/          # React + TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── services/
│   └── package.json
│
└── backend/           # Node.js + Express backend
    ├── src/
    │   ├── models/
    │   ├── routes/
    │   ├── middleware/
    │   └── config/
    └── package.json
```

## Features

### Admin Features
- Separate admin login page (`/admin-login`)
- Only one admin email allowed (configured in `.env`)
- Create and manage elections
- Add/edit/delete positions
- Approve/reject candidate applications
- View all votes and results
- View statistics (total users, voters, turnout)
- Export results as CSV

### Member Features
- Sign up with mandatory profile photo (JPG/PNG, max 2MB)
- Login and profile management
- Apply as candidate for elected positions
- Vote once per position
- View results after election ends
- View leadership (fixed positions)

### Voting System
- One vote per position per user
- Candidates displayed in random order
- Votes are timestamped
- Results hidden until election ends
- Secure backend validation prevents duplicate voting

### Position Logic
- **Fixed Positions**: President, Vice President (not elected, shown in Leadership section)
- **Elected Positions**: General Secretary, Treasurer, Technical Head, etc. (appear on voting page)

## Tech Stack

- **Frontend**: React 18, TypeScript, React Router
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Authentication**: JWT tokens
- **File Upload**: Multer (local storage)
- **Styling**: CSS3 with mobile-first responsive design

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/voting-system
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
ADMIN_EMAIL=admin@club.com
NODE_ENV=development
```

5. Make sure MongoDB is running

6. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Member signup
- `POST /api/auth/login` - Member login
- `POST /api/auth/admin-login` - Admin login
- `GET /api/auth/me` - Get current user

### Positions
- `GET /api/positions` - Get all positions
- `GET /api/positions/elected` - Get elected positions
- `GET /api/positions/fixed` - Get fixed positions

### Candidates
- `GET /api/candidates/approved` - Get approved candidates
- `GET /api/candidates/position/:positionId` - Get candidates for position
- `POST /api/candidates/apply` - Apply as candidate (member)
- `GET /api/candidates/my-applications` - Get own applications (member)

### Elections
- `GET /api/elections` - Get all elections
- `GET /api/elections/active` - Get active election

### Votes
- `POST /api/votes/cast` - Cast vote (member)
- `GET /api/votes/check/:electionId/:positionId` - Check if voted
- `GET /api/votes/my-votes` - Get own votes

### Results
- `GET /api/results/election/:electionId` - Get results (only if ended)
- `GET /api/results/summary/:electionId` - Get detailed results (admin)
- `GET /api/results/export/:electionId` - Export CSV (admin)

### Admin Routes (require admin auth)
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - Get all users
- `GET /api/admin/positions` - Get all positions
- `POST /api/admin/positions` - Create position
- `PUT /api/admin/positions/:id` - Update position
- `DELETE /api/admin/positions/:id` - Delete position
- `GET /api/admin/candidates` - Get all candidates
- `PUT /api/admin/candidates/:id/approve` - Approve candidate
- `PUT /api/admin/candidates/:id/reject` - Reject candidate
- `DELETE /api/admin/candidates/:id` - Delete candidate
- `GET /api/admin/elections` - Get all elections
- `POST /api/admin/elections` - Create election
- `PUT /api/admin/elections/:id` - Update election
- `DELETE /api/admin/elections/:id` - Delete election
- `GET /api/admin/statistics` - Get statistics

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Admin route protection
- Member route protection
- File upload validation (type and size)
- Duplicate vote prevention
- Single admin email restriction

## Important Notes

1. **Admin Setup**: The admin account is created automatically on first admin login. Only the email specified in `ADMIN_EMAIL` can login as admin.

2. **Profile Photos**: All profile photos are stored in `backend/uploads/` directory. Make sure this directory exists and has write permissions.

3. **Database**: The application uses MongoDB. Make sure MongoDB is installed and running before starting the backend.

4. **CORS**: Backend is configured to accept requests from `http://localhost:3000`. Update CORS settings for production.

5. **Environment Variables**: Never commit `.env` files. Use `.env.example` as a template.

## Production Deployment

1. Set `NODE_ENV=production` in backend `.env`
2. Build frontend: `cd frontend && npm run build`
3. Serve frontend build files using a web server (nginx, Apache, etc.)
4. Use a process manager (PM2) for the backend
5. Configure MongoDB connection string for production database
6. Use a secure JWT secret
7. Configure proper CORS origins
8. Set up SSL/HTTPS

## License

This project is for educational purposes.

