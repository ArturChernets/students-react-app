import React from "react";
import { NavLink } from "react-router-dom"; // Використовуємо NavLink
import styles from "../styles/Menu.module.css";

function Menu() {
    return (
        <div className={styles.menu}>
            <NavLink
                to="/dashboard"
                className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            >
                Dashboard
            </NavLink>
            <NavLink
                to="/students"
                className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            >
                Students
            </NavLink>
            <NavLink
                to="/tasks"
                className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            >
                Tasks
            </NavLink>
        </div>
    );
}

export default Menu;
