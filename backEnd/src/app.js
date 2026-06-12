const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();

// FRONTEND_URL may be a single origin or a comma-separated list
// (e.g. "https://app.vercel.app,http://localhost:5173").
const allowedOrigins = env.FRONTEND_URL.split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser clients (curl, health checks) that send no Origin.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS: origin ${origin} is not allowed`));
    },
    credentials: true,
  })
);
app.use(express.json());

app.use('/api', routes);

// Unmatched routes + centralized error handling (must be last).
app.use(notFound);
app.use(errorHandler);

module.exports = app;
