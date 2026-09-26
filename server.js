import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets from dist folder with long cache
app.use('/assets', express.static(path.join(__dirname, 'dist/assets'), {
    maxAge: '1y',
    immutable: true
}));

// Serve other static files (favicons, logos, etc.)
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback: send index.html for all non-static GET routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Amarnath Securities production server running on port ${PORT}`);
});
