import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

//  Middleware settings
app.use(cors());
app.use(express.json());
app.use(pinoHttp());

//  Routes

//get notes
app.get('/notes', (req, res) => {
  res.status(200).json({ message: 'Retrieved all notes' });
});


app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({ message: `Retrieved note with ID: ${noteId}` });
});

//test
app.get('/test-error', () => {
  throw new Error('Simulated server error');
});


app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

//err
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

//start
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});