import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_API_URL, {
    autoConnect: false, // Prevent automatic connection on import
});

export default socket;
