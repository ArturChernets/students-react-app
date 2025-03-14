import React from "react";
import styles from "../styles/DeleteConfirmationModal.module.css";

function BulkDeleteConfirmationModal({ selectedCount, closeModal, handleBulkDelete }) {
    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h3>
                        Are you sure you want to delete {selectedCount} selected student{selectedCount > 1 ? "s" : ""}?
                    </h3>
                </div>
                <div className={styles.modalFooter}>
                    <button className={styles.cancelButton} onClick={closeModal}>
                        Cancel
                    </button>
                    <button
                        className={styles.createButton}
                        onClick={() => {
                            handleBulkDelete();
                            closeModal();
                        }}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BulkDeleteConfirmationModal;
