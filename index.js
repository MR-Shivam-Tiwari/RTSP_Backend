const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const overlayRoutes = require('./overlays');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase JSON body parser limit
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Increase URL-encoded body parser limit

// Hello World Route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Routes
app.use('/api/overlays', overlayRoutes);

// Export the app for Vercel
module.exports = app;

// Start the server only if not running in serverless mode
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
