import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectDB } from './mongoose.js';
import SharedText from './models/SharedText.js';

const port = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// Map to track save operations
const saveQueue = new Map();

io.on('connection', async (socket) => {
    console.log('New client connected:', socket.id);

    let textDoc;

    try {
        textDoc = await SharedText.findOne();
        if (!textDoc) {
            textDoc = new SharedText({ content: '' });
            await textDoc.save();
        }
    } catch (error) {
        console.error('Error fetching/creating SharedText document:', error);
        socket.emit('error', 'Database error occurred');
        return;
    }

    // Send the current content to the new client
    socket.emit('messageUpdate', textDoc.content);

    socket.on('message', (newText) => {
        console.log('Received text update:', newText);

        // Avoid parallel saves by queuing the save operation
        if (!saveQueue.has(textDoc._id)) {
            saveQueue.set(textDoc._id, Promise.resolve());
        }

        saveQueue.set(
            textDoc._id,
            saveQueue.get(textDoc._id).then(async () => {
                try {
                    textDoc.content = newText;
                    await textDoc.save();
                    socket.broadcast.emit('messageUpdate', newText);
                } catch (error) {
                    console.error('Error updating SharedText document:', error);
                    socket.emit('error', 'Failed to save updates');
                }
            })
        );
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

httpServer.listen(port, () => {
    console.log(`Backend server is running on port ${port}`);
});
