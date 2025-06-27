# Drone Dispatch API

This is a NestJS-based backend service that manages a fleet of medication-delivery drones. The API allows you to register drones, load them with medications, simulate delivery lifecycles, and audit both state changes and battery levels.

---

## 🔧 Features

### Drone Management

- **Register a drone**: `POST /drones`
- **List drones** with optional filters: `GET /drones?state=<state>|available&model=<model>&batteryCapacityMin=<value>`
- **Get a single drone**: `GET /drones/:id`
- **Query battery level**: `GET /drones/:id?info=battery`

### Delivery Workflow

- **Load medications onto a drone**: `POST /drones/:id/load` (body: `{ medicationIds: string[] }`)
  - Validates `batteryCapacity >= 25%` and `state === IDLE`
  - Ensures total medication weight ≤ `weightLimit`
- **Begin delivery**: `POST /drones/:id/deliver` (transitions `LOADED → DELIVERING → DELIVERED → RETURNING → IDLE` asynchronously)
- **Manually complete delivery**: `POST /drones/:id/complete-delivery`
- **Reset drone to idle**: `POST /drones/:id/unload`

### Medication Management

- **Create a medication**: `POST /medications`
- **List medications** or **filter by drone**: `GET /medications?droneId=<droneId>`
- **Get a medication**: `GET /medications/:id`
- **Delete a medication**: `DELETE /medications/:id`

### Audit Logging

- All state changes and periodic battery checks are recorded in a single `AuditLog` table with flexible `metadata` for event details.
- **Cron job** runs every hour to log battery levels automatically.

### API Documentation (Swagger/OpenAPI)

Available at: `GET /docs`

---

## 🚀 Getting Started Locally

### Prerequisites

- Node.js v16+
- npm or Yarn
- (Optional) Docker, if running a different database

### Installation

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd drone-dispatch-api-assessment
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or yarn install
   ```

3. **Configure environment variables**
   Create a `.env` file in the project root:

   ```ini
   DB_PATH=./db.sqlite
   DB_SYNC=true
   ```

4. **Build the project**

   ```bash
   npm run build
   ```

5. **Seed the database with demo data**

   ```bash
   node dist/seed.js
   ```

6. **Run the development server**

   ```bash
   npm run start:dev
   ```

   - The app will start on `http://localhost:3000`
   - Swagger UI available at `http://localhost:3000/docs`

7. **Interact with the API**
   Use tools like curl, Postman, or Swagger UI to call the endpoints listed above.

---

## 📝 Scripts

- `npm run start` — start in production mode
- `npm run start:dev` — start in development mode with hot reload
- `npm run build` — compile TypeScript to JavaScript
- `node dist/seed.js` — seed the database with demo drones and medications

---

## 📦 Database

- Uses **SQLite** by default via TypeORM (file: `./db.sqlite`)
- Entities are synchronized automatically in development (`synchronize: true` in `TypeOrmModule`)
- Seed script will clear and repopulate the database with 10 drones and several medications

---

## 🧪 Testing

- Unit and e2e tests can be run with:
  ```bash
  npm run test
  npm run test:e2e
  ```

---

## 📖 License

[MIT](LICENSE)
