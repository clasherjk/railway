import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static HTML
app.use(express.static('public'));

// API route to proxy request
app.get('/api/player', async (req, res) => {
  const tag = req.query.tag?.replace('#', '').toUpperCase();
  if (!tag) return res.status(400).json({ error: 'Missing player tag' });

  try {
    const response = await fetch(`https://cocproxy.royaleapi.dev/v1/players/%23${tag}`, {
      headers: {
        Authorization: `Bearer ${process.env.COC_TOKEN}`
      }
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
