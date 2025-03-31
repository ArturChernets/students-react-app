import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Header.module.css";
import BellNotifications from "./BellNotifications";
import UserMenu from "./UserMenu";

function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.leftSection}>
                <Link to="/students" className={styles.csmText}>
                    CSM
                </Link>
            </div>

            <div className={styles.rightSection}>
                <BellNotifications />
                <img
                    src="https://thumbs.dreamstime.com/b/default-avatar-profile-icon-image-user-vector-179390926.jpg"
                    alt="Avatar"
                    className={styles.avatar}
                />
                <UserMenu nickname="ArturChernets" />
            </div>
        </header>
    );
}

export default Header;
