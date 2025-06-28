# 🚁 Drone Dispatch API

A robust NestJS backend service for managing a fleet of medication-delivery  
drones. This API enables registration, loading, and dispatching of drones,  
tracks the delivery lifecycle, manages medications, and provides comprehensive  
audit logging of state changes and battery levels.

---

## 🔧 Project Overview

The Drone Dispatch API is designed to:

- **Register and manage** a fleet of drones for medication delivery
- **Load drones** with medications and track delivery progress
- **Audit all activities** including state changes and battery monitoring
- **Provide a clean REST API** with comprehensive Swagger documentation
- **Support delivery workflows** from loading to completion and return

---

## 🚀 Features

### Drone Management

- **Register drones** with serial numbers, models, and specifications
- **List and filter drones** by state, model, battery level, and availability
- **Update drone states** through the delivery lifecycle
- **Monitor battery levels** with automated cron-based checks

### Delivery Workflow

- **Load medications** onto drones with weight validation
- **Initiate deliveries** with state transitions
- **Complete deliveries** and manage return processes
- **Track delivery status** through the entire lifecycle

### Medication Management

- **CRUD operations** for medication inventory
- **Batch loading** by medication codes
- **Weight validation** against drone capacity limits
- **Relationship management** with drone assignments

### Audit & Monitoring

- **State change logging** for all drone operations
- **Battery level audits** via automated cron jobs
- **Comprehensive audit trail** for compliance and debugging
- **Real-time monitoring** capabilities

### API Documentation

- **Interactive Swagger UI** at `/docs`
- **OpenAPI specification** for integration at `/spec`
- **Comprehensive endpoint documentation**
- **Request/response examples**

---

## 📦 Getting Started

### Prerequisites

- **Node.js** (v16+ recommended)
- **npm** or **Yarn**
- **Git** for cloning the repository
- _(Optional)_ **Docker** for containerized deployment

### Installation

```bash
# Clone the repository
git clone https://github.com/La-BeTe/drone-dispatch-api.git
cd drone-dispatch-api

# Install dependencies
npm install

# Set up environment configuration
cp .env.example .env
# Edit .env with your preferred settings
```

### Running the Development Server

```bash
# Start in development mode (with hot reload)
npm run start:dev

# Or start in production mode
npm run start
```

- **API Server**: `http://localhost:3000`
- **Swagger UI**: `http://localhost:3000/docs`
- **Health Check**: `http://localhost:3000/health`

---

## 📚 API Endpoints

| Method     | Path                  | Description                      | Parameters                                                |
| ---------- | --------------------- | -------------------------------- | --------------------------------------------------------- |
| **POST**   | `/drones`             | Register a new drone             | `serialNumber`, `model`, `weightLimit`, `batteryCapacity` |
| **GET**    | `/drones`             | List drones with pagination      | `state`, `model`, `page`, `limit`                         |
| **GET**    | `/drones/:id`         | Get drone details                | `id` (path parameter)                                     |
| **PATCH**  | `/drones/:id`         | Update drone state/battery       | `state`, `batteryCapacity`                                |
| **POST**   | `/drones/:id/load`    | Load drone with medications      | `medicationCodes`                                         |
| **GET**    | `/drones/:id/battery` | Get drone battery level          | `id` (path parameter)                                     |
| **GET**    | `/medications`        | List medications with pagination | `droneId`, `page`, `limit`                                |
| **POST**   | `/medications`        | Create a medication              | `name`, `weight`, `code`, `image`                         |
| **GET**    | `/medications/:id`    | Get medication details           | `id` (path parameter)                                     |
| **PATCH**  | `/medications/:id`    | Update medication details        | `name`, `weight`, `code`, `image`                         |
| **DELETE** | `/medications/:id`    | Delete a medication              | `id` (path parameter)                                     |

### Response Format

All API responses follow a consistent structure:

```json
{
	"success": true,
	"data": {
		/* response data */
	},
	"message": "An error occurred" /* in case of an error */
}
```

Paginated endpoints include additional metadata:

```json
{
	"success": true,
	"data": [
		/* items */
	],
	"meta": {
		"page": 1,
		"limit": 10,
		"total": 25,
		"totalPages": 3,
		"hasNextPage": true,
		"hasPrevPage": false
	}
}
```

---

## 🛠️ Available Scripts

| Script               | Description                              |
| -------------------- | ---------------------------------------- |
| `npm start`          | Start the application in production mode |
| `npm run start:dev`  | Start with hot reload for development    |
| `npm run build`      | Compile TypeScript to JavaScript         |
| `npm test`           | Run unit tests                           |
| `npm run test:watch` | Run tests in watch mode                  |
| `npm run seed`       | Seed database with sample data           |

---

## 🗄️ Database Configuration

- **Database**: SQLite via TypeORM
- **Default Location**: `./data/db.sqlite`
- **Auto-migration**: Enabled in development (`synchronize: true`)
- **Production**: Set `synchronize: false` and use migrations

### Database Schema

- **Drones**: Core drone information and states
- **Medications**: Medication inventory and specifications
- **Audit Logs**: State changes and battery monitoring
- **Relationships**: Many-to-many drone-medication associations

---

## ⚙️ Configuration

Environment variables can be configured in your `.env` file:

```env
# Server Configuration
PORT=3000

# Database Configuration
DB_PATH=./data/db.sqlite
DB_SYNC=true
```

### Environment Variables

| Variable  | Description               | Default            |
| --------- | ------------------------- | ------------------ |
| `PORT`    | Server port               | `3000`             |
| `DB_PATH` | SQLite database path      | `./data/db.sqlite` |
| `DB_SYNC` | Auto-sync database schema | `true`             |

---

## 🧪 Testing & Documentation

### Swagger UI

Access the interactive API documentation:

1. Start the development server: `npm run start:dev`
2. Open your browser to: `http://localhost:3000/docs`
3. Explore endpoints, test requests, and view schemas

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- medication.service.spec.ts
```

---

## 📏 Code Style & Formatting

- **Prettier**: Code formatting with 4-space tabs
- **ESLint**: Code quality and consistency
- **TypeScript**: Strict type checking enabled
- **NestJS**: Follows NestJS best practices and patterns

---

### Drone States

1. **IDLE**: Ready for loading
2. **LOADING**: Currently being loaded
3. **LOADED**: Ready for delivery
4. **DELIVERING**: In transit
5. **DELIVERED**: Delivery completed
6. **RETURNING**: Returning to base

---

## 🔒 Security & Validation

- **Input Validation**: All endpoints validate input using class-validator
- **Error Handling**: Comprehensive error responses with proper HTTP status codes
- **Data Integrity**: Foreign key constraints and relationship management
- **Audit Trail**: Complete logging of all state changes and operations

---

## 🚀 Deployment

### Production Considerations

1. **Database**: Use PostgreSQL or MySQL for production
2. **Environment**: Set `NODE_ENV=production`
3. **Synchronize**: Disable auto-sync (`DB_SYNC=false`)
4. **Logging**: Configure proper logging levels
5. **Security**: Implement authentication and authorization

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [NestJS](https://nestjs.com/)
- Database management with [TypeORM](https://typeorm.io/)
- API documentation with [Swagger](https://swagger.io/)
- Testing with [Jest](https://jestjs.io/)

---

### 🚁 Happy Flying!

_Ready to dispatch your first drone? Start with the [Getting Started](#-getting-started) section above!_
