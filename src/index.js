import express from 'express';
import cors from 'cors';
import { scrape } from './scrape.js';

// Initializing Express application
const app = express();
const port = 3000;

// Middleware setup
app.use(cors());
app.use(express.json());

// Route setup
app.get('/api/scrape', scrape);

// Starting the server
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
