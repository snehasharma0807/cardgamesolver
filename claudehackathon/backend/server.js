const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 5000;

// ensure uploads dir exists
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '.jpg';
    const name = `${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`;
    cb(null, name);
  }
});

const upload = multer({ storage });

app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Accepts 'image' field multipart/form-data and saves it to uploads/
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'no file uploaded' });
  res.json({ filename: req.file.filename, path: `/uploads/${req.file.filename}` });
});

// Mock CV endpoint - accepts JSON { filename } and returns fake card bounding boxes
app.post('/mock-cv', (req, res) => {
  const { filename } = req.body || {};
  if (!filename) return res.status(400).json({ error: 'filename required' });
  // Return 2 fake boxes for 'hole cards' and 3 'community' cards as example
  const boxes = [
    { x: 0.1, y: 0.6, w: 0.12, h: 0.2, label: 'AS' },
    { x: 0.25, y: 0.6, w: 0.12, h: 0.2, label: 'KH' },
    { x: 0.45, y: 0.5, w: 0.12, h: 0.2, label: '7D' },
    { x: 0.6, y: 0.5, w: 0.12, h: 0.2, label: '2C' },
    { x: 0.75, y: 0.5, w: 0.12, h: 0.2, label: '9S' }
  ];
  res.json({ filename, boxes, game: 'POKER', note: 'mocked results' });
});

// Serve uploads directory statically (for quick testing) - in production serve differently
app.use('/uploads', express.static(UPLOAD_DIR));

// Start server with automatic fallback if port is already in use
function startServer(port, attemptsLeft = 10) {
  const server = app.listen(port, () => {
    console.log(`Backend server listening on port ${port}`);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.warn(`Port ${port} in use, ${attemptsLeft - 1} attempts left. Trying port ${port + 1}...`);
      server.close && server.close();
      if (attemptsLeft > 1) {
        // try next port after short delay
        setTimeout(() => startServer(port + 1, attemptsLeft - 1), 200);
      } else {
        console.error('No available ports found, exiting.');
        process.exit(1);
      }
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
}

startServer(PORT);
