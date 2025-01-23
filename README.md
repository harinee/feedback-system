# Organizational Feedback System

A secure feedback system that allows employees to submit feedback to leadership with optional anonymity.

## Current Implementation Status

### Completed Features
- Basic project structure (frontend/backend)
- Authentication system:
  - Okta integration structure
  - Development mode with mock authentication
  - Production-ready Okta configuration
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

4. Configure Authentication
- Development: Uses mock authentication by default
- Production: Update .env files with your Okta credentials:
  ```
  # Backend .env
  OKTA_ISSUER=https://your-domain.okta.com/oauth2/default
  OKTA_CLIENT_ID=your-client-id

  # Frontend .env
  VITE_OKTA_ISSUER=https://your-domain.okta.com/oauth2/default
  VITE_OKTA_CLIENT_ID=your-client-id
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
- Employee: employee@example.com
- Leader: leader@example.com
- Admin: admin@example.com

#### Production Mode
Uses Okta authentication when proper credentials are configured in environment variables.

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
