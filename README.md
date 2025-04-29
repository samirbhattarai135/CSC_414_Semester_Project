# CSC 414 Semester Project - Advisement Assistant Backend

This project provides a backend API for a course planning and recommendation system designed for students. It allows users to manage their profile, track completed courses, and receive suggestions for future courses based on curriculum requirements and personal interests.

## Features

- **User Authentication:** Secure registration and login using JWT.
- **User Profile Management:** Store and update user details, including academic interests.
- **Course History:** Add, view, and remove completed courses.
- **Course Recommendations:** Suggest required courses based on prerequisites and curriculum rules.
- **Elective Suggestions:** Recommend elective courses based on user interests and prerequisites.
- **Progress Tracking:** Calculate and provide course completion statistics.

For detailed information on features and API endpoints, please see the [DOCUMENTATION.md](DOCUMENTATION.md) file.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [npm](https://www.npmjs.com/) (usually included with Node.js)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or a local MongoDB instance)

## Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/samirbhattarai135/CSC_414_Semester_Project
    cd CSC_414_Semester_Project
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Environment Variables

Create a `.env` file in the project root directory (`CSC_414_Semester_Project/`) and add the following variables:

```properties
# .env file
PORT=5001
NODE_ENV=development

# Your MongoDB connection string (replace placeholders)
# Ensure special characters in the password are URL-encoded (e.g., @ becomes %40)
MONGO_URI=mongodb+srv://<username>:<password>@<your-cluster-address>/<database_name>?retryWrites=true&w=majority

# A strong, random secret for signing JWT tokens
JWT_SECRET=your_super_secret_jwt_key_replace_this
```

- Replace `<username>`, `<password>`, `<your-cluster-address>`, and optionally `<database_name>` with your MongoDB Atlas credentials.
- Replace `your_super_secret_jwt_key_replace_this` with a secure, randomly generated string.

## Database Seeding

To populate the database with initial course and curriculum data:

```bash
npm run seed
```

This command will connect to your database, clear existing course/curriculum data (if any), and insert the sample data from the `/data` directory.

To remove the seeded data:

```bash
npm run seed:destroy
```

## Running the Server

To start the development server:

```bash
npm start
```

The API will be running on `http://localhost:5001` (or the port specified in your `.env` file). You should see log messages indicating the server start and database connection status.

## API Usage

Use an API client like [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) to interact with the endpoints.

Refer to [DOCUMENTATION.md](DOCUMENTATION.md) for a complete list of API endpoints, request/response formats, and usage examples. Remember to include the JWT token (obtained from login/register) in the `Authorization: Bearer <token>` header for protected routes.
