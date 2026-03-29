# Zero2Earn Campus

Zero2Earn is a campus-based freelancing platform where students can offer and buy services inside the college, similar to Fiverr/Upwork. It includes AI-powered features for smarter matching, price suggestion, and profile improvement.

## Features Built
- **Modern UI**: Fiverr-like clean aesthetics using vanilla CSS and React.
- **Roles**: Built-in support for Buyer, Seller, and Admin roles (toggleable in the Dashboard demo).
- **Service Marketplace**: Discover services by category with AI search simulation.
- **Dashboard**: role-specific views displaying earnings, wallet balance, and recent activities.
- **AI Integrations**: Placeholders and UI components designed around AI suggestions, skill analyses, and smart searching.
- **REST Backend**: Spring Boot scaffolding setup to connect to MySQL database natively.

## How to run the Frontend

1. Ensure you have Node.js installed.
2. Open a terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to the local URL (usually `http://localhost:5173`).

## How to run the Backend

1. Ensure you have Java 17+ and Maven installed.
2. Ensure you have MySQL running and create a database named `zero2earn`. Update `backend/src/main/resources/application.properties` with your database credentials.
3. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
4. The REST API will be available at `http://localhost:8080/api/status`.
