import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/AuthRoutes.js';
import contactsRoutes from './routes/ContactRoutes.js';
import messagesRoutes from './routes/MessagesRoutes.js';
import setupSocket from './socket.js';

dotenv.config(); // Load environment variables from .env file
const app = express(); // Initialize express app
const port = process.env.PORT || 3001;
const dbURL = process.env.DB_URL;

// middleware to parse json bodies
// app.use(bodyParser.json())
app.use(express.json());

// middle for cookies
app.use(cookieParser());

// cors configuration
app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true, // Allow cookies to be sent with requests
  })
);

app.use('/uploads/profiles', express.static('uploads/profiles'));
app.use('/uploads/files', express.static('uploads/files'));

app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/messages', messagesRoutes);
const server = app.listen(port, () => {
  console.log(`Server is running on port no: ${port}`);
});

setupSocket(server);
// Database connection
mongoose
  .connect(dbURL)
  .then(() => console.log(`Database Connection Success!`))
  .catch((error) => console.error('Database Connection Error:', error));
