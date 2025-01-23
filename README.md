# Organizational Feedback System

A secure feedback system that allows employees to submit feedback to leadership with optional anonymity.

## Current Implementation Status

### Completed Features
- Basic project structure (frontend/backend)
- Development authentication system
- Role-based access control structure
- Basic frontend components:
  - Dashboard view
  - Feedback submission
  - Feedback listing
  - Feedback details
- Backend API structure
- Environment configuration
- TypeScript integration

### In Development
- Okta authentication integration
- Feedback management features
- Dashboard analytics
- Testing implementation

## Development Setup

### Prerequisites
- Node.js >= 16.0.0
- MongoDB >= 5.0
- npm or yarn

### Getting Started

1. Clone the repository
```bash
git clone <repository-url>
cd feedback-system
```

2. Install dependencies
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables
```bash
# Backend
cd backend
cp .env.example .env

# Frontend
cd ../frontend
cp .env.example .env
```

4. Start development servers
```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm run dev
```

### Development Authentication

The system currently uses mock authentication for development:

- Available mock users:
  - Employee: employee@example.com
  - Leader: leader@example.com
  - Admin: admin@example.com

Authentication is automatically bypassed in development mode for easier testing.

## Project Structure

```
feedback-system/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   └── types/          # TypeScript types
│   └── tests/              # Backend tests
└── frontend/
    ├── src/
    │   ├── components/     # React components
    │   ├── pages/          # Page components
    │   ├── config/         # Configuration
    │   └── types/          # TypeScript types
    └── public/             # Static files
```

## Available Scripts

### Backend
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm test`: Run tests

### Frontend
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run serve`: Preview production build
- `npm run lint`: Run linter
- `npm run format`: Format code

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the GPL License.
