# Image Generation Project

This project consists of a backend API and a frontend editor. Below are the instructions to run both services in development mode.

## Prerequisites

Ensure you have the following installed on your machine:

- Node.js (version 18)
- npm (Node Package Manager)

## Getting Started

### Install Dependencies

Install the dependencies for the entire project:

```sh
npm install
```

## Running the Backend Service

The backend service is located in the [`packages/api`](./packages/api/) directory.

### Development Mode

To run the backend service in development mode with hot-reloading:

```sh
npm run dev:api
```

This will start the backend server on port 3000.

## Running the Frontend Service

The frontend service is located in the [`packages/editor`](./packages/editor/) directory.

### Development Mode

To run the frontend service in development mode with hot-reloading:

```sh
npm run dev:editor
```

This will start the frontend development server, and you can access it at `http://localhost:3000`.

## Running Both Services Concurrently

To run both the backend and frontend services concurrently:

```sh
npm run dev
```

This will start both the backend and frontend servers.

## Additional Commands

### Building the Project

To build both the backend and frontend services:

```sh
npm run build
```

### Linting the Code

To lint the code for both the backend and frontend services:

```sh
npm run lint
```

### Formatting the Code

To format the code for both the backend and frontend services:

```sh
npm run format
```

## License

This project is licensed under the ISC License.\*\*\*\*
