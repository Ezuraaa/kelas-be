import express from 'express';
import cors from 'cors';
import subjectRouter from './routes/subjects';

const app = express();
const PORT = 8000;

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true

}))

app.use(express.json());

app.use('/api/subjects', subjectRouter)

app.get('/', (req, res) => {
  res.send('Welcome to the Express TypeScript Server!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
