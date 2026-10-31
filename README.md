# Bookfix — Cinema Ticket Booking System

A full-stack cinema ticket booking system built with **Spring Boot** (backend) and **React + Vite** (frontend).

## Project Structure

```
Bookfix/
├── backend/          # Spring Boot REST API (Java 21, MySQL)
│   ├── src/
│   ├── pom.xml
│   └── mvnw
└── frontend/         # React 18 + Vite UI
    ├── src/
    └── package.json
```

## Running the Project

### 1. Backend (Spring Boot)

Make sure MySQL is running and `bms_db` database is accessible.

```bash
cd backend
./mvnw spring-boot:run        # Linux/Mac
 ./mvnw.cmd spring-boot:run   # Windows (PowerShell)
```

Backend runs at: **http://localhost:8080**

### 2. Frontend (React)  

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

> The Vite dev server proxies `/api` requests to `http://localhost:8080` automatically.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/movies` | List all movies |
| GET | `/api/movies/{id}` | Get movie by ID |
| POST | `/api/movies` | Create a movie |
| POST | `/api/bookings` | Create a booking |
| GET | `/api/bookings/{id}` | Get booking by ID |
