import React, { useState, useEffect } from "react";
import styles from "../styles/AddEditModal.module.css";

function EditStudentForm({ closeModal, handleUpdate, studentData }) {
    const [formData, setFormData] = useState({
        id: "",
        groupName: "",
        firstName: "",
        lastName: "",
        gender: "",
        birthday: ""
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (studentData) {
            setFormData({
                id: studentData.id || "",
                groupName: studentData.groupName || studentData.group || "",
                firstName: studentData.firstName || "",
                lastName: studentData.lastName || "",
                gender: studentData.gender || "",
                birthday: studentData.birthday ? new Date(studentData.birthday).toISOString().split("T")[0] : "" // Format to YYYY-MM-DD
            });
        }
    }, [studentData]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validate = () => {
        const newErrors = {};
        const nameRegex = /^[A-Za-zА-ЯЁҐЄІЇа-яёґєії]+$/;

        if (!formData.groupName) {
            newErrors.groupName = "Group is required.";
        }
        if (!formData.firstName) {
            newErrors.firstName = "First name is required.";
        } else if (!nameRegex.test(formData.firstName)) {
            newErrors.firstName = "First name must contain only Ukrainian and English letters.";
        }
        if (!formData.lastName) {
            newErrors.lastName = "Last name is required.";
        } else if (!nameRegex.test(formData.lastName)) {
            newErrors.lastName = "Last name must contain only Ukrainian and English letters.";
        }
        if (!formData.gender) {
            newErrors.gender = "Gender is required.";
        }
        if (!formData.birthday) {
            newErrors.birthday = "Birthday is required.";
        } else {
            const birthdayDate = new Date(formData.birthday);
            const year = birthdayDate.getFullYear();
            if (year < 2000 || year > 2007) {
                newErrors.birthday = "Birthday must be between 2000 and 2007.";
            }
            const today = new Date();
            if (birthdayDate > today) {
                newErrors.birthday = "Birthday cannot be in the future.";
            }
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setSubmitting(true);
        try {
            const formattedData = {
                ...formData,
                birthday: new Date(formData.birthday).toISOString().split("T")[0]
            };
            console.log("Submitting update data:", formattedData);
            await handleUpdate(formattedData);
        } catch (error) {
            console.error("Update submission error:", error);
            setErrors({ submit: "Failed to update student. Try again." });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h3>Edit Student</h3>
                    <button className={styles.closeButton} onClick={closeModal}>
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Group</label>
                        <select
                            name="groupName"
                            value={formData.groupName}
                            onChange={handleInputChange}
                            disabled={submitting}
                        >
                            <option value="">Select Group</option>
                            <option value="PZ-21">PZ-21</option>
                            <option value="PZ-22">PZ-22</option>
                            <option value="PZ-23">PZ-23</option>
                            <option value="PZ-24">PZ-24</option>
                            <option value="PZ-25">PZ-25</option>
                            <option value="PZ-26">PZ-26</option>
                        </select>
                        {errors.groupName && (
                            <span className={styles.errorText}>{errors.groupName}</span>
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
                            disabled={submitting}
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
                            disabled={submitting}
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
                            disabled={submitting}
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
                            disabled={submitting}
                        />
                        {errors.birthday && (
                            <span className={styles.errorText}>{errors.birthday}</span>
                        )}
                    </div>

                    {errors.submit && (
                        <div className={styles.errorText}>{errors.submit}</div>
                    )}

                    <div className={styles.modalFooter}>
                        <button
                            className={styles.cancelButton}
                            onClick={closeModal}
                            type="button"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            className={styles.createButton}
                            type="submit"
                            disabled={submitting}
                        >
                            {submitting ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditStudentForm;