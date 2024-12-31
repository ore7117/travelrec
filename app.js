require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRouter = require('./routes/users'); // User routes
const recommendationRouter = require('./routes/recommendation'); // Recommendation routes
const placesRouter = require('./routes/places'); // Import the places route

const app = express();
const PORT = process.env.PORT || 5001;

// Validate environment variables
if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI is not set.');
  process.exit(1);
}
if (!process.env.OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY is not set.');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Log incoming requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  });

// Register Routes
app.use('/users', userRouter); // User routes (login, profile)
app.use('/api', recommendationRouter); // Recommendation routes
app.use('/api', placesRouter); // Register the places route

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  const isProduction = process.env.NODE_ENV === 'production';
  res.status(500).send({
    error: 'Something went wrong!',
    details: isProduction ? undefined : err.message,
    stack: isProduction ? undefined : err.stack,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
