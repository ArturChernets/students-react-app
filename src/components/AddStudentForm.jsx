import React, { useState } from "react";
import styles from "../styles/AddEditModal.module.css";

function AddStudentForm({ closeModal, handleCreate }) {
    const [formData, setFormData] = useState({
        group: "",
        firstName: "",
        lastName: "",
        gender: "",
        birthday: "",
    });
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error for the field when user types
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validate = () => {
        const newErrors = {};
        const nameRegex = /^[A-Za-z]+$/;

        if (!formData.group) {
            newErrors.group = "Group is required.";
        }
        if (!formData.firstName) {
            newErrors.firstName = "First name is required.";
        } else if (!nameRegex.test(formData.firstName)) {
            newErrors.firstName = "First name must contain only letters.";
        }
        if (!formData.lastName) {
            newErrors.lastName = "Last name is required.";
        } else if (!nameRegex.test(formData.lastName)) {
            newErrors.lastName = "Last name must contain only letters.";
        }
        if (!formData.gender) {
            newErrors.gender = "Gender is required.";
        }
        if (!formData.birthday) {
            newErrors.birthday = "Birthday is required.";
        } else {
            const today = new Date();
            const birthdayDate = new Date(formData.birthday);
            if (birthdayDate > today) {
                newErrors.birthday = "Birthday cannot be in the future.";
            }
        }
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        handleCreate(formData);
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h3>Add Student</h3>
                    <button className={styles.closeButton} onClick={closeModal}>
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Group</label>
                        <select
                            name="group"
                            value={formData.group}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Group</option>
                            <option value="PZ-21">PZ-21</option>
                            <option value="PZ-22">PZ-22</option>
                            <option value="PZ-23">PZ-23</option>
                            <option value="PZ-24">PZ-24</option>
                            <option value="PZ-25">PZ-25</option>
                            <option value="PZ-26">PZ-26</option>
                        </select>
                        {errors.group && (
                            <span className={styles.errorText}>{errors.group}</span>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label>First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="First Name"
                        />
                        {errors.firstName && (
                            <span className={styles.errorText}>{errors.firstName}</span>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Last Name"
                        />
                        {errors.lastName && (
                            <span className={styles.errorText}>{errors.lastName}</span>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        {errors.gender && (
                            <span className={styles.errorText}>{errors.gender}</span>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Birthday</label>
                        <input
                            type="date"
                            name="birthday"
                            value={formData.birthday}
                            onChange={handleInputChange}
                        />
                        {errors.birthday && (
                            <span className={styles.errorText}>{errors.birthday}</span>
                        )}
                    </div>

                    <div className={styles.modalFooter}>
                        <button
                            className={styles.cancelButton}
                            onClick={closeModal}
                            type="button"
                        >
                            Cancel
                        </button>
                        <button className={styles.createButton} type="submit">
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddStudentForm;
