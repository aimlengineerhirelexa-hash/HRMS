# HRMS Frontend - Human Resource Management System

## Project Overview

This is the frontend application for a comprehensive Human Resource Management System built with React, TypeScript, and modern web technologies.

## Features

- **Employee Management**: Complete employee lifecycle management
- **Payroll Processing**: Salary calculations and payroll management
- **Attendance Tracking**: Time and attendance monitoring
- **Performance Reviews**: Employee performance evaluation system
- **Analytics Dashboard**: Real-time HR metrics and insights
- **Role-based Access Control**: Secure access based on user roles

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components
- **React Query** for data fetching
- **React Router** for navigation

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend server running (see backend README)

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard components
│   ├── layout/         # Layout components (Header, Sidebar)
│   └── ui/             # Base UI components
├── contexts/           # React contexts (Auth, etc.)
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API services
└── types/              # TypeScript type definitions
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## Contributing

1. Follow the existing code style and patterns
2. Use TypeScript for type safety
3. Follow component composition patterns
4. Test your changes thoroughly

## License

This project is part of the HRMS system.
