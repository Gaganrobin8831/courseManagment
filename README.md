# courseManagment
To build a Course Management System that supports roles for administrators and students, allowing course creation, assignment, and progress tracking for lessons and quizzes. Below are the detailed requirements broken into key features and functionalities.

# Base URL
The base URL for the API is:   http://localhost:5764/


## Features
Create: Create admin and studend  using routes
1. Course CRUD:
Admin can create, read, update, and delete courses.
Each course can have multiple lessons.
Lesson Management:
Lessons are nested within courses.
Lessons contain metadata such as:
Video files.
Photos.
PDFs.
Quizzes.

2. Quiz Management
CRUD Operations for Quizzes:
Admin can create, read, update, and delete quizzes.
Each quiz can have multiple questions (MCQ, True/False, etc.).
Include fields for quiz metadata, such as:
Quiz duration.
Pass/fail thresholds.
Correct answers for automated scoring.

4. Assigning Courses to Students
Admin can assign one or more courses to a student.
Track each student’s assigned courses.

5. Lesson and Course Access for Students
Students can view lessons of their assigned courses.
Each lesson includes its respective metadata (videos, photos, PDFs, and quizzes).



## Prerequisites
Before you begin, ensure you have the following installed:
```
1. Node.js (v20.15.0 or higher)
2. Npm (Node Package Manager)
3. A MongoDB database (either a local instance or a MongoDB Atlas cloud database)
4. cloudinary (for upload on cloud)
5. jsonwebtoken ( For the token)
6. argon2 (For hashing password)
7. express (For the server)
8. mongoose (For the connect the MongoDb database)
9. cors (For WhiteListing the frontend)
10. validator (For check email is valid or in valid format)
11. dotenv (For Environment variables)
12. compression (For Increase read data speed)
13. streamifier (for upload pdf on cloud)
14. multer-storage-cloudinary and multer (for upload files)

```
## Installation
Follow these steps to set up and run the project locally:

## Clone the repository:
```
git clone https://github.com/Gaganrobin8831/courseManagment
```
## Install dependencies:
```
npm install
```
## Set up the environment variables:
```
PORT = 4000

SECRET = **Any Secret Key**

MONGO_URI=**either a local instance of MongoDBCompass or a MongoDB Atlas cloud database

DB_Name =  **( if using MongoDBCompass else addDbb Name in MONGO_URI with cluster connection String)**

ClOUDINARY_API_KEY =  **Api key of cloudinary after createing account in Cloudinary**

ClOUDINARY_API_SECRET = **Secret key of cloudinary after createing account in Cloudinary**

CLOUDINARY_CLOUD_NAME =  **Cloudinary Cloud name after createing account in Cloudinary**

SECRET = **Any Number and stringCombination**

```
------------------------------------------------------------------------------------------------------
## Start the application:
```
npm start
```

## Swagger Testing
This project includes a swagger.yaml file that defines the API endpoints, request parameters, and responses in a standardized OpenAPI format. You can use this file to test and document the API.

Using the **swagger.yaml** File
## Use an Online Swagger Editor:

Visit the Swagger Editor.
Copy the contents of the **swagger.yaml** file from your project.
Paste the contents into the editor.
The Swagger Editor will display the API documentation, allowing you to interact with and test the API endpoints directly from the browser.


---
### Postman Collection for API Testing
To make API testing easier, a Postman collection is provided for this project. This collection includes all the necessary endpoints and can be used to quickly test the API without manually configuring each request.

### Importing the Postman Collection
Follow these steps to import the Postman collection:

**1. Download the Postman Collection:**

The Postman collection file (CourseManagment.postman_collection.json) is included in the repository.

**2. Import the Collection into Postman:**

Open Postman.
Click on the "Import" button in the top left corner.
Select the CourseManagment.postman_collection.json file from your local machine.
Click "Open" to import the collection.

**3. Start Testing:**

Once the collection is imported, you can start making requests to the API endpoints defined in the collection. Each request includes predefined settings for method, URL, headers, and body, making it easier to test the API.