import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import emailRoutes from './routes/emailRoutes';
import { setupWorker } from './workers/emailWorker';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/emails', emailRoutes);

// Initialize Worker
setupWorker();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
