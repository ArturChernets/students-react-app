import React, { useState } from "react";
import { FaPlus, FaEdit, FaTimes, FaTrash } from "react-icons/fa";
import styles from "../styles/StudentsTable.module.css";
import AddStudentForm from "./AddStudentForm";
import EditStudentForm from "./EditStudentForm";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import BulkDeleteConfirmationModal from "./BulkDeleteConfirmationModal";

function StudentsTable() {
    const [students, setStudents] = useState([
        { id: 1, group: "PZ-21", firstName: "John", lastName: "Smith", gender: "Male", birthday: "2004-05-11", status: "active" },
        { id: 2, group: "PZ-22", firstName: "Ann", lastName: "Bond", gender: "Female", birthday: "2004-04-24", status: "inactive" },
        { id: 3, group: "PZ-23", firstName: "Mark", lastName: "Lee", gender: "Male", birthday: "2003-07-15", status: "active" },
    ]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedStudentIds, setSelectedStudentIds] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 3;

    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);
    const totalPages = Math.ceil(students.length / studentsPerPage);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const openEditModal = (student) => {
        setSelectedStudent(student);
        setIsEditModalOpen(true);
    };
    const closeEditModal = () => {
        setSelectedStudent(null);
        setIsEditModalOpen(false);
    };

    const openDeleteModal = (student) => {
        setSelectedStudent(student);
        setIsDeleteModalOpen(true);
    };
    const closeDeleteModal = () => setIsDeleteModalOpen(false);

    const openBulkDeleteModal = () => {
        if (selectedStudentIds.length > 0)
            setIsBulkDeleteModalOpen(true);
        else
            alert("No students selected for deletion.");
    };
    const closeBulkDeleteModal = () => setIsBulkDeleteModalOpen(false);

    const handleCreate = (studentData) => {
        const newStudent = { id: students.length + 1, ...studentData, status: "active" };
        setStudents([...students, newStudent]);
        closeModal();
    };

    const handleUpdate = (updatedStudent) => {
        setStudents(students.map((student) => (student.id === updatedStudent.id ? updatedStudent : student)));
        closeEditModal();
    };

    const handleDelete = (studentId) => {
        setStudents(students.filter((student) => student.id !== studentId));
        closeDeleteModal();
    };

    const handleBulkDelete = () => {
        setStudents(students.filter((student) => !selectedStudentIds.includes(student.id)));
        setSelectedStudentIds([]);
    };

    // Функція для вибору лише студентів на поточній сторінці
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const currentPageIds = currentStudents.map((student) => student.id);
            setSelectedStudentIds(currentPageIds);
        } else {
            setSelectedStudentIds([]);
        }
    };

    const handleSelectRow = (id) => (e) => {
        if (e.target.checked) {
            setSelectedStudentIds([...selectedStudentIds, id]);
        } else {
            setSelectedStudentIds(selectedStudentIds.filter((studentId) => studentId !== id));
        }
    };

    const nextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
    const prevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

    return (
        <div className={styles.studentsPage}>
            <div className={styles.header}>
                <h2>Students</h2>
                <div className={styles.headerButtons}>
                    <button className={styles.addButton} onClick={openModal}><FaPlus /></button>
                    <button className={styles.trashButton} onClick={openBulkDeleteModal}><FaTrash /></button>
                </div>
            </div>

            {isModalOpen && <AddStudentForm closeModal={closeModal} handleCreate={handleCreate} />}
            {isEditModalOpen && <EditStudentForm closeModal={closeEditModal} handleUpdate={handleUpdate} studentData={selectedStudent} />}
            {isDeleteModalOpen && <DeleteConfirmationModal student={selectedStudent} closeModal={closeDeleteModal} handleDelete={handleDelete} />}
            {isBulkDeleteModalOpen && <BulkDeleteConfirmationModal selectedCount={selectedStudentIds.length} closeModal={closeBulkDeleteModal} handleBulkDelete={handleBulkDelete} />}

            <table className={styles.table}>
                <thead>
                <tr>
                    <th>
                        <input
                            type="checkbox"
                            onChange={handleSelectAll}
                            checked={currentStudents.length > 0 && selectedStudentIds.length === currentStudents.length}
                        />
                    </th>
                    <th>Group</th>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Birthday</th>
                    <th>Status</th>
                    <th>Options</th>
                </tr>
                </thead>
                <tbody>
                {currentStudents.map((student) => (
                    <tr key={student.id}>
                        <td>
                            <input
                                type="checkbox"
                                onChange={handleSelectRow(student.id)}
                                checked={selectedStudentIds.includes(student.id)}
                            />
                        </td>
                        <td><b>{student.group}</b></td>
                        <td><b>{student.firstName} {student.lastName}</b></td>
                        <td>{student.gender}</td>
                        <td><b>{new Date(student.birthday).toLocaleDateString()}</b></td>
                        <td>
                            <span className={student.status === "active" ? styles.statusGreen : styles.statusGray}></span>
                        </td>
                        <td>
                            <FaEdit className={styles.icon} onClick={() => openEditModal(student)} />
                            <FaTimes className={styles.icon} onClick={() => openDeleteModal(student)} />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className={styles.footer}>
                <div className={styles.pagination}>
                    <button onClick={prevPage} disabled={currentPage === 1} className={styles.pageButton}>
                        &laquo; Previous
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`${styles.pageButton} ${currentPage === index + 1 ? styles.activePage : ""}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button onClick={nextPage} disabled={currentPage === totalPages} className={styles.pageButton}>
                        Next &raquo;
                    </button>
                </div>
            </div>
        </div>
    );
}

export default StudentsTable;
