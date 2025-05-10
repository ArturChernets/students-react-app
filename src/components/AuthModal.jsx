import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import styles from "../styles/AuthModal.module.css";

function AuthModal({ onClose, onAuthSuccess }) {
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [notification, setNotification] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;

        setSubmitting(true);
        setError("");
        setNotification("");
        const endpoint = isRegister
            ? "http://localhost:8080/api/auth/register"
            : "http://localhost:8080/api/auth/login";
        try {
            const response = await axios.post(endpoint, formData);
            console.log("Auth response:", response.data);
            if (response.data) {
                if (isRegister) {
                    setNotification("Registration successful! Please log in.");
                    setTimeout(() => {
                        setNotification("");
                        setIsRegister(false);
                        setFormData({ username: "", password: "" });
                    }, 1500);
                } else {
                    const { token, username, id: userId } = response.data;
                    if (!token) {
                        throw new Error("No token received from server.");
                    }
                    localStorage.setItem("token", token);
                    localStorage.setItem("username", username || formData.username);
                    localStorage.setItem("userId", userId); // Зберігаємо userId
                    setNotification("Login successful!");
                    setTimeout(() => {
                        onAuthSuccess({ username: username || formData.username, userId });
                        onClose();
                        window.location.reload();
                    }, 1500);
                }
            }
        } catch (err) {
            console.error("Auth error:", err);
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError(isRegister ? "Registration failed. Try again." : "Invalid username or password.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification("");
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    return ReactDOM.createPortal(
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h2>{isRegister ? "Register" : "Login"}</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        disabled={submitting}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={submitting}
                    />
                    {error && <div className={styles.error}>{error}</div>}
                    {notification && <div className={styles.notification}>{notification}</div>}
                    <button type="submit" className={styles.submitButton} disabled={submitting}>
                        {submitting ? "Processing..." : isRegister ? "Register" : "Login"}
                    </button>
                </form>
                <button
                    onClick={() => {
                        setIsRegister(!isRegister);
                        setError("");
                        setNotification("");
                        setFormData({ username: "", password: "" });
                    }}
                    className={styles.switchMode}
                    disabled={submitting}
                >
                    {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
                </button>
                <button onClick={onClose} className={styles.closeButton} disabled={submitting}>
                    Close
                </button>
            </div>
        </div>,
        document.body
    );
}

export default AuthModal;