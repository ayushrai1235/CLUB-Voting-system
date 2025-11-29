# Voting System Backend

Backend API for the College Coding Club Voting System.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure random string for JWT token signing
- `ADMIN_EMAIL`: The email address for admin login (only this email can login as admin)

4. Make sure MongoDB is running on your system.

5. Start the server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000` by default.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Member signup (requires profile photo)
- `POST /api/auth/login` - Member login
- `POST /api/auth/admin-login` - Admin login
- `GET /api/auth/me` - Get current user (requires auth)

### Positions
- `GET /api/positions` - Get all positions
- `GET /api/positions/elected` - Get elected positions only
- `GET /api/positions/fixed` - Get fixed positions only

### Candidates
- `GET /api/candidates/approved` - Get all approved candidates
- `GET /api/candidates/position/:positionId` - Get candidates for a position
- `POST /api/candidates/apply` - Apply as candidate (member only)
- `GET /api/candidates/my-applications` - Get own applications (member only)

### Elections
- `GET /api/elections` - Get all elections
- `GET /api/elections/active` - Get active election
- `GET /api/elections/:id` - Get single election

### Votes
- `POST /api/votes/cast` - Cast a vote (member only)
- `GET /api/votes/check/:electionId/:positionId` - Check if voted (member only)
- `GET /api/votes/my-votes` - Get own votes (member only)

### Results
- `GET /api/results/election/:electionId` - Get election results (only if ended)
- `GET /api/results/summary/:electionId` - Get detailed results (admin can see anytime)
- `GET /api/results/export/:electionId` - Export results as CSV (admin only)

### Admin Routes (require admin authentication)
- `GET /api/admin/dashboard` - Dashboard statistics
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
- `GET /api/admin/statistics` - Get voting statistics

## Notes

- Profile photos are stored in the `uploads/` directory
- Only JPG and PNG files up to 2MB are accepted
- Admin email is set in `.env` file - only this email can login as admin
- JWT tokens expire after 7 days

