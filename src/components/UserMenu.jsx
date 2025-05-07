import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/UserMenu.module.css";

const UserMenu = ({ nickname, onLogout }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <div
            className={styles.userMenu}
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
        >
            <span className={styles.nickname}>{nickname}</span>
            {showDropdown && (
                <div className={styles.userDropdown}>
                    <span className={styles.dropdownItem}>
                        Edit
                    </span>
                    <span onClick={onLogout} className={styles.dropdownItem}>
                        Log Out
                    </span>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
