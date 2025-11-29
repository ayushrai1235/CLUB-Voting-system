# UI Refactor Guide - Black & White Professional Design

## ✅ Completed Changes

### 1. Infrastructure Setup
- ✅ Tailwind CSS configured with dark mode support
- ✅ shadcn UI components (Button, Card)
- ✅ Theme context with light/dark toggle
- ✅ Professional black & white color scheme

### 2. Core Components
- ✅ **Navbar** - Clean, minimal with theme toggle
- ✅ **Sidebar** - Professional admin navigation
- ✅ **ThemeToggle** - Smooth light/dark switch
- ✅ **Button** - shadcn UI button component
- ✅ **Card** - shadcn UI card component

### 3. Refactored Pages
- ✅ **Home** - Clean landing page
- ✅ **Login** - Professional auth form
- ✅ **Signup** - Clean signup with photo upload
- ✅ **AdminLogin** - Minimal admin login
- ✅ **AdminDashboard** - Uses AdminLayout
- ✅ **AdminOverview** - Dashboard stats with icons
- ✅ **ManagePositions** - Full CRUD with modals
- ✅ **ManageCandidates** - Candidate review interface

## 🎨 Design System

### Colors
- **Light Theme**: White background (#ffffff), black text
- **Dark Theme**: Dark background (#0a0a0a), white text
- **Accent**: Black/White only (no purple/colors)
- **Borders**: Subtle gray borders
- **Cards**: Clean white/dark cards with subtle shadows

### Typography
- Headings: `text-2xl font-semibold`
- Labels: `text-sm text-muted-foreground`
- Body: Standard system fonts

### Components
- All buttons use shadcn UI Button component
- All cards use shadcn UI Card component
- Consistent spacing and borders
- Professional, minimal aesthetic

## 📦 Installation

1. Install dependencies:
```bash
cd frontend
npm install
```

2. The following packages are now included:
- `tailwindcss` - Styling
- `clsx` & `tailwind-merge` - Utility functions
- `lucide-react` - Icons

## 🚀 Usage

### Theme Toggle
The theme toggle is automatically included in the Navbar. Users can switch between light and dark modes.

### Using Components

```tsx
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

// Button examples
<Button>Primary Button</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="destructive">Delete</Button>

// Card example
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

## 📝 Remaining Pages to Refactor

The following pages still need to be updated to match the new design:

1. **ManageElections** - Election management
2. **AdminStatistics** - Statistics dashboard
3. **Voting** - Voting interface
4. **Results** - Results display
5. **Profile** - User profile
6. **CandidateApplication** - Application form
7. **Leadership** - Leadership page

All should follow the same pattern:
- Use shadcn UI components
- Black & white color scheme
- Clean, minimal design
- Responsive layout
- Dark mode support

## 🎯 Design Principles

1. **Minimal** - No unnecessary decorations
2. **Professional** - Clean, business-like appearance
3. **Readable** - High contrast, clear typography
4. **Consistent** - Same components and patterns throughout
5. **Accessible** - Proper focus states and ARIA labels

## 🔧 Customization

To adjust colors, edit `frontend/src/index.css`:
- Light theme colors are in `:root`
- Dark theme colors are in `.dark`
- All use HSL values for easy adjustment

