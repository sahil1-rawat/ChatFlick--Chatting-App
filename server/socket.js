import { Server as SocketIOServer } from 'socket.io'; // Import Socket.IO server
import Message from './models/MessagesModel.js'; // Import message model for database interactions

const setupSocket = (server) => {
  // Initialize Socket.IO server with CORS settings
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN, // Allow requests from this origin
      methods: ['GET', 'POST'], // Allow only GET and POST requests
      credentials: true, // Enable credentials (cookies, authorization headers, etc.)
    },
  });

  // Map to keep track of user IDs and their corresponding socket IDs
  const userSocketMap = new Map();
  // Map to keep track of online/offline status
  const userStatusMap = new Map();

  // Function to handle socket disconnection
  const disconnect = (socket) => {
    console.log(`Client Disconnected: ${socket.id}`);
    // Remove the user from the map when they disconnect
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        userStatusMap.set(userId, false); // Set status to offline
        // Notify other users about the status change
        io.emit('userStatusChange', { userId, status: 'offline' });
        break;
      }
    }
  };

  // Function to handle sending messages
  const sendMessage = async (message) => {
    try {
      // Get socket IDs for sender and recipient
      const senderSocketId = userSocketMap.get(message.sender);
      const recipientSocketId = userSocketMap.get(message.recipient);

      // Save message to the database
      const createdMessage = await Message.create(message);
      console.log(createdMessage);

      // Retrieve the saved message with populated sender and recipient details
      const messageData = await Message.findById(createdMessage._id)
        .populate(
          'sender',
          'id email firstName lastName fullName image color bio'
        )
        .populate('recipient', 'id email fullName image color bio');

      // console.log('Message data to send:', messageData);

      // Emit the message to the recipient if they are connected
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('receiveMessage', messageData);
      }
      // Emit the message to the sender if they are connected
      if (senderSocketId) {
        io.to(senderSocketId).emit('receiveMessage', messageData); // Use the same event name for sender
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Set up Socket.IO event handlers
  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId; // Get user ID from socket handshake query

    if (userId) {
      // Map user ID to socket ID
      userSocketMap.set(userId, socket.id);
      userStatusMap.set(userId, true); // Set status to online
      console.log(`User connected: ${userId} with socket ID ${socket.id}`);

      // Notify other users about the status change
      io.emit('userStatusChange', { userId, status: 'online' });

      // Emit current status of all users to the newly connected user
      socket.emit(
        'multipleUserStatusChange',
        Object.fromEntries(userStatusMap)
      );
    } else {
      console.log('User ID not provided during connection');
    }

    // Listen for 'sendMessage' events and handle them with sendMessage function
    socket.on('sendMessage', sendMessage);

    // Listen for 'getSocketIds' events and handle them with getSocketIds function

    // Listen for 'disconnect' events and handle them with disconnect function
    socket.on('disconnect', () => disconnect(socket));
  });

  return io; // Return the Socket.IO instance if needed elsewhere
};

export default setupSocket;
