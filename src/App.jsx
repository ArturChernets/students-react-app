import React, {useState, useEffect} from "react";
import {BrowserRouter} from "react-router-dom";
import Header from "./components/Header";
import Menu from "./components/Menu";
import AppRouter from "./components/AppRouter";
import styles from "./styles/App.module.css";
import {io} from "socket.io-client";

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRoom, setCurrentRoom] = useState(null);

    const handleModalOpen = (isOpen) => {
        setIsModalOpen(isOpen);
    };

    // стартуємо один сокет для всього додатку
    useEffect(() => {
        const socket = (window.socket = io("http://localhost:3000", {
            auth: { token: localStorage.getItem("token") },
        }));
        socket.on("connect", () => {
            console.log("Client socket connected, id =", socket.id);
        });
        socket.on("connect_error", (err) => {
            console.error("Socket connection error:", err.message);
        });
        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <BrowserRouter>
            <div className={isModalOpen ? styles.appDisabled : styles.app}>
                <Header
                    onModalOpen={handleModalOpen}
                    currentRoom={currentRoom}
                    onNavigateToRoom={setCurrentRoom}
                />
                <Menu/>
                <main className="content">
                    <AppRouter
                        currentRoom={currentRoom}
                        onNavigateToRoom={setCurrentRoom}
                    />
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;
