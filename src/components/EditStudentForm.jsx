import React, { useState, useEffect } from "react";
import styles from "../styles/AddEditModal.module.css";

function EditStudentForm({ closeModal, handleUpdate, studentData }) {
    const [group, setGroup] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [gender, setGender] = useState("");
    const [birthday, setBirthday] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (studentData) {
            setGroup(studentData.group);
            setFirstName(studentData.firstName);
            setLastName(studentData.lastName);
            setGender(studentData.gender);
            setBirthday(studentData.birthday);
        }
    }, [studentData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "group") setGroup(value);
        if (name === "firstName") setFirstName(value);
        if (name === "lastName") setLastName(value);
        if (name === "gender") setGender(value);
        if (name === "birthday") setBirthday(value);

        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const newErrors = {};
        const nameRegex = /^[A-Za-z]+$/;

        if (!group) {
            newErrors.group = "Group is required.";
        }
        if (!firstName) {
            newErrors.firstName = "First name is required.";
        } else if (!nameRegex.test(firstName)) {
            newErrors.firstName = "First name must contain only letters.";
        }
        if (!lastName) {
            newErrors.lastName = "Last name is required.";
        } else if (!nameRegex.test(lastName)) {
            newErrors.lastName = "Last name must contain only letters.";
        }
        if (!gender) {
            newErrors.gender = "Gender is required.";
        }
        if (!birthday) {
            newErrors.birthday = "Birthday is required.";
        } else {
            const today = new Date();
            const bday = new Date(birthday);
            if (bday > today) {
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
        handleUpdate({
            id: studentData.id,
            group,
            firstName,
            lastName,
            gender,
            birthday,
        });
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

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Group</label>
                        <select name="group" value={group} onChange={handleInputChange}>
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
                            value={firstName}
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
                            value={lastName}
                            onChange={handleInputChange}
                            placeholder="Last Name"
                        />
                        {errors.lastName && (
                            <span className={styles.errorText}>{errors.lastName}</span>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Gender</label>
                        <select name="gender" value={gender} onChange={handleInputChange}>
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
                            value={birthday}
                            onChange={handleInputChange}
                        />
                        {errors.birthday && (
                            <span className={styles.errorText}>{errors.birthday}</span>
                        )}
                    </div>

                    <div className={styles.modalFooter}>
                        <button className={styles.cancelButton} onClick={closeModal} type="button">
                            Cancel
                        </button>
                        <button className={styles.createButton} type="submit">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditStudentForm;
