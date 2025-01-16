# Organizational Feedback System

A secure and anonymous feedback system that allows employees to submit feedback to leadership through Okta authentication.

## Features

- **Authentication & Authorization**
  - Okta integration for secure authentication
  - Role-based access control (Admin, Leader, Employee)
  - Optional anonymous feedback submission

- **Feedback Management**
  - Submit, edit, and delete feedback
  - Tag and categorize feedback
  - Track feedback status (New, In Action, Hold, Closed)
  - Assign feedback to specific leaders

- **Dashboard & Analytics**
  - Customizable charts and metrics
  - Filter by tags, status, and date ranges
  - Track anonymous vs. identified feedback ratios

## Tech Stack

- **Backend**
  - Node.js + Express
  - TypeScript
  - MongoDB with Mongoose
  - Okta JWT Verification

- **Frontend**
  - React
  - TypeScript
  - Material-UI
  - React Query

## Prerequisites

- Node.js >= 16.0.0
- MongoDB >= 5.0
- Okta Developer Account

## Getting Started

1. **Clone the repository**
   ```bash
   git clone git@github.com:harinee/feedback-system.git
   cd feedback-system
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Backend configuration
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development servers**
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend server
   cd frontend
   npm start
   ```

## Development Guidelines

### Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages following conventional commits

### Testing

- Maintain high test coverage (target: 99%+)
- Write unit tests for all new features
- Include integration tests for API endpoints
- Run performance tests for critical paths

### Security

- Follow OWASP Top 10 guidelines
- Validate and sanitize all inputs
- Use proper error handling
- Implement rate limiting
- Keep dependencies updated

## API Documentation

API documentation is available at `/api/docs` when running the development server.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Pull Request Guidelines

- Include tests for new features
- Update documentation as needed
- Follow the existing code style
- Keep changes focused and atomic

## License

This project is licensed under the GPL License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository.
