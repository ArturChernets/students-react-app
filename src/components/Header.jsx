import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/Header.module.css";
import BellNotifications from "./BellNotifications";
import UserMenu from "./UserMenu";
import AuthModal from "./AuthModal";
import { MdChat } from "react-icons/md";

export default function Header({ onModalOpen, currentRoom, onNavigateToRoom }) {
    const [user, setUser] = useState(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");
        if (token && username) {
            setUser({ nickname: username });
        }
    }, []);

    useEffect(() => {
        onModalOpen(showAuthModal);
    }, [showAuthModal, onModalOpen]);

    const handleAuthSuccess = (authData) => {
        setUser({ nickname: authData.username });
    };

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.patch("http://localhost:8080/api/auth/logout", {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.clear();
            setUser(null);
            navigate("/");
        }
    };

    return (
        <header className={styles.header}>
            <div className={styles.leftSection}>
                <Link to="/students" className={styles.csmText}>CMS</Link>
            </div>
            <div className={styles.rightSection}>
                {user ? (
                    <>
                        <Link to="/messages">
                            <MdChat className={styles.chatIcon} />
                        </Link>
                        <BellNotifications
                            currentRoom={currentRoom}
                            onNavigateToRoom={onNavigateToRoom}
                        />
                        <img
                            src="https://thumbs.dreamstime.com/b/default-avatar-profile-icon-image-user-vector-179390926.jpg"
                            alt="Avatar"
                            className={styles.avatar}
                        />
                        <UserMenu nickname={user.nickname} onLogout={handleLogout} />
                    </>
                ) : (
                    <button
                        onClick={() => setShowAuthModal(true)}
                        className={styles.loginButton}
                    >
                        Log In
                    </button>
                )}
            </div>
            {showAuthModal && (
                <AuthModal
                    onClose={() => setShowAuthModal(false)}
                    onAuthSuccess={handleAuthSuccess}
                />
            )}
        </header>
    );
}
