
# 36 Pics

A minimalist photo capture web application that limits users to 36 photos per trip, inspired by the nostalgia of film roll cameras.

![36 Pics App](https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=1200&h=400)

## Purpose

36 Pics is designed to bring back the mindfulness and intention of film photography in our digital age. By limiting each "trip" to only 36 exposures (just like a traditional film roll), the app encourages users to be more selective and thoughtful about the moments they choose to capture.

## Features

- Create themed photo trips with custom names
- Limited to 36 photos per trip (just like a film roll)
- Vintage camera interface with film-like visual effects
- Nostalgic photo gallery with Polaroid-style presentation
- Haptic feedback that simulates mechanical camera operation
- Responsive design that works on mobile and desktop devices

## Tech Stack

- **React 18** - Frontend library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Navigation and routing
- **Framer Motion** - Animations
- **React Query** - Data fetching and state management
- **shadcn/ui** - UI component library

## Folder Structure

```
36-pics/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── context/         # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── models/          # TypeScript interfaces/types
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── styles/          # Global styles
│   ├── App.tsx          # Main App component
│   └── main.tsx         # Entry point
├── index.html           # HTML entry point
├── package.json         # Dependencies and scripts
└── vite.config.ts       # Vite configuration
```

## Setup Instructions

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/36-pics.git
   cd 36-pics
   ```

2. Install dependencies:
   ```bash
   yarn install
   # or
   npm install
   ```

3. Start the development server:
   ```bash
   yarn dev
   # or
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:8080/
   ```

## Pushing to GitHub

To push this project to a new GitHub repository:

1. Create a new repository on GitHub (optionally make it private)
2. Initialize Git in your project (if not already initialized):
   ```bash
   git init
   ```
3. Add all files to Git:
   ```bash
   git add .
   ```
4. Commit the files:
   ```bash
   git commit -m "Initial commit"
   ```
5. Add your GitHub repository as a remote:
   ```bash
   git remote add origin https://github.com/yourusername/36-pics.git
   ```
6. Push to GitHub:
   ```bash
   git push -u origin main
   ```

## License

MIT
