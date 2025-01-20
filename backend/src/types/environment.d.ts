declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT?: string;
      MONGODB_URI: string;
      CORS_ORIGIN?: string;
      
      // Okta Configuration
      OKTA_ISSUER: string;
      OKTA_CLIENT_ID: string;
      
      // Rate Limiting
      RATE_LIMIT_WINDOW_MS?: string; // Default: 15 minutes
      RATE_LIMIT_MAX?: string; // Default: 100
      
      // Logging
      LOG_LEVEL?: 'error' | 'warn' | 'info' | 'debug';
      
      // JWT Configuration
      JWT_EXPIRY?: string; // Default: '1h'
      
      // MongoDB Connection Options
      MONGODB_POOL_SIZE?: string;
      MONGODB_MAX_IDLE_TIME_MS?: string;
    }
  }
}

export {};
