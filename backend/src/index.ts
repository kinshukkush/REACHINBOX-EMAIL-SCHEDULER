import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import emailRoutes from './routes/emailRoutes';
import { setupWorker } from './workers/emailWorker';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// CORS Configuration for production
const allowedOrigins = [
    'http://localhost:3000',
    'https://reachinbox-email-scheduler-inky.vercel.app',
    process.env.FRONTEND_URL || '',
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.some(allowed => allowed && origin.startsWith(allowed))) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/emails', emailRoutes);

// Initialize Worker
setupWorker();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
