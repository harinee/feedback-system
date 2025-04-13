# Organizational Feedback System

A secure feedback system that allows employees to submit feedback to leadership with optional anonymity.

## Current Implementation Status

### Completed Features
- Basic project structure (frontend/backend)
- Authentication system:
  - Mock authentication for development
  - Okta integration structure (prepared but not fully implemented)
- Role-based access control structure with three roles:
  - Employee: Can submit and view own feedback
  - Leader: Can view and manage feedback
  - Admin: Full system access
- Basic frontend components built with React and Material UI:
  - Dashboard view
  - Feedback submission
  - Feedback listing
  - Feedback details
- Backend API structure for feedback management
- Environment configuration
- TypeScript integration
- Vite build system for frontend

### In Development
- Full Okta authentication implementation
- Feedback management features
- Dashboard analytics
- Testing implementation

## Development Setup

### Prerequisites
- Node.js >= 16.0.0
- MongoDB >= 5.0
- npm or yarn
- Okta account (for production)

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

4. Configure Environment Variables

#### Backend (.env)
```
# Node Environment
NODE_ENV=development
PORT=3001

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/feedback-system
MONGODB_POOL_SIZE=10
MONGODB_MAX_IDLE_TIME_MS=30000

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Okta Configuration (for production)
OKTA_ISSUER=https://your-okta-domain/oauth2/default
OKTA_CLIENT_ID=your-client-id

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX=100

# Logging
LOG_LEVEL=info

# JWT Configuration
JWT_EXPIRY=1h
```

#### Frontend (.env)
```
# Okta Configuration (for production)
VITE_OKTA_ISSUER=https://your-okta-domain/oauth2/default
VITE_OKTA_CLIENT_ID=your-client-id

# API Configuration
VITE_API_URL=http://localhost:3001/api

# Environment
VITE_NODE_ENV=development
```

5. Start development servers
```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm run dev
```

### Authentication Modes

#### Development Mode
The system uses mock authentication with predefined users:
- Employee: employee@example.com (role: employee)
- Leader: leader@example.com (role: leader)
- Admin: admin@example.com (role: admin)

When testing the API directly, you can use the `x-mock-user` header with one of these values:
- `mock-employee` - For employee access
- `mock-leader` - For leader access
- `mock-admin` - For admin access

Example:
```bash
curl -H "x-mock-user: mock-leader" http://localhost:3001/api/feedback
```

#### Production Mode
Uses Okta authentication when proper credentials are configured in environment variables. Note that the Okta implementation is currently prepared but commented out in the codebase for future use.

## Project Structure

```
feedback-system/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utility functions
│   │   └── config/         # Configuration files
│   └── tests/              # Backend tests
└── frontend/
    ├── src/
    │   ├── components/     # React components
    │   ├── pages/          # Page components
    │   ├── config/         # Configuration
    │   ├── types/          # TypeScript types
    │   └── theme.ts        # Material UI theme
    └── public/             # Static files
```

## Available Scripts

### Backend
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm test`: Run tests

### Frontend (Vite)
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run linter
- `npm run format`: Format code

## Feedback Model

The system uses the following model for feedback:

- `content`: The feedback text content
- `isAnonymous`: Boolean flag indicating if the feedback is anonymous
- `submitter`: Reference to the user who submitted the feedback (omitted for anonymous feedback)
- `status`: Current status of the feedback, one of:
  - `New`: Newly submitted feedback
  - `In Action`: Feedback being addressed
  - `Hold`: Feedback on hold
  - `Closed`: Feedback resolved or closed

## API Endpoints

### Feedback Endpoints

- `GET /api/feedback`: Get all feedback (requires leader or admin role)
- `POST /api/feedback`: Submit new feedback (all authenticated users)
- `GET /api/feedback/:id`: Get specific feedback by ID
- `PUT /api/feedback/:id`: Update feedback status (requires leader or admin role)
- `DELETE /api/feedback/:id`: Delete feedback (requires admin role)

## Static File Serving

The backend is configured to serve static files from:
- `frontend/public` directory during development
- `frontend/build` directory in production (if it exists)

This allows the application to be deployed as a single unit.

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the GPL License.
