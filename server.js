// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Initialize Express app
const app = express();

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/task_manager', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Define a Mongoose schema for users
const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

// Define a Mongoose model based on the schema
const User = mongoose.model('User', UserSchema);

// Define a Mongoose schema for tasks
const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ['low', 'normal', 'high'],
        default: 'normal'
    },
    status: {
        type: String,
        enum: ['todo', 'inprogress', 'done'],
        default: 'todo'
    },
    percentComplete: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Define a Mongoose model based on the schema
const Task = mongoose.model('Task', TaskSchema);

// Route for user signup
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new user
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'Signup successful' });
    } catch (error) {
        console.error('Error signing up:', error);
        res.status(500).json({ message: 'Error signing up. Please try again.' });
    }
});

// Route for user signin
app.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Verify the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Generate JWT
        const token = jwt.sign({ userId: user._id }, 'q5C8zFJ^87u#D!j3r2Y@sLp$', { expiresIn: '1h' });
        res.status(200).json({ message: 'Signin successful', token });
    } catch (error) {
        console.error('Error signing in:', error);
        res.status(500).json({ message: 'Error signing in. Please try again.' });
    }
});

// Middleware to verify JWT in protected routes
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    jwt.verify(token, 'q5C8zFJ^87u#D!j3r2Y@sLp$', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.userId = decoded.userId;
        next();
    });
};

// Protected route example
app.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'Protected route accessed' });
});

// Route for creating a task
app.post('/tasks', verifyToken, async (req, res) => {
    const { title, priority, status, percentComplete } = req.body;
    try {
        // Create a new task
        const newTask = new Task({ title, priority, status, percentComplete, userId: req.userId });
        await newTask.save();
        res.status(201).json({ message: 'Task created successfully', task: newTask });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Error creating task. Please try again.' });
    }
});

// Route for getting all tasks for a specific user
app.get('/tasks', verifyToken, async (req, res) => {
    try {
        // Find all tasks belonging to the authenticated user
        const tasks = await Task.find({ userId: req.userId });
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Error fetching tasks. Please try again.' });
    }
});

// Route for getting a single task by ID
app.get('/tasks/:id', verifyToken, async (req, res) => {
    const taskId = req.params.id;
    try {
        // Find the task by ID
        const task = await Task.findOne({ _id: taskId, userId: req.userId });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ message: 'Error fetching task. Please try again.' });
    }
});

// Route for updating a task
app.put('/tasks/:id', verifyToken, async (req, res) => {
    const taskId = req.params.id;
    const { title, priority, status, percentComplete } = req.body;
    try {
        // Find the task by ID
        const task = await Task.findOne({ _id: taskId, userId: req.userId });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        // Update the task fields
        task.title = title;
        task.priority = priority;
        task.status = status;
        task.percentComplete = percentComplete;
        task.updatedAt = Date.now();
        await task.save();
        res.status(200).json({ message: 'Task updated successfully', task });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Error updating task. Please try again.' });
    }
});

// Route for deleting a task
app.delete('/tasks/:id', verifyToken, async (req, res) => {
    const taskId = req.params.id;
    try {
        // Find the task by ID
        const task = await Task.findOne({ _id: taskId, userId: req.userId });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        // Delete the task
        await task.remove();
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Error deleting task. Please try again.' });
    }
});

// Serve static files (HTML, CSS, JS) from the public directory
app.use(express.static('public'));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});





