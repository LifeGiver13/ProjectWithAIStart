import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import animeData from './routes/animeFile.js';

dotenv.config({ path: '.env.local' });

const app = express();
const port = 3000;

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use('/api', animeData);

if (process.env.RENDER === 'true' || process.env.VERCEL !== '1') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
