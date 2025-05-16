import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import StudentsTable from "./StudentsTable";
import MessagesPage from "./MessagesPage.jsx";

function AppRouter({ currentRoom, onNavigateToRoom }) {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/students" />} />
            <Route path="/students" element={<StudentsTable />} />
            <Route
                path="/messages"
                element={
                    <MessagesPage
                        currentRoom={currentRoom}
                        onNavigateToRoom={onNavigateToRoom}
                    />
                }
            />
        </Routes>
    );
}

export default AppRouter;
