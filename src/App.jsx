import React from "react";
import { BrowserRouter } from "react-router-dom";
import Header from "./components/Header";
import Menu from "./components/Menu";
import AppRouter from "./components/AppRouter"; // Тепер назви співпадають!

function App() {
    return (
        <BrowserRouter>
            <Header />
            <Menu />
            <main className="content">
                <AppRouter />
            </main>
        </BrowserRouter>
    );
}

export default App;
