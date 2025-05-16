// src/components/BellNotifications.jsx

import React, { useEffect, useState } from "react";
import { MdNotificationsNone, MdNotificationsActive } from "react-icons/md";
import styles from "../styles/BellNotifications.module.css";
import { useNavigate } from "react-router-dom";

export default function BellNotifications({ currentRoom, onNavigateToRoom }) {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]); // { id, roomId, username, message }
    const [animate, setAnimate] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handler = (msg) => {
            if (msg.roomId === currentRoom) return;
            setNotifications((prev) => [
                { id: msg._id, roomId: msg.roomId, username: msg.username, message: msg.content },
                ...prev,
            ]);
            setAnimate(true);
            setTimeout(() => setAnimate(false), 800);
        };

        window.socket?.on("newMessage", handler);
        return () => {
            window.socket?.off("newMessage", handler);
        };
    }, [currentRoom]);

    const handleMouseEnter = () => setIsOpen(true);
    const handleMouseLeave = () => setIsOpen(false);

    const handleClickNotif = (roomId) => {
        setNotifications((prev) => prev.filter((n) => n.roomId !== roomId));
        onNavigateToRoom(roomId);
        navigate("/messages");
    };

    return (
        <div
            className={styles.bellContainer}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className={`${styles.bellIcon} ${animate ? styles.shake : ""}`}>
                {notifications.length > 0 ? <MdNotificationsActive /> : <MdNotificationsNone />}
                {notifications.length > 0 && <div className={styles.unreadDot}></div>}
            </div>

            {isOpen && (
                <div className={styles.notificationsList}>
                    {notifications.length > 0 ? (
                        notifications.map((n) => (
                            <div
                                key={n.id}
                                className={styles.notification}
                                onClick={() => handleClickNotif(n.roomId)}
                            >
                                <div className={styles.notificationText}>
                                    <span className={styles.username}>{n.username}:</span>{" "}
                                    <span className={styles.message}>
                                        {n.message.length > 30
                                            ? n.message.slice(0, 27) + "..."
                                            : n.message}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className={styles.noMessages}>No new messages</p>
                    )}
                </div>
            )}
        </div>
    );
}
