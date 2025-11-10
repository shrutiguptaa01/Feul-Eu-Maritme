# FuelEU Maritime — Compliance Platform
This is a minimal Fuel EU Maritime compliance platform with a clean architecture.
It includes core logic for routes, compliance balance (CB), banking, and pooling,
with a React + Tailwind frontend dashboard consuming backend APIs.

# Project Overview

* Frontend: React, TypeScript, TailwindCSS (Vite)
* Backend: Node.js, TypeScript, Express, PostgreSQL
* Architecture: Hexagonal (Ports & Adapters / Clean Architecture)
* Testing: Unit tests for core logic, light HTTP integration tests

Project Structure

Backend:

backend/src
├─ core/domain/          # Domain types and entities
├─ core/application/     # Business logic / use-cases
├─ core/ports/           # Repository and service interfaces
├─ adapters/
│  ├─ inbound/http/      # Express API routes
│  └─ outbound/postgres/ # Database repository implementations
├─ infrastructure/db/    # Migrations and seed scripts
├─ server/               # Composition root
└─ shared/               # Constants and utilities

Frontend:

frontend/src
├─ core/                 # Domain types
├─ adapters/             # API clients
├─ ui/                   # Components and pages
└─ infrastructure/       # Service adapters

# Backend Setup

Copy .env.example to .env and set DATABASE_URL and PORT.

Install dependencies:

cd backend: npm install


Run database migrations: npm run migrate


Seed sample data: npm run seed


Start development server: npm start
Backend runs at http://localhost:3000

Available Scripts:

npm run test — Run unit and integration tests

npm run build / npm start — Build and run production server

# Frontend Setup

Install dependencies:

cd frontend: npm install


Start development server: npm run dev
Frontend runs at http://localhost:5173
API calls are automatically proxied to the backend.


# API Summary
Method	Endpoint	Description
GET	/routes	List all routes
POST	/routes/:id/baseline	Set a baseline route
GET	/routes/comparison	Compare baseline vs other routes
GET	/compliance/cb?shipId&year	Compute/store compliance balance (CB)
GET	/compliance/adjusted-cb?shipId&year	CB including applied banked entries
GET	/banking/records?shipId&year	Banking ledger entries
POST	/banking/bank	Bank positive CB for a year
POST	/banking/apply	Apply banked surplus against a deficit
POST	/pools	Create a pool and adjust CB allocations


# Key Features

Routes Management:

List all routes with filtering by vessel type, fuel type, and year.

Set baseline routes for comparisons.

Compliance Balance (CB):

Compute CB for each ship/year.

Display current CB and adjusted CB (after applying banked surplus).

Banking:

Bank positive CB for future use.

Apply banked CB to reduce deficits.

Pooling:

Aggregate multiple ships into a pool.

Adjust CB allocations across pool members.

Testing:

Unit tests for core domain and use-cases: ComputeCB, BankSurplus, ApplyBanked, CreatePool.

HTTP integration tests use in-memory adapters (no DB needed).