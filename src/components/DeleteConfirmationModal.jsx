import React from "react";
import styles from "../styles/DeleteConfirmationModal.module.css";

function DeleteConfirmationModal({ student, closeModal, handleDelete }) {
    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h3>Are you sure you want to delete user {student.firstName} {student.lastName}?</h3>
                </div>
                <div className={styles.modalFooter}>
                    <button className={styles.cancelButton} onClick={closeModal}>
                        Cancel
                    </button>
                    <button
                        className={styles.createButton}
                        onClick={() => { handleDelete(student.id); closeModal(); }}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmationModal;
