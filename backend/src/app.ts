import express from 'express';
import cors from 'cors';
import paymentsRouter from './routes/payments';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/payments', paymentsRouter);

export default app;
