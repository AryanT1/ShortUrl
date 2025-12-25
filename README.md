# ShortUrl Pro – URL Shortener Backend

ShortUrl Pro is a **backend-focused** URL shortener service that lets authenticated users create short links with custom aliases, automatic expiry, QR codes, and detailed click analytics. It is designed as a production-style Node.js/TypeScript API with strong validation, documentation, and database modeling. 
---

## Features

- **Secure authentication**
  - User signup/login with JWT-based auth and protected routes via `GeneralAuth` middleware. 
  - `/api/v1/Register/me` endpoint to fetch the authenticated user and their URLs. 

- **URL shortening**
  - Create short URLs from long links with optional custom alias and configurable expiration. 
  - Cryptographically secure short-code generator using Node's `crypto` plus collision handling with database uniqueness checks. 
  - Default expiration strategy when `expiresAt` is not provided (e.g., auto-expiry after a fixed period). 

- **Redirect & lifecycle management**
  - `redirect` endpoint that resolves `/:shortCode`, validates active status, checks expiry, and redirects with `302`. 
  - Flags like `isActive` and `expiresAt` to disable or automatically expire links. 
  - Proper error responses for invalid/expired/deactivated links. 
- **Analytics & tracking**
  - `Click` model in Prisma to store per-click analytics (timestamp, device, browser, OS, IP, etc.). 
  - Click records created on each successful redirect, enabling per-URL analytics dashboards. 

- **Validation & type safety**
  - Request body validation using **Zod** schemas for URL creation, updates, and auth flows. 
  - Strong TypeScript types with `exactOptionalPropertyTypes`, resolving `string | undefined` vs `string | null` issues in Prisma inputs. 

- **API documentation**
  - Full **Swagger/OpenAPI** documentation, powered by `swagger-jsdoc` and `swagger-ui-express`, exposed at `/docs`. 
  - Endpoints grouped into tags (User, URLs), with detailed request/response schemas and error examples.

---

## Tech Stack

- **Language**: TypeScript / JavaScript (Node.js) 
- **Framework**: Express.js  
- **Database & ORM**: MongoDB with Prisma ORM   
- **Auth & Security**:
  - JWT-based authentication
  - Cookie parsing (`cookie-parser`) for auth/session cookies
  - Basic input validation & schema-level constraints via Prisma + Zod 
- **Docs & Tooling**:
  - Swagger (swagger-jsdoc, swagger-ui-express) for API docs 
  - Zod for runtime validation
  - UA parsing & analytics helpers for Click tracking 
- **Deployment**:
  - Backend deployed on Render (Web Service) with environment-based configuration. 

---

## API Overview

Base URL (example):

