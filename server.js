const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const blogRoutes = require('./routes/userapi/blog');
const writingRoutes = require('./routes/userapi/writing');
const audioRoutes = require('./routes/userapi/audio');
const videoRoutes = require('./routes/userapi/video');
const storeRoutes = require('./routes/userapi/store');
const artworkRoutes = require('./routes/userapi/artwork');
const podcastRoutes = require('./routes/userapi/podcast');
const photoRoutes = require('./routes/userapi/photography');
const bodyParser = require('body-parser');
const friendsRoutes = require('./routes/userapi/friends');
const storePublicRoutes = require('./routes/public/store');
const cartRoutes = require('./routes/public/cart');
//Public
const randomhome = require('./routes/public/random');
const likesRoutes = require('./routes/public/likes');
const publicUserRoutes = require('./routes/public/people');
const searchPublicRoutes = require('./routes/public/search');
const commentRoutes = require('./routes/public/comments');

// Add the following middleware before defining your routes
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use(cookieParser());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
// Initialize Passport.js configuration
require('./passportconfig.js');

const authRoutes = require('./routes/userapi/auth');
const userManagementRoutes = require('./routes/userapi/usermanagement');



// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/checkoutmystuff', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Check the connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


app.use('/api/auth', authRoutes);
app.use('/api/users', userManagementRoutes);
app.use('/api/blog',blogRoutes);
app.use('/api/writing',writingRoutes);
app.use('/api/audio',audioRoutes);
app.use('/api/video',videoRoutes);
app.use('/api/store',storeRoutes);
app.use('/api/artwork',artworkRoutes);
app.use('/api/podcast',podcastRoutes);
app.use('/api/photo',photoRoutes);
app.use('/api/friends',friendsRoutes);

app.use('/api/public/',randomhome);
app.use('/api/public/likes',likesRoutes);
app.use('/api/public/store',storePublicRoutes);
app.use('/api/public/search',searchPublicRoutes);
app.use('/api/public/users',publicUserRoutes);
app.use('/api/private/cart',cartRoutes);
app.use('/api/public/comments',commentRoutes);

// Dynamic routing for user profiles
app.use('/:username', (req, res, next) => {
  const { username } = req.params;
  // Perform any necessary validations or checks here

  // Pass the username to the request object
  req.username = username;
  next();
});

// User routes
// Define your user routes here using the router

// Index route
app.get('/', (req, res) => {
  console.log('INDEX');
});

app.listen(80, () => {
  console.log('Server started on port 80');
});
