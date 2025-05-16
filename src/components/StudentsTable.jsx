import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTimes, FaTrash } from "react-icons/fa";
import styles from "../styles/StudentsTable.module.css";
import AddStudentForm from "./AddStudentForm";
import EditStudentForm from "./EditStudentForm";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import BulkDeleteConfirmationModal from "./BulkDeleteConfirmationModal";

const API_URL = "http://localhost:8080/api/students";

function StudentsTable() {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedStudentIds, setSelectedStudentIds] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const studentsPerPage = 3;
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const fetchStudents = async () => {
        if (!token) {
            setError("Please log in to view students.");
            navigate("/");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            console.log("Fetching students with token:", token);
            const res = await axios.get(`${API_URL}/get?page=${currentPage}&size=${studentsPerPage}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudents(res.data.content || []);
            setTotalPages(res.data.totalPages || 1);
        } catch (error) {
            console.error("Fetch error:", error);
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) return;
        fetchStudents();
    }, [currentPage, token]);

    const handleError = (error) => {
        let message = "An error occurred.";
        if (error.response) {
            console.error("Error response:", error.response.data);
            if (error.response.status === 401) {
                message = "Session expired. Please log in again.";
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                navigate("/");
            } else if (error.response.status === 403) {
                message = "Access denied. Contact admin.";
            } else {
                message = error.response.data.message || error.message;
            }
        } else if (error.request) {
            message = "Failed to connect to server. Check if backend is running or CORS is configured.";
        } else {
            message = error.message;
        }
        setError(message);
    };

    const handleCreate = async (studentData) => {
        if (!token) {
            setError("Please log in to create a student.");
            navigate("/");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            console.log("Creating student:", studentData);
            await axios.post(`${API_URL}/create`, studentData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchStudents();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Create error:", error);
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (studentData) => {
        if (!token) {
            setError("Please log in to update a student.");
            navigate("/");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            console.log("Updating student:", studentData);
            await axios.put(`${API_URL}/update/${studentData.id}`, studentData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchStudents();
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Update error:", error);
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!token) {
            setError("Please log in to delete a student.");
            navigate("/");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            console.log("Deleting student ID:", id);
            await axios.delete(`${API_URL}/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchStudents();
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error("Delete error:", error);
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleBulkDelete = async () => {
        if (!token) {
            setError("Please log in to delete students.");
            navigate("/");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            console.log("Bulk deleting IDs:", selectedStudentIds);
            await axios.post(`${API_URL}/bulk-delete`, selectedStudentIds, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchStudents();
            setSelectedStudentIds([]);
            setIsBulkDeleteModalOpen(false);
        } catch (error) {
            console.error("Bulk delete error:", error);
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.studentsPage}>
            <div className={styles.header}>
                <h2>Students</h2>
                <div className={styles.headerButtons}>
                    <button className={styles.addButton} onClick={() => setIsModalOpen(true)} disabled={loading}>
                        <FaPlus />
                    </button>
                    <button
                        className={styles.trashButton}
                        onClick={() => selectedStudentIds.length > 0 ? setIsBulkDeleteModalOpen(true) : setError("No students selected")}
                        disabled={loading}
                    >
                        <FaTrash />
                    </button>
                </div>
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}

            {isModalOpen && <AddStudentForm closeModal={() => setIsModalOpen(false)} handleCreate={handleCreate} />}
            {isEditModalOpen && <EditStudentForm closeModal={() => setIsEditModalOpen(false)} handleUpdate={handleUpdate} studentData={selectedStudent} />}
            {isDeleteModalOpen && <DeleteConfirmationModal student={selectedStudent} closeModal={() => setIsDeleteModalOpen(false)} handleDelete={() => handleDelete(selectedStudent.id)} />}
            {isBulkDeleteModalOpen && <BulkDeleteConfirmationModal selectedCount={selectedStudentIds.length} closeModal={() => setIsBulkDeleteModalOpen(false)} handleBulkDelete={handleBulkDelete} />}

            {loading ? (
                <div>Loading...</div>
            ) : (
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th><input type="checkbox" onChange={(e) => {
                            const ids = e.target.checked ? students.map(s => s.id) : [];
                            setSelectedStudentIds(ids);
                        }} /></th>
                        <th>Group</th>
                        <th>Name</th>
                        <th>Gender</th>
                        <th>Birthday</th>
                        <th>Status</th>
                        <th>Options</th>
                    </tr>
                    </thead>
                    <tbody>
                    {students.length === 0 ? (
                        <tr><td colSpan="7">No students found.</td></tr>
                    ) : (
                        students.map((student) => (
                            <tr key={student.id}>
                                <td><input type="checkbox" checked={selectedStudentIds.includes(student.id)} onChange={(e) => {
                                    setSelectedStudentIds(e.target.checked ? [...selectedStudentIds, student.id] : selectedStudentIds.filter(id => id !== student.id));
                                }} /></td>
                                <td><b>{student.groupName || student.group}</b></td>
                                <td><b>{student.firstName} {student.lastName}</b></td>
                                <td>{student.gender}</td>
                                <td>{new Date(student.birthday).toLocaleDateString()}</td>
                                <td><span className={student.status === "active" ? styles.statusGreen : styles.statusGray}></span></td>
                                <td>
                                    <FaEdit className={styles.icon} onClick={() => { setSelectedStudent(student); setIsEditModalOpen(true); }} />
                                    <FaTimes className={styles.icon} onClick={() => { setSelectedStudent(student); setIsDeleteModalOpen(true); }} />
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            )}

            <div className={styles.footer}>
                <div className={styles.pagination}>
                    <button onClick={() => setCurrentPage(p => Math.max(p - 1, 0))} disabled={currentPage === 0 || loading}>« Previous</button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button key={i} onClick={() => setCurrentPage(i)} className={currentPage === i ? styles.activePage : ""} disabled={loading}>
                            {i + 1}
                        </button>
                    ))}
                    <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages - 1))} disabled={currentPage === totalPages - 1 || loading}>
                        Next »
                    </button>
                </div>
            </div>
        </div>
    );
}

export default StudentsTable;