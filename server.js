// ====================== TOP OF FILE ======================
require('dotenv').config();

require('express-async-errors');

const express = require('express');
const cors = require('cors');

const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const layoutRoutes = require('./src/routes/layoutRoutes');
const currentStateRoutes = require('./src/routes/currentStateRoutes');
const { notFound, errorHandler } = require('./src/middleware/errorHandler');

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'border-customs-dashboard-backend' });
});

app.use('/api/auth', authRoutes);
app.use('/api/layouts', layoutRoutes);
app.use('/api/current-state', currentStateRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    console.log('🔄 Attempting to connect to MongoDB Atlas...');
    
    // Pass the URI here (important because of your db.js)
    await connectDB(process.env.MONGO_URI);

    console.log('✅ MongoDB Connected Successfully');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
})();