import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import styles from '../styles/GroupChat.module.css';


const socket = io('http://localhost:3000', {
    auth: {
        token: localStorage.getItem('token')
    }
});

export default function GroupChat({ roomId, chatName }) {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [input, setInput] = useState('');
    const bottomRef = useRef();
    const currentUserId = localStorage.getItem('userId');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:8080/api/users/getAll', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setUsers([]);
        }
    };

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
            <div className={styles.header}>Chat: {chatName}</div>
            <div className={styles.messages}>
                {messages.map(msg => {
                    const sender = users.find(user => user.id.toString() === msg.senderId);
                    return (
                        <div
                            key={msg._id}
                            className={
                                msg.senderId === currentUserId
                                    ? styles.sent
                                    : styles.received
                            }
                        >
                            <div className={styles.balloon}>
                                <div className={styles.senderName}>
                                    {sender ? sender.username : 'Unknown'}
                                </div>
                                <div>{msg.content}</div>
                            </div>
                        </div>
                    );
                })}

                <div ref={bottomRef}/>
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