import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import tenderRouter from './routes/tenders.js';
import dashboardRouter from './routes/dashboard.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'OK' }));
app.use('/api/auth', authRouter);
app.use('/api/tenders', tenderRouter);
app.use('/api/dashboard', dashboardRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API listening on :${port}`));
