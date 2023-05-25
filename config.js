module.exports = {
    secretKey: 'your-secret-key',
    sessionOptions: {
      secret: 'your-session-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // Set to 'true' if using HTTPS
        maxAge: 86400000, // 24 hours
      },
    },
  };