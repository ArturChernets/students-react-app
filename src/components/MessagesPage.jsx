import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../styles/MessagesPage.module.css";

const avatarSrc = "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-image-user-vector-179390926.jpg";

function MessagesPage() {
    return (
        <main className={styles.messagesPage}>
            <h1 className={styles.title}>Messages</h1>

            <div className={styles.messagesContainer}>
                <aside className={styles.chatRooms}>
                    <div className={styles.chatRoomsHeader}>
                        <h2>Chat room</h2>
                        <a href="#" className={styles.newChat}>+ New chat room</a>
                    </div>
                    <ul className={styles.chatList}>
                        {["Admin", "Ann Smith", "John Bond", "Ivon Stan"].map((name, index) => (
                            <li key={index} className={`${styles.chatItem} ${index === 0 ? styles.active : ""}`}>
                                <img src={avatarSrc} alt={`${name} avatar`} className={styles.chatAvatar} />
                                <span>{name}</span>
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
        </main>
    );
}

export default MessagesPage;