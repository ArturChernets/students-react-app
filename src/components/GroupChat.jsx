import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import styles from '../styles/GroupChat.module.css';

const socket = io('http://localhost:3000', {
    auth: {
        token: localStorage.getItem('token')
    }
});

export default function GroupChat({ roomId }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const bottomRef = useRef();
    const currentUserId = localStorage.getItem('userId');

    useEffect(() => {
        if (roomId) {
            fetchMessages();
            socket.emit('joinRoom', { roomId });
        }

        socket.on('newMessage', (message) => {
            if (message.roomId === roomId) {
                setMessages(prev => [...prev, message]);
            }
        });

        return () => {
            socket.emit('leaveRoom', { roomId });
            socket.off('newMessage');
        };
    }, [roomId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(
                `http://localhost:3000/api/chatrooms/${roomId}/messages`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages(res.data);
        } catch (err) {
            console.error('Failed to fetch messages:', err);
        }
    };

    const sendMessage = () => {
        if (!input.trim()) return;

        socket.emit('sendMessage', {
            type: 'group',
            roomId,
            content: input
        });

        setInput('');
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>Room: {roomId}</div>
            <div className={styles.messages}>
                {messages.map(msg => (
                    <div
                        key={msg._id}
                        className={
                            msg.senderId === currentUserId
                                ? styles.sent
                                : styles.received
                        }
                    >
                        <div className={styles.balloon}>{msg.content}</div>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
            <div className={styles.inputArea}>
                <textarea
                    className={styles.textbox}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <button className={styles.sendButton} onClick={sendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
}
