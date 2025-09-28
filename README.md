# SIT774 Web Application - DevOps Pipeline

A Node.js web application for scenario discussion platform with comprehensive DevOps pipeline implementation using Jenkins.

## Project Overview

This web application allows users to:
- Submit and view scenarios with descriptions and tags
- Upload images for scenarios
- Participate in discussions with comments
- Browse all scenarios with filtering capabilities
- Submit contact forms

## Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: SQLite with custom scenarioDB module
- **Frontend**: HTML, CSS, JavaScript (served via EJS templates)
- **File Upload**: Multer middleware
- **Testing**: Jest with Supertest
- **DevOps**: Jenkins Pipeline, Docker

## Project Structure

```
├── server/
│   ├── app.js              # Main Express application
│   └── scenarioDB.js       # Database connection and operations
├── public/
│   ├── index.html          # Home page
│   └── ...                 # Static assets (CSS, JS, images)
├── tests/
│   └── app.test.js         # Jest test suite
├── views/                  # EJS templates
├── uploads/                # User uploaded images
├── package.json            # Node.js dependencies
├── Dockerfile              # Docker containerization
├── Jenkinsfile             # CI/CD pipeline definition
└── README.md               # Project documentation
```

## Prerequisites

- Node.js 14+ 
- npm 6+
- Docker (for containerization)
- Jenkins (for CI/CD pipeline)

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SIT774-DevOps-Pipeline
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create required directories**
   ```bash
   mkdir uploads
   mkdir views
   ```

4. **Run the application**
   ```bash
   npm start
   ```
   
   The application will be available at `http://localhost:3000`

## Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## API Endpoints

- `GET /` - Home page
- `GET /health` - Health check endpoint
- `POST /submit` - Submit new scenario with image upload
- `GET /all-scenarios` - Retrieve all scenarios (JSON API)
- `POST /contact` - Submit contact form
- `GET /discussion/:id` - View specific scenario discussion
- `POST /discussion/:id/comment` - Add comment to scenario

## DevOps Pipeline

This project implements a comprehensive Jenkins CI/CD pipeline with the following stages:

### Implemented Stages
- **Build**: Creates Docker images and npm artifacts
- **Test**: Runs Jest test suite with coverage reporting
- **Code Quality**: SonarQube analysis for code maintainability
- **Security**: Vulnerability scanning with npm audit and Snyk
- **Deploy**: Automated deployment to staging environment
- **Release**: Production deployment with versioning
- **Monitoring**: Application monitoring and alerting

### Running the Pipeline

1. Push code to the main branch
2. Jenkins automatically triggers the pipeline
3. Each stage must pass before proceeding to the next
4. Failed stages stop the pipeline and notify the team

## Docker Support

Build Docker image:
```bash
docker build -t sit774-webapp .
```

Run container:
```bash
docker run -p 3000:3000 sit774-webapp
```

## Environment Variables

- `NODE_ENV` - Set to 'test' for testing, 'production' for production
- `PORT` - Server port (default: 3000)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests to ensure they pass
5. Submit a pull request

## Database Schema

### Scenario Table
- `id` - Primary key
- `title` - Scenario title
- `description` - Scenario description
- `author` - Author name
- `tags` - JSON array of tags
- `upvotes` - Number of upvotes
- `downvotes` - Number of downvotes
- `imageUrl` - Uploaded image filename
- `status` - Scenario status
- `createdAt` - Creation timestamp

### Comment Table
- `id` - Primary key
- `scenario_id` - Foreign key to scenario
- `author` - Comment author
- `comment` - Comment text
- `timestamp` - Comment timestamp

### Contact Table
- `id` - Primary key
- `name` - Contact name
- `email` - Contact email
- `phone` - Contact phone
- `message` - Contact message
- `submittedAt` - Submission timestamp

## License

This project is created for educational purposes as part of SIT774 coursework.

## Author

Bisheshwar Das - Deakin University SIT774 Student

## Pipeline Status



## Demo Video


## Additional Notes

- All tests must pass before deployment
- Code quality gates are enforced through SonarQube
- Security vulnerabilities are automatically scanned and reported
- Monitoring alerts are configured for production environment
- Database is automatically backed up before deployments