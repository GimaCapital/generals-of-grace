# Generals of Grace Intl Church

## About
Official website for Generals of Grace Intl Church - Raising Generals of Grace for Kingdom Impact.

## Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS
- Framer Motion
- React Router DOM
- Lucide React Icons

### Backend
- Node.js + Express
- Firebase Admin SDK
- Firestore Database
- Firebase Authentication
- Nodemailer

## Deployment

### Frontend (Static Site)
- Hosted on Render
- URL: https://gog-frontend.onrender.com

### Backend (API)
- Hosted on Render
- URL: https://gog-backend.onrender.com

## Local Development

### Frontend
cd frontend
npm install
npm run dev

### Backend
cd backend
npm install
npm run dev

## Environment Variables

### Frontend (.env)
VITE_API_URL=http://localhost:3000/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

### Backend (.env)
PORT=3000
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:5173
EMAIL_USER=your_email
EMAIL_PASS=your_email_password

Made with ❤️ for Generals of Grace Intl Church