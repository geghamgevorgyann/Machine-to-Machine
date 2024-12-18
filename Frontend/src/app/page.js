'use client';

import { useEffect, useState } from "react";
import socket from "@/$api/socket";

export default function Home() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        const handleConnect = () => {

        };

        const handleMessageUpdate = (updatedText) => {
            setMessage(updatedText);
        };

        const handleError = (error) => {
            console.error('Error from server:', error);
            alert(error);
        };

        socket.connect();

        socket.on('connect', handleConnect);
        socket.on('messageUpdate', handleMessageUpdate);
        socket.on('error', handleError);

        return () => {
            socket.disconnect();
            socket.off('connect', handleConnect);
            socket.off('messageUpdate', handleMessageUpdate);
            socket.off('error', handleError);
        };
    }, []);

    const handleTextAreaChange = (e) => {
        const newText = e.target.value;
        setMessage(newText);
        socket.emit('message', newText);
    };

    return (
        <div className="flex w-screen h-screen items-center justify-center p-4 bg-amber-50 ">
            <textarea
                className="w-2/3 h-full min-h-full rounded-xl shadow p-4 outline-none text-2xl"
                placeholder={"type here..."}
                value={message}
                onChange={handleTextAreaChange}
            />
        </div>
    );
}
