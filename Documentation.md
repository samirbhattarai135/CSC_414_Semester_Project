# Course Planning API Documentation

## Introduction

This document provides details on the features and API endpoints for the Course Planning Backend system. The API allows users to manage their academic profile, track course progress, and receive personalized course recommendations.

## Core Features

1.  **User Profile Management:**

    - Stores student details (name, email, student ID), login credentials (hashed password), completed courses, and academic interests.
    - Provides endpoints for registration, login, fetching profile data, and updating interests.

2.  **Course History Management:**

    - Allows authenticated users to add, view, and remove courses from their completed list.
    - Uses the `studentId` for authorization to ensure users only modify their own data.

3.  **Course Recommendation (Required Courses):**

    - Analyzes the student's completed courses against the defined curriculum requirements (fetched from the database).
    - Validates prerequisites for remaining required courses.
    - Suggests a list of required courses the student is eligible to take next.

4.  **Elective Suggestion (Based on Interests):**

    - Identifies potential elective courses (those not required by the curriculum).
    - Filters out electives already completed by the student.
    - Validates prerequisites for remaining electives.
    - Matches the student's stored `interests` against `tags` associated with elective courses.
    - Suggests a list of eligible electives relevant to the student's interests.

5.  **Progress Tracking:**
    - Calculates the number of required courses completed by the student compared to the total number of required courses in the curriculum.
    - Provides data suitable for displaying a progress bar or completion percentage on a dashboard.

## API Endpoints

Base URL: `http://localhost:5001/api` (or your configured host/port)

---

### Authentication (`/auth`)

These endpoints handle user registration and login.

#### 1. Register User

- **Endpoint:** `POST /auth/register`
- **Access:** Public
- **Description:** Creates a new user account.
- **Request Body:**
  ```json
  {
    "name": "Test User",
    "email": "unique.email@example.com",
    "password": "yourpassword",
    "studentId": "UNIQUE_S12345",
    "interests": ["web development", "ai"] // Optional array of strings
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "token": "jwt.token.string",
    "user": {
      "id": "mongodb_object_id",
      "studentId": "UNIQUE_S12345",
      "name": "Test User",
      "email": "unique.email@example.com",
      "interests": ["web development", "ai"]
    }
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: Missing fields, invalid email format, email/studentId already exists, validation errors.
  - `500 Internal Server Error`: Server-side issue during registration.

#### 2. Login User

- **Endpoint:** `POST /auth/login`
- **Access:** Public
- **Description:** Authenticates an existing user and returns a JWT token.
- **Request Body:**
  ```json
  {
    "email": "registered.email@example.com",
    "password": "yourpassword"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "token": "jwt.token.string",
    "user": {
      "id": "mongodb_object_id",
      "studentId": "REGISTERED_S12345",
      "name": "Registered User",
      "email": "registered.email@example.com",
      "interests": ["database", "systems"]
    }
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: Missing email or password.
  - `401 Unauthorized`: Invalid credentials.
  - `500 Internal Server Error`: Server-side issue during login.

---

### User Profile (`/users`)

These endpoints manage the authenticated user's profile data. Requires `Authorization: Bearer <token>` header.

#### 1. Get User Profile

- **Endpoint:** `GET /users/profile`
- **Access:** Private
- **Description:** Retrieves the profile information of the currently logged-in user.
- **Request Body:** None
- **Success Response (200 OK):**
  ```json
  {
    "id": "mongodb_object_id",
    "studentId": "LOGGEDIN_S12345",
    "name": "Logged In User",
    "email": "loggedin.email@example.com",
    "completedCourses": ["CS101", "MA101"],
    "interests": ["ai", "data"],
    "createdAt": "iso_date_string"
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: Invalid/missing token.
  - `404 Not Found`: User associated with token not found (rare).

#### 2. Update User Interests

- **Endpoint:** `PUT /users/profile/interests`
- **Access:** Private
- **Description:** Updates the interests list for the currently logged-in user. Replaces the existing list.
- **Request Body:**
  ```json
  {
    "interests": ["machine learning", "web development", "ethics"] // Array of strings
  }
  ```
- **Success Response (200 OK):** Returns the updated user profile object (same format as `GET /users/profile`).
- **Error Responses:**
  - `400 Bad Request`: `interests` field missing or not an array.
  - `401 Unauthorized`: Invalid/missing token.
  - `404 Not Found`: User associated with token not found (rare).
  - `500 Internal Server Error`: Server-side issue during update.

---

### Student Data (`/students`)

These endpoints manage student-specific academic data. Requires `Authorization: Bearer <token>` header. The `:studentId` in the URL must match the `studentId` of the authenticated user (enforced by `checkAuthorization` helper).

#### 1. Get Completed Courses

- **Endpoint:** `GET /students/:studentId/courses`
- **Access:** Private
- **Description:** Retrieves the list of completed course IDs for the specified student.
- **Request Body:** None
- **Success Response (200 OK):**
  ```json
  ["CS101", "MA101", "EN101"]
  ```
- **Error Responses:**
  - `401 Unauthorized`: Invalid/missing token.
  - `403 Forbidden`: Authenticated user's `studentId` does not match `:studentId` parameter.
  - `500 Internal Server Error`: Server-side issue.

#### 2. Add Completed Course

- **Endpoint:** `POST /students/:studentId/courses`
- **Access:** Private
- **Description:** Adds a course ID to the student's completed list.
- **Request Body:**
  ```json
  {
    "courseId": "CS201"
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "courseId": "CS201",
    "completedCourses": ["CS101", "MA101", "EN101", "CS201"] // Updated list
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: Missing `courseId`, course already exists in list.
  - `401 Unauthorized`: Invalid/missing token.
  - `403 Forbidden`: Authenticated user's `studentId` does not match `:studentId` parameter.
  - `500 Internal Server Error`: Server-side issue.

#### 3. Update Completed Course (Not Implemented)

- **Endpoint:** `PUT /students/:studentId/courses/:courseId`
- **Access:** Private
- **Description:** _Currently returns 501 Not Implemented._ Intended for updating details (like grade, semester) if the schema were changed to store more than just course IDs.
- **Current Response (501 Not Implemented):**
  ```json
  {
    "message": "Updating course details not implemented for current schema (stores only IDs)."
  }
  ```

#### 4. Delete Completed Course

- **Endpoint:** `DELETE /students/:studentId/courses/:courseId`
- **Access:** Private
- **Description:** Removes a course ID from the student's completed list.
- **Request Body:** None
- **Success Response (200 OK):**
  ```json
  {
    "message": "Course CS201 removed successfully",
    "completedCourses": ["CS101", "MA101", "EN101"] // Updated list
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: Invalid/missing token.
  - `403 Forbidden`: Authenticated user's `studentId` does not match `:studentId` parameter.
  - `404 Not Found`: Course ID not found in the student's completed list.
  - `500 Internal Server Error`: Server-side issue.

#### 5. Get Course Suggestions (Required)

- **Endpoint:** `GET /students/:studentId/suggestions`
- **Access:** Private
- **Description:** Gets recommendations for _required_ courses the student is eligible to take next, based on completed courses and prerequisites.
- **Request Body:** None
- **Success Response (200 OK):**
  ```json
  {
    "suggestions": ["CS201", "CS250", "MA201", "ST210"] // Example list of eligible required course IDs
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: Invalid/missing token.
  - `403 Forbidden`: Authenticated user's `studentId` does not match `:studentId` parameter.
  - `404 Not Found`: Course or Curriculum data missing in the database.
  - `500 Internal Server Error`: Server-side issue during recommendation generation.

#### 6. Get Elective Recommendations (Interest-Based)

- **Endpoint:** `GET /students/:studentId/recommendations`
- **Access:** Private
- **Description:** Gets recommendations for _elective_ courses based on the student's interests and prerequisite eligibility.
- **Request Body:** None
- **Success Response (200 OK):**
  ```json
  {
    "recommendations": ["CS410", "CS420"] // Example list of eligible elective course IDs matching interests
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: Invalid/missing token.
  - `403 Forbidden`: Authenticated user's `studentId` does not match `:studentId` parameter.
  - `404 Not Found`: Course or Curriculum data missing in the database.
  - `500 Internal Server Error`: Server-side issue during recommendation generation.

#### 7. Get Progress Data

- **Endpoint:** `GET /students/:studentId/progress`
- **Access:** Private
- **Description:** Gets data about the student's progress towards completing required courses.
- **Request Body:** None
- **Success Response (200 OK):**
  ```json
  {
    "completedRequiredCount": 5, // Number of required courses completed
    "totalRequiredCount": 10, // Total number of required courses in curriculum
    "totalCompletedCount": 7 // Total courses completed (including electives)
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: Invalid/missing token.
  - `403 Forbidden`: Authenticated user's `studentId` does not match `:studentId` parameter.
  - `404 Not Found`: Curriculum data missing in the database.
  - `500 Internal Server Error`: Server-side issue.

#### 8. Get Graduation Estimate (Placeholder)

- **Endpoint:** `GET /students/:studentId/graduation-estimate`
- **Access:** Private
- **Description:** _Currently returns placeholder data._ Intended to estimate the graduation date based on remaining requirements.
- **Current Response (200 OK):**
  ```json
  {
    "estimatedDate": "Spring 2028 (DB Placeholder)"
  }
  ```
- **Error Responses:** (Will depend on future implementation)
  - `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`.

---
