# ShortUrl: A Feature-Rich URL Shortener API

This project is a robust, full-featured URL shortening service implemented as a backend API. It provides user authentication, custom short code generation, QR code generation, and comprehensive click analytics, all built on a modern Node.js and TypeScript stack.

## ✨ Features

The ShortUrl API offers a complete solution for managing and tracking shortened links:

*   **User Authentication:** Secure user registration and login using JWT (JSON Web Tokens) with tokens stored in HTTP-only cookies.
*   **Custom Short Codes:** Users can specify a **custom alias** for their shortened URL instead of a randomly generated one.
*   **Expiration:** Shortened links can be set to **expire** at a specific date and time.
*   **QR Code Generation:** Automatically generates a **QR code** for every shortened URL.
*   **Comprehensive Analytics:** Tracks detailed click data, including:
    *   Total clicks
    *   Device type (Mobile, Desktop, Tablet)
    *   Browser and Operating System (OS) statistics
    *   Geographic location (Country)
    *   Referrer tracking
    *   Clicks over time
*   **URL Management:** Full CRUD (Create, Read, Update, Delete) functionality for managing shortened links, including activation/deactivation.


## 💻 Tech Stack

The project is built with the following technologies:

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Backend** | Node.js, Express.js | The runtime environment and web application framework. |
| **Language** | TypeScript | Provides static typing for improved code quality and maintainability. |
| **Database** | MongoDB | NoSQL database used for storing user, URL, and click data. |
| **ORM** | Prisma | Next-generation ORM for seamless interaction with the MongoDB database. |
| **Authentication** | JWT, `bcrypt` | Secure user authentication and password hashing. |
| **Validation** | `zod` | Schema declaration and validation library for robust input handling. |
| **Utilities** | `qrcode`, `ua-parser-js` | Used for QR code generation and parsing user agent strings for analytics. |


## ⚙️ Data Model

The application uses a MongoDB database managed by Prisma. The core models are:

### `User`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `ObjectId` | Unique identifier for the user. |
| `email` | `String` | User's unique email address. |
| `password` | `String` | Hashed password. |
| `name` | `String` | User's name. |
| `urls` | `Url[]` | Relation to the URLs created by the user. |

### `Url`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `ObjectId` | Unique identifier for the URL entry. |
| `userId` | `ObjectId` | ID of the user who created the URL. |
| `shortCode` | `String` | The unique, short identifier used in the URL (e.g., `abc123`). |
| `customAlias` | `String?` | Optional custom short code provided by the user. |
| `originalUrl` | `String` | The long URL to be redirected to. |
| `clicks` | `Click[]` | Relation to the click analytics data. |
| `qrCode` | `String?` | Base64 string of the generated QR code image. |
| `isActive` | `Boolean` | Status of the link (can be deactivated by the user). |
| `expiresAt` | `DateTime?` | Optional expiration date for the link. |

### `Click`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `ObjectId` | Unique identifier for the click event. |
| `urlId` | `ObjectId?` | ID of the shortened URL that was clicked. |
| `ipAddress` | `String?` | IP address of the client. |
| `userAgent` | `String?` | Raw user agent string. |
| `device`, `browser`, `os` | `String?` | Parsed details from the user agent. |
| `country` | `String?` | Geographic location of the click. |
| `referrer` | `String?` | The referring URL. |
| `timestamp` | `DateTime` | Time of the click. |

## 🚀 Getting Started

### Prerequisites

Before running the project, ensure you have the following installed:

*   **Node.js** (version 18 or higher)
*   **MongoDB** instance (local or cloud-hosted)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/AryanT1/ShortUrl.git
    cd ShortUrl
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a file named `.env` in the root directory and populate it with your configuration.

    ```env
    # Database Configuration
    DATABASE_URL="mongodb+srv://<user>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority"

    # Application Configuration
    PORT=3000
    BASE_URL="http://localhost:3000" # The base URL for your short links (e.g., https://yourdomain.com )
    JWT_SECRET="YOUR_VERY_STRONG_SECRET_KEY"
    ```

4.  **Run the application:**

    *   **Development Mode (with hot-reloading):**
        ```bash
        npm run dev
        ```
    *   **Production Build & Start:**
        ```bash
        npm run build
        npm start
        ```

The server will start on the port specified in your `.env` file (default: `http://localhost:3000` ).

## 🌐 API Endpoints

The API endpoints are prefixed with `/api/v1/`. Full interactive documentation is available via **Swagger UI** at `http://localhost:3000/docs`.

### User Authentication (`/api/v1/Register` )

| Method | Endpoint | Description | Authentication |
| :--- | :--- | :--- | :--- |
| `POST` | `/signup` | Register a new user. | None |
| `POST` | `/login` | Log in a user and set the JWT cookie. | None |
| `GET` | `/me` | Get the profile of the currently authenticated user. | Required |

### URL Management (`/api/v1/url`)

| Method | Endpoint | Description | Authentication |
| :--- | :--- | :--- | :--- |
| `POST` | `/ShortUrlCreation` | Create a new short URL (supports custom alias, expiry). | Required |
| `GET` | `/UserUrls` | Retrieve all shortened URLs for the authenticated user. | Required |
| `GET` | `/UrlDetails/:id` | Get details for a specific URL by its database ID. | Required |
| `PUT` | `/update/:id` | Update a URL (e.g., change `isActive` status or `expiresAt`). | Required |
| `DELETE` | `/deleteUrl/:id` | Delete a shortened URL. | Required |

### Redirection

| Method | Endpoint | Description | Authentication |
| :--- | :--- | :--- | :--- |
| `GET` | `/:shortCode` | Redirects the user to the original URL and tracks the click. | None |

### Analytics (`/api/v1/analytics`)

| Method | Endpoint | Description | Authentication |
| :--- | :--- | :--- | :--- |
| `GET` | `/dashboard` | Get overall statistics for the user (total URLs, total clicks, top 5 URLs). | Required |
| `GET` | `/:shortCode?period=7d` | Get detailed analytics for a specific short code, optionally filtered by period (e.g., `7d`, `30d`, `90d`). | Required |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an Issue.

