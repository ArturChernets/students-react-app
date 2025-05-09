// src/components/MessagesPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddChatModal from '../components/AddChatModal';
import GroupChat from '../components/GroupChat';
import styles from '../styles/MessagesPage.module.css';

export default function MessagesPage() {
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:3000/api/chatrooms/my', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRooms(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Failed to fetch chat rooms:', err);
            setRooms([]);
        }
    };

    const handleRoomCreate = room => {
        setRooms(prev => [...prev, room]);
        setSelectedRoom(room._id);
    };

    return (
        <main className={styles.messagesPage}>
            <h1 className={styles.title}>Messages</h1>
            <div className={styles.messagesContainer}>
                <aside className={styles.chatRooms}>
                    <div className={styles.chatRoomsHeader}>
                        <h2>Chat Rooms</h2>
                        <button
                            className={styles.addButton}
                            onClick={() => setModalOpen(true)}
                        >+ New Room</button>
                    </div>
                    <ul className={styles.chatList}>
                        {rooms.map(room => (
                            <li
                                key={room._id}
                                className={`${styles.chatItem} ${selectedRoom === room._id ? styles.active : ''}`}
                                onClick={() => setSelectedRoom(room._id)}
                            >
                                <span>{room.name}</span>
                            </li>
                        ))}
                    </ul>
                </aside>

                <section className={styles.chatArea}>
                    {selectedRoom
                        ? <GroupChat roomId={selectedRoom} />
                        : <div className={styles.noRoom}>Please select a chat room</div>
                    }
                </section>
            </div>

            <AddChatModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onCreate={handleRoomCreate}
            />
        </main>
    );
}
