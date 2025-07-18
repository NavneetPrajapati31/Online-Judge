# Online Judge

A full-stack Online Judge system for coding practice and competitive programming. It allows users to register, solve coding problems, and get instant feedback via a secure code execution backend.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## Project Structure

```
Online Judge/
  backend/      # Node.js/Express API, MongoDB models, authentication, problem management
  compiler/     # Code execution engine (e.g., C++), file generation, sandboxing
  frontend/     # React app (Vite), UI components, pages, TailwindCSS
```

- **backend/**: REST API for authentication, problem CRUD, and user management.
- **compiler/**: Handles code compilation and execution in a secure environment.
- **frontend/**: Modern React app for user interface, problem solving, and submissions.

---

## Features

- User authentication (sign up, sign in)
- Problem listing and details
- Code editor and submission
- Real-time code compilation and feedback
- Secure code execution (sandboxed)
- Responsive, modern UI (TailwindCSS)

---

## Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Compiler**: Node.js, child_process (for C++ execution)
- **Frontend**: React, Vite, TailwindCSS
- **Other**: JWT for authentication, ESLint for code quality

---

## Setup Instructions

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB (local or cloud)

### 1. Backend

```bash
cd backend
npm install
# Set up .env with MongoDB URI and JWT secret
npm start
```

### 2. Compiler

```bash
cd compiler
npm install
# No extra setup required for local execution
npm start
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Usage

- Visit the frontend URL (default: http://localhost:5173)
- Register or sign in
- Browse problems, write code, and submit solutions
- View results and feedback instantly

---

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Open a pull request

---

## License

[MIT](LICENSE)
