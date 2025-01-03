// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // MongoDB connection
// mongoose.connect('mongodb://localhost:27017/FormBuilder', { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('MongoDB connected successfully'))
//     .catch(err => console.error('MongoDB connection error:', err));

// const userSchema = new mongoose.Schema({
//     username: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     lastLogin: { type: Date }
// });

// // Pre-save hook to hash password before saving
// userSchema.pre('save', async function (next) {
//     if (this.isModified('password')) {
//         this.password = await bcrypt.hash(this.password, 10); // Hash the password
//     }
//     next();
// });

// // Method to compare password during login
// userSchema.methods.comparePassword = async function (candidatePassword) {
//     return await bcrypt.compare(candidatePassword, this.password);
// };

// // Create the model
// const User = mongoose.model('User', userSchema);

// // Registration API
// app.post('/register', async (req, res) => {
//     const { username, password, email } = req.body;

//     if (!username || !password || !email) {
//         return res.status(400).json({ message: 'All fields are required' });
//     }

//     try {
//         const existingUser = await User.findOne({ $or: [{ username }, { email }] });
//         if (existingUser) {
//             return res.status(400).json({ message: 'Username or email already taken' });
//         }

//         const user = new User({ username, password, email });
//         await user.save();

//         res.status(201).json({
//             message: 'User registered successfully',
//             userId: user._id  // Return the Mongo-generated user ID
//         });
//     } catch (err) {
//         console.error('Error registering user:', err);
//         res.status(500).json({ message: 'Server error' });
//     }
// });


// // Login API
// app.post('/login', async (req, res) => {
//     const { username, password } = req.body;

//     if (!username || !password) {
//         return res.status(400).json({ message: 'Username and password are required' });
//     }

//     try {
//         const user = await User.findOne({ username });

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         const isMatch = await user.comparePassword(password);
//         if (!isMatch) {
//             return res.status(401).json({ message: 'Invalid password' });
//         }

//         // Update lastLogin with current date and time
//         user.lastLogin = new Date();
//         await user.save();

//         res.status(200).json({
//             message: 'Login successful',
//             lastLogin: user.lastLogin,
//             userId: user._id  // Return the Mongo-generated user ID
//         });
//     } catch (err) {
//         console.error('Error logging in user:', err);
//         res.status(500).json({ message: 'Server error' });
//     }
// });



// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library'); // Google OAuth2 Client

// Initialize Google OAuth2 Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// console.log('abc', client)

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/FormBuilder', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully', 'google-client', client))
    .catch(err => console.error('MongoDB connection error:', err));


const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String },
    email: { type: String, required: true, unique: true },
    lastLogin: { type: Date },
    googleId: { type: String }, // Store googleId if the user logs in with Google
    avatar: { type: String } // To store user's profile image from Google
});

// Pre-save hook to hash password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10); // Hash the password
    }
    next();
});

// Method to compare password during login
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Create the model
const User = mongoose.model('User', userSchema);

// Registration API
app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already taken' });
        }

        const user = new User({ username, password, email });
        await user.save();

        res.status(201).json({
            message: 'User registered successfully',
            userId: user._id // Return the Mongo-generated user ID
        });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login API
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Update lastLogin with current date and time
        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            message: 'Login successful',
            lastLogin: user.lastLogin,
            userId: user._id  // Return the Mongo-generated user ID
        });
    } catch (err) {
        console.error('Error logging in user:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Google Login API
app.post('/auth/google', async (req, res) => {
    const { token } = req.body;

    try {
        // Verify the Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture, sub: googleId } = payload;

        // Check if the user exists in the DB
        let user = await User.findOne({ email });
        if (!user) {
            // If user doesn't exist, create a new user and assign the required fields
            user = new User({
                email,
                username: name || `user_${googleId}`,  // Use name or create a default username from Google ID
                avatar: picture,
                googleId,
            });
            await user.save();  // Save the new user
        }

        // Generate JWT token for the user
        const jwtToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({
            token: jwtToken, // Send the JWT token to the client
            user,
        });

    } catch (error) {
        console.error('Google login error:', error);
        res.status(400).json({ message: 'Invalid Google Token' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
