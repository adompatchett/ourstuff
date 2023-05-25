const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');
const bcrypt = require('bcrypt');
const config = require('./config.js');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        // Find the user by email
        const user = await User.findOne({ email });
        
        if (!user) {
          return done(null, false, { message: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Invalid credentials' });
        }

        // If the credentials are valid, return the user object
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialize user into a session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from a session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    console.log(user);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.secretKey, // Replace with your own secret key
};

passport.use(
  new JwtStrategy(opts, async (payload, done) => {
    
    try {
      // Find the user by ID from the payload
      const user = await User.findById(payload.userId);
      
      if (!user) {
        return done(null, false);
      }
      
      // Pass the user object to the next middleware
      return done(null, user);
    } catch (error) {
      console.error(error);
      return done(error, false);
    }
  })
);

module.exports = passport;