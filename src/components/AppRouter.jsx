import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import StudentsTable from "./StudentsTable";
import MessagesPage from "./MessagesPage.jsx";

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/students" />} />
            <Route path="/students" element={<StudentsTable />} />
            <Route path="/messages" element={<MessagesPage />} />
        </Routes>
    );
}

export default AppRouter;
