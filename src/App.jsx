import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import Header from "./components/Header";
import Menu from "./components/Menu";
import AppRouter from "./components/AppRouter";
import styles from "./styles/App.module.css";

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalOpen = (isOpen) => {
        setIsModalOpen(isOpen);
    };

    return (
        <BrowserRouter>
            <div className={isModalOpen ? styles.appDisabled : styles.app}>
                <Header onModalOpen={handleModalOpen} />
                <Menu />
                <main className="content">
                    <AppRouter />
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;