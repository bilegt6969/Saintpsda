require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');

// ===========================================
// Environment Validation
// ===========================================
const validateEnvironment = () => {
  const requiredVars = [
    'FIREBASE_SERVICE_ACCOUNT',
    'API_KEY',
    'PORT',
    'FRONTEND_URL'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    const requiredKeys = ['project_id', 'private_key', 'client_email'];
    const missingKeys = requiredKeys.filter(key => !serviceAccount[key]);
    
    if (missingKeys.length > 0) {
      throw new Error(`Missing required Firebase keys: ${missingKeys.join(', ')}`);
    }
  } catch (error) {
    throw new Error(`Invalid FIREBASE_SERVICE_ACCOUNT: ${error.message}`);
  }
};

try {
  validateEnvironment();
} catch (error) {
  console.error('❌ Environment validation failed:', error.message);
  process.exit(1);
}

// ===========================================
// Firebase Initialization
// ===========================================
let firebaseApp;
try {
  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    ),
    databaseURL: `https://${JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT).project_id}.firebaseio.com`
  });
  console.log('✅ Firebase Admin initialized');
} catch (error) {
  console.error('🔥 Firebase initialization failed:', error);
  process.exit(1);
}

// ===========================================
// Express Configuration
// ===========================================
const app = express();

// Security Headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"]
    }
  },
  hsts: {
    maxAge: 63072000, // 2 years in seconds
    includeSubDomains: true,
    preload: true
  }
}));

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// Request Logging
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'));

// Body Parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ===========================================
// Authentication Middleware
// ===========================================
const authenticateKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    console.warn(`API key missing from ${req.ip}`);
    return res.status(401).json({ 
      error: 'Authentication required',
      code: 'MISSING_API_KEY'
    });
  }

  if (apiKey !== process.env.API_KEY) {
    console.warn(`Invalid API key attempt from ${req.ip}`);
    return res.status(403).json({ 
      error: 'Forbidden',
      code: 'INVALID_API_KEY'
    });
  }

  next();
};

// ===========================================
// API Routes
// ===========================================
// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    firebase: admin.apps.length > 0 ? 'Connected' : 'Disconnected'
  });
});

// Protected Users Endpoint
app.get('/api/users', authenticateKey, async (req, res) => {
  try {
    const { users } = await admin.auth().listUsers(1000);
    
    const sanitizedUsers = users.map(user => ({
      uid: user.uid,
      email: user.email || null,
      displayName: user.displayName || null,
      lastSignIn: user.metadata.lastSignInTime,
      createdAt: user.metadata.creationTime,
      providers: user.providerData.map(p => p.providerId)
    }));

    res.json({
      count: sanitizedUsers.length,
      users: sanitizedUsers
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      code: 'USER_FETCH_FAILED',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ===========================================
// Error Handling
// ===========================================
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    code: 'INTERNAL_ERROR'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    code: 'ENDPOINT_NOT_FOUND'
  });
});

// ===========================================
// Server Initialization
// ===========================================
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔐 API key protection: ${process.env.API_KEY ? 'ENABLED' : 'DISABLED'}`);
  console.log(`🌐 Allowed origins: ${process.env.FRONTEND_URL}`);
});

// Graceful Shutdown
const shutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
  
  setTimeout(() => {
    console.error('Force shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));