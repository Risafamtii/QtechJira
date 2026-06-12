const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());

app.use('/api', routes);

// Unmatched routes + centralized error handling (must be last).
app.use(notFound);
app.use(errorHandler);

module.exports = app;
