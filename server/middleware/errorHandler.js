import { config } from '../config/env.js';

export function errorHandler(err, req, res, next) {
  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      error: `File size exceeds the permitted limit of ${config.security.maxUploadSizeBytes / (1024 * 1024)} MB.`
    });
  }

  if (err.code === 'INVALID_FILE_TYPE') {
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }

  // Zod / Schema validation errors
  if (err.name === 'ZodError') {
    const issues = err.issues ? err.issues.map(i => ({ field: i.path.join('.'), message: i.message })) : [];
    return res.status(400).json({
      success: false,
      error: 'Request validation failed.',
      validationErrors: issues
    });
  }

  // Database duplicate key error
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      error: 'A record with this identifier or unique parameter already exists.'
    });
  }

  // Default server error - NEVER leak sensitive database or stack trace details in response
  const isDev = config.nodeEnv === 'development';
  console.error('[SERVER ERROR]', err);

  res.status(err.status || 500).json({
    success: false,
    error: err.status ? err.message : 'An internal server error occurred. Please contact the system administrator.',
    ...(isDev && !err.status ? { debug: err.message } : {})
  });
}
