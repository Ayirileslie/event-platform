# Event Management Platform

A full-stack serverless event management platform built with React, AWS CDK, Lambda, DynamoDB, and API Gateway.

## 🌐 Live Site

**Frontend:**  https://event-platform-vite-project.vercel.app/login 
**API Gateway:**  https://rfim8ivv3h.execute-api.us-east-1.amazonaws.com

---

## 📋 Features

### For Attendees
- ✅ Browse all available events
- ✅ Filter events by date range
- ✅ View detailed event information
- ✅ Register for events (with capacity validation)
- ✅ View registered events
- ✅ Cancel event registrations

### For Organizers
- ✅ Create new events
- ✅ View all created events
- ✅ View registrations for each event
- ✅ Track event capacity and attendee details

### General
- ✅ Secure authentication with JWT
- ✅ Role-based access control (Organizer/Attendee)
- ✅ Responsive UI with Tailwind CSS
- ✅ Serverless architecture for scalability

---

## 🛠️ Tech Stack

### Frontend
- **React** (Vite)
- **TypeScript**
- **Tailwind CSS**
- **React Router**

### Backend
- **AWS Lambda** (Node.js 20.x)
- **API Gateway** (HTTP API)
- **DynamoDB** (Single-table design)
- **AWS CDK** (Infrastructure as Code)

### Authentication
- **JWT** (JSON Web Tokens)
- **bcrypt** (Password hashing)

---

## 📡 API Endpoints

**Base URL:** `https://rfim8ivv3h.execute-api.us-east-1.amazonaws.com`

All endpoints (except authentication) require an `Authorization: Bearer {token}` header.

### Authentication

#### Sign Up
```http
POST /auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "attendee" // or "organizer"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "john@example.com",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "attendee"
  },
  "message": "Signup successful"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "john@example.com",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "attendee"
  }
}
```

---

### Events

#### List All Events
```http
GET /events/all
```

**Response:**
```json
[
  {
    "PK": "EVENT#uuid",
    "SK": "DETAILS",
    "name": "Tech Conference 2024",
    "description": "Annual tech conference",
    "date": "2024-12-15",
    "location": "San Francisco, CA",
    "capacity": 100,
    "organizerId": "organizer@example.com",
    "createdAt": "2024-11-01T10:00:00.000Z"
  }
]
```

#### Get Single Event
```http
GET /events/{eventId}
```

**Response:**
```json
{
  "PK": "EVENT#uuid",
  "SK": "DETAILS",
  "name": "Tech Conference 2024",
  "description": "Annual tech conference",
  "date": "2024-12-15",
  "location": "San Francisco, CA",
  "capacity": 100,
  "organizerId": "organizer@example.com",
  "createdAt": "2024-11-01T10:00:00.000Z"
}
```

#### List My Events (Organizer Only)
```http
GET /events/my-events
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "PK": "EVENT#uuid",
    "SK": "DETAILS",
    "name": "My Event",
    "description": "Event description",
    "date": "2024-12-15",
    "location": "New York, NY",
    "capacity": 50,
    "organizerId": "organizer@example.com",
    "createdAt": "2024-11-01T10:00:00.000Z"
  }
]
```

#### Create Event (Organizer Only)
```http
POST /events/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Tech Conference 2024",
  "description": "Annual tech conference",
  "date": "2024-12-15",
  "location": "San Francisco, CA",
  "capacity": 100
}
```

**Response:**
```json
{
  "PK": "EVENT#uuid",
  "SK": "DETAILS",
  "name": "Tech Conference 2024",
  "description": "Annual tech conference",
  "date": "2024-12-15",
  "location": "San Francisco, CA",
  "capacity": 100,
  "organizerId": "organizer@example.com",
  "createdAt": "2024-11-01T10:00:00.000Z"
}
```

#### Get Event Registrations (Organizer Only)
```http
GET /events/{eventId}/registrations
Authorization: Bearer {token}
```

**Response:**
```json
{
  "event": {
    "PK": "EVENT#uuid",
    "name": "Tech Conference 2024",
    "date": "2024-12-15",
    "location": "San Francisco, CA",
    "capacity": 100
  },
  "registrations": [
    {
      "PK": "REG#eventId",
      "SK": "USER#user@example.com",
      "userId": "user@example.com",
      "eventId": "eventId",
      "registeredAt": "2024-11-02T10:00:00.000Z",
      "user": {
        "email": "user@example.com",
        "role": "attendee"
      }
    }
  ],
  "totalRegistrations": 1
}
```

---

### Registrations

#### Register for Event (Attendee Only)
```http
POST /events/register
Authorization: Bearer {token}
Content-Type: application/json

{
  "eventId": "uuid"
}
```

**Response:**
```json
{
  "message": "Registered successfully",
  "registration": {
    "PK": "REG#eventId",
    "SK": "USER#user@example.com",
    "userId": "user@example.com",
    "eventId": "uuid",
    "registeredAt": "2024-11-02T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `409 Conflict`: Already registered
- `400 Bad Request`: Event is at full capacity

#### List My Registrations (Attendee Only)
```http
GET /registrations
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "PK": "REG#eventId",
    "SK": "USER#user@example.com",
    "userId": "user@example.com",
    "eventId": "eventId",
    "registeredAt": "2024-11-02T10:00:00.000Z",
    "event": {
      "PK": "EVENT#eventId",
      "name": "Tech Conference 2024",
      "description": "Annual tech conference",
      "date": "2024-12-15",
      "location": "San Francisco, CA",
      "capacity": 100
    }
  }
]
```

#### Cancel Registration (Attendee Only)
```http
DELETE /events/cancel
Authorization: Bearer {token}
Content-Type: application/json

{
  "eventId": "uuid"
}
```

**Response:**
```json
{
  "message": "Registration cancelled successfully"
}
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20.x or later
- pnpm 
- AWS Account
- AWS CLI configured

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Ayirileslie/event-platform.git
cd event-platform
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Build the backend**
```bash
cd packages/backend
pnpm build
```

4. **Deploy infrastructure**
```bash
cd packages/infrastructure
pnpm cdk bootstrap  # First time only
pnpm cdk deploy
```

5. **Configure frontend**

After deployment, update `packages/frontend/vite-project/.env`:
```env
VITE_API_URL=https://rfim8ivv3h.execute-api.us-east-1.amazonaws.com
```

6. **Build and run frontend**
```bash
cd packages/frontend/vite-project
pnpm build
pnpm dev  # For local development
```

---

## 📁 Project Structure

```
event-platform/
├── packages/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   │   ├── login.ts
│   │   │   │   └── signup.ts
│   │   │   ├── events/
│   │   │   │   ├── createEvent.ts
│   │   │   │   ├── listEvents.ts
│   │   │   │   ├── listMyEvents.ts
│   │   │   │   ├── getEvent.ts
│   │   │   │   ├── getEventRegistrations.ts
│   │   │   │   ├── register.ts
│   │   │   │   ├── cancelRegistration.ts
│   │   │   │   └── listMyRegistrations.ts
│   │   │   ├── lib/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── db.ts
│   │   │   │   └── jwt.ts
│   │   │   └── utils/
│   │   │       └── user.ts
│   │   └── package.json
│   ├── frontend/
│   │   └── vite-project/
│   │       ├── src/
│   │       │   ├── api/
│   │       │   │   ├── auth.ts
│   │       │   │   ├── client.ts
│   │       │   │   ├── events.ts
│   │       │   │   └── registrations.ts
│   │       │   ├── contexts/
│   │       │   │   └── AuthContext.tsx
│   │       │   ├── pages/
│   │       │   │   ├── Login.tsx
│   │       │   │   ├── Signup.tsx
│   │       │   │   ├── Dashboard.tsx
│   │       │   │   ├── EventsList.tsx
│   │       │   │   ├── EventDetails.tsx
│   │       │   │   ├── MyEvents.tsx
│   │       │   │   ├── EventRegistrations.tsx
│   │       │   │   ├── CreateEvent.tsx
│   │       │   │   └── MyRegistrations.tsx
│   │       │   ├── App.tsx
│   │       │   └── main.tsx
│   │       └── package.json
│   └── infrastructure/
│       ├── lib/
│       │   └── infrastructure-stack.ts
│       ├── bin/
│       │   └── infrastructure.ts
│       └── package.json
└── package.json
```

---

## 🔐 Environment Variables

### Backend (Lambda)
- `TABLE_NAME`: DynamoDB table name (auto-configured by CDK)
- `JWT_SECRET`: Secret key for JWT signing

### Frontend
- `VITE_API_URL`: https://rfim8ivv3h.execute-api.us-east-1.amazonaws.com

---

## 🧪 Testing

### Manual Testing

1. **Sign up as an organizer**
2. **Create an event**
3. **Sign up as an attendee**
4. **Browse and register for events**
5. **View registrations as organizer**
6. **Cancel registration as attendee**

---

## 📝 DynamoDB Schema

### Single Table Design

**Primary Key:**
- `PK` (Partition Key)
- `SK` (Sort Key)

**Access Patterns:**

| Entity | PK | SK | Attributes |
|--------|----|----|------------|
| User | `USER#{email}` | `METADATA` | email, passwordHash, role, createdAt |
| Event | `EVENT#{eventId}` | `DETAILS` | name, description, date, location, capacity, organizerId |
| Registration | `REG#{eventId}` | `USER#{userId}` | userId, eventId, registeredAt |

---

## 🚢 Deployment

### Backend Deployment
```bash
cd packages/infrastructure
pnpm cdk deploy
```

### Frontend Deployment

**Option 1: AWS Amplify**
1. Connect your GitHub repo
2. Set build settings:
   - Build command: `cd packages/frontend/vite-project && pnpm install && pnpm build`
   - Output directory: `packages/frontend/vite-project/dist`
3. Add environment variable: `VITE_API_URL`

**Option 2: AWS S3 + CloudFront**
```bash
cd packages/frontend/vite-project
pnpm build
aws s3 sync dist/ s3://your-bucket-name
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Authors

- **Your Name** - [Your GitHub](https://github.com/ayirileslie)

---

## 🙏 Acknowledgments

- AWS CDK Documentation
- React Documentation
- Tailwind CSS

---

## 📞 Support

For issues or questions, please open an issue on GitHub or contact kperegbeyiayiri@gmail.com