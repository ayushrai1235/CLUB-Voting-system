# Voting System Frontend

Frontend application for the College Coding Club Voting System built with React and TypeScript.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file with your backend API URL:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`.

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Features

- **Member Authentication**: Sign up and login with profile photo requirement
- **Admin Authentication**: Separate admin login page
- **Voting Interface**: Vote for candidates with random order display
- **Candidate Application**: Apply to run for positions
- **Results Display**: View election results after voting ends
- **Admin Dashboard**: Manage positions, candidates, elections, and view statistics
- **Responsive Design**: Mobile-first, fully responsive UI

## Project Structure

```
src/
  components/     # Reusable components
  pages/          # Page components
  context/        # React context (Auth)
  services/       # API service
```

