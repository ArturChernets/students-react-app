import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/UserMenu.module.css";

const UserMenu = ({ nickname }) => {
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
                    <Link to="/edit-profile" className={styles.dropdownItem}>
                        Edit
                    </Link>
                    <Link to="/logout" className={styles.dropdownItem}>
                        Log Out
                    </Link>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
