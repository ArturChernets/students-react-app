import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import StudentsTable from "./StudentsTable";

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/students" />} />
            <Route path="/students" element={<StudentsTable />} />
        </Routes>
    );
}

export default AppRouter;
