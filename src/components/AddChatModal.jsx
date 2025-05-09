import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import styles from '../styles/AddChatModal.module.css';

function AddChatModal({ isOpen, onClose, onCreate }) {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState(new Set());
    const [roomName, setRoomName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            const token = localStorage.getItem('token');

            axios.get('http://localhost:8080/api/users/getAll', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(res => {
                    console.log(res.data);  // Check the structure of the data
                    setUsers(res.data);  // Assuming response data has `username`
                })
                .catch(() => setError('Failed to load users'));
        }
    }, [isOpen]);

    const toggleUser = (userName) => {
        const updated = new Set(selectedUsers);
        if (updated.has(userName)) updated.delete(userName);
        else updated.add(userName);
        setSelectedUsers(updated);
    };

    const handleCreate = async () => {
        if (!roomName.trim()) {
            setError('Room name is required');
            return;
        }
        if (selectedUsers.size === 0) {
            setError('Select at least one participant');
            return;
        }
        try {
            const payload = { name: roomName, members: Array.from(selectedUsers) };
            console.log(selectedUsers);
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:3000/api/chatrooms', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onCreate(res.data);
            onClose();
        } catch {
            setError('Failed to create chat room');
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h3>Create Chat Room</h3>
                    <button className={styles.closeButton} onClick={onClose}>&times;</button>
                </div>
                <div className={styles.formGroup}>
                    <label>Room Name</label>
                    <input
                        type="text"
                        value={roomName}
                        onChange={e => setRoomName(e.target.value)}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Select Participants</label>
                    {users.map(user => (
                        <div key={user._id} className={styles.userCheckboxContainer}>
                            <input
                                type="checkbox"
                                id={user._id}
                                onChange={() => toggleUser(user.username)}
                            />
                            <label htmlFor={user._id}>{user.username}</label>
                        </div>
                    ))}
                </div>
                {error && <span className={styles.errorText}>{error}</span>}
                <div className={styles.modalFooter}>
                    <button className={styles.cancelButton} onClick={onClose}>Cancel</button>
                    <button className={styles.createButton} onClick={handleCreate}>Create</button>
                </div>
            </div>
        </div>
    );
}

AddChatModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onCreate: PropTypes.func.isRequired,
};

export default AddChatModal;
