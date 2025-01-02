# Vendatu - EdTech Platform Setup Guide  

**Vendatu** is a modern EdTech platform built using the **MERN stack**. The project is structured with a clear separation between the frontend and backend, making it easy to understand and maintain.  

---

## 📁 Project Overview  

The project is organized into the following structure:  

vendatu/
├── frontend/ # React + Vite application
├── server/ # Node.js + Express backend
└── README.md # Project documentation

yaml
Copy code

---

## 🚀 How to Run the Project  

### 1️⃣ Backend Setup  

1. Navigate to the `server` directory:  

   cd server
Install dependencies:

npm install
Configure your server .env file with the following variables:

makefile
PORT=8000  
MONGODB_URI=your_mongodb_connection_string  
JWT_SECRET=your_secret_key  
Start the server:



npm start
2️⃣ Frontend Setup
Navigate to the frontend directory:


cd frontend
Install dependencies:


npm install
Configure your frontend .env file with the following variables:


VITE_API_URL=http://localhost:8000  
# Add other necessary environment variables as needed  
Start the development server:


npm run dev
🏗️ Project Structure Details
Frontend (/frontend)
Built with: React + Vite
Styling: Tailwind CSS
Key directories:
/src/components: Contains reusable React components
/src/lib: Includes utility functions and helpers
/public: Stores static assets like images and icons
Backend (/server)
Built with: Node.js + Express
Key directories:
/controllers: Handles incoming requests and executes business logic
/models: Defines database schemas and models
/routes: Contains API endpoint definitions
/middlewares: Holds custom middleware for authentication, logging, etc.
/graphql: Manages GraphQL schemas and resolvers
/uploads: Handles file storage requirements
🌐 Access Points
Frontend: http://localhost:5173 (default Vite port)
Backend: http://localhost:8000
📋 Dependencies
Ensure you have the following installed and set up on your system:

Node.js (v14 or higher)
npm or yarn (Node.js package managers)
MongoDB (Installed and running locally or remotely)
A modern web browser (e.g., Google Chrome, Firefox)
⚠️ Important Notes
Ensure MongoDB is running before starting the backend server.
The backend server must be running for the frontend to function properly.
Check the console output for both frontend and backend during execution for any error messages.
Verify that all required environment variables are correctly configured.
Feel free to reach out or contribute to this project. Your support makes the platform better! 🚀



### Key Features of This README:
1. **Markdown Syntax**: Proper indentation and backticks ensure code blocks render correctly.  
2. **Readable Structure**: Headings and subheadings are well-defined for readability.  
3. **Copy-Paste Friendly**: Code and commands can be copied easily from the blocks.  
4. **GitHub Preview Ready**: The file will render properly with sections and formatting intact when viewed on GitHub.  

Let me know if there’s anything else to adjust! 😊





