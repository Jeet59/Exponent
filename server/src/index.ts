import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import * as google from './google';
import * as microsoft from './microsoft';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/* GOOGLE */

app.get('/auth/google', (_req, res) => {
  res.redirect(google.getAuthUrl());
});

app.get('/auth/google/callback', async (req, res) => {
  const code = req.query.code as string;
  if (!code) return res.status(400).json({ error: 'Code required' });
  try {
    const tokens = await google.getTokens(code);
    res.json(tokens);
  } catch (e) {
    res.status(500).json({ error: 'Failed to get tokens' });
  }
});

app.get('/gmail', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Token required' });
  try {
    const emails = await google.listEmails(token);
    res.json(emails);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
});


/* MICROSOFT */

app.get('/auth/microsoft', async (_req, res) => {
  try {
    const url = await microsoft.getAuthUrl();
    res.redirect(url);
  } catch (e) {
    res.status(500).json({ error: 'Failed to get auth URL' });
  }
});

app.get('/auth/microsoft/callback', async (req, res) => {
  const code = req.query.code as string;
  if (!code) return res.status(400).json({ error: 'Code required' });
  try {
    const tokens = await microsoft.getTokens(code);
    res.json(tokens);
  } catch (e) {
    res.status(500).json({ error: 'Failed to get tokens' });
  }
});

app.get('/outlook', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Token required' });
  try {
    const emails = await microsoft.listEmails(token);
    res.json(emails);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
