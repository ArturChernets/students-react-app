import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/MessagesPage.module.css';
import AddChatModal from '../components/AddChatModal';

const avatarSrc = 'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-image-user-vector-179390926.jpg';

function MessagesPage() {
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

            const data = res.data;
            if (Array.isArray(data)) {
                setRooms(data); // Якщо це масив, оновлюємо стан
            } else {
                console.warn('Expected array from /api/chatrooms/my but got:', data);
                setRooms([]); // Якщо дані не є масивом, обнуляємо кімнати
            }
        } catch (error) {
            console.error('Failed to fetch chat rooms:', error);
            setRooms([]); // На випадок помилки
        }
    };

    const handleRoomCreate = (newRoom) => {
        setRooms(prev => [...prev, newRoom]);
    };

    return (
        <main className={styles.messagesPage}>
            <h1 className={styles.title}>Messages</h1>
            <div className={styles.messagesContainer}>
                <aside className={styles.chatRooms}>
                    <div className={styles.chatRoomsHeader}>
                        <h2>Chat room</h2>
                        <button className={styles.addButton} onClick={() => setModalOpen(true)}>
                            + New chat room
                        </button>
                    </div>
                    <ul className={styles.chatList}>
                        {rooms.map((room, index) => (
                            <li
                                key={room._id}
                                className={`${styles.chatItem} ${selectedRoom === room._id ? styles.active : ''}`}
                                onClick={() => setSelectedRoom(room._id)}
                            >
                                <img src={avatarSrc} alt={`${room.name} avatar`} className={styles.chatAvatar} />
                                <span>{room.name}</span>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* Main chat area */}
                <section className={styles.chatArea}>
                    <div className={styles.chatHeader}>
                        <h2>Chat room: Admin</h2>
                        <div className={styles.members}>
                            <span>Members</span>
                            <div className={styles.memberAvatars}>
                                {[...Array(3)].map((_, i) => (
                                    <img key={i} src={avatarSrc} alt="Member avatar" className={styles.memberAvatar} />
                                ))}
                                <span className={styles.moreMembers}>+2</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.chatMessages}>
                        <div className={`${styles.message} ${styles.received}`}>
                            <div className={styles.messageWrapper}>
                                <img src={avatarSrc} alt="Admin avatar" className={styles.messageAvatar} />
                                <span className={styles.messageSender}>Admin</span>
                            </div>
                            <div className={styles.messageText}>
                                <div className={styles.messageContent}>Hi there! This is a test message.</div>
                            </div>
                        </div>

                        <div className={`${styles.message} ${styles.sent}`}>
                            <div className={styles.messageText}>
                                <div className={styles.messageContent}>Hello, how are you?</div>
                            </div>
                            <div className={styles.messageWrapper}>
                                <img src={avatarSrc} alt="Me avatar" className={styles.messageAvatar} />
                                <span className={styles.messageSender}>Me</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.chatInput}>
                        <textarea placeholder="Type a message..." />
                        <button className={styles.sendButton}>
                            <i className="fa-solid fa-paper-plane"></i>
                        </button>
                    </div>
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

export default MessagesPage;
