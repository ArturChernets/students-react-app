import React, { useState, useEffect } from "react";
import { MdNotificationsNone, MdNotificationsActive } from "react-icons/md";
import styles from "../styles/BellNotifications.module.css";

function BellNotifications() {
    const [isOpen, setIsOpen] = useState(false);
    const [hasNewNotification, setHasNewNotification] = useState(false);
    const [animate, setAnimate] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Simulating new message arrival after 5 seconds
        const timer = setTimeout(() => {
            setAnimate(true); // Start bell animation
            setTimeout(() => {
                setHasNewNotification(true); // Show notification icon
                setAnimate(false); // Stop animation
                setNotifications([
                    { id: 1, avatar: "https://randomuser.me/api/portraits/men/1.jpg", username: "JohnDoe", message: "Testing of the new feature is complete." },
                    { id: 2, avatar: "https://randomuser.me/api/portraits/women/1.jpg", username: "JaneSmith", message: "Found a bug in the authentication module." },
                    { id: 3, avatar: "https://randomuser.me/api/portraits/men/2.jpg", username: "SamWilson", message: "Can't make a pull request due to a conflict with the main branch" },
                ]);
            }, 1000);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const handleMouseEnter = () => {
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        setIsOpen(false);
    };

    return (
        <div
            className={styles.bellContainer}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className={`${styles.bellIcon} ${animate ? styles.shake : ""}`}>
                {hasNewNotification ? (
                    <MdNotificationsActive/>
                ) : (
                    <MdNotificationsNone/>
                )}
                {hasNewNotification && <div className={styles.unreadDot}></div>}
            </div>

            {isOpen && (
                <div className={styles.notificationsList}>
                    {notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <div key={notif.id} className={styles.notification}>
                                <img
                                    src={notif.avatar}
                                    alt={notif.username}
                                    className={styles.avatar}
                                />
                                <div className={styles.notificationText}>
                                    <span className={styles.username}>{notif.username}</span>
                                    <span className={styles.message}>{notif.message.substring(0, 30)}...</span>
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

export default BellNotifications;
