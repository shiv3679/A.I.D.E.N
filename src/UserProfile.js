import React, { useEffect, useState } from 'react';
import { db } from './firebaseConfig';
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from './AuthProvider'; // Assuming this is your authentication context
import './UserProfile.css'; // Assuming you have a CSS file for styling

const UserProfile = () => {
    const { currentUser } = useAuth(); // Getting the current user from AuthProvider
    const [completedTasks, setCompletedTasks] = useState([]);

    useEffect(() => {
        const fetchCompletedTasks = async () => {
            if (currentUser) {
                const q = query(collection(db, "tasks"), where("userId", "==", currentUser.uid), where("status", "==", "Completed"));
                const querySnapshot = await getDocs(q);
                const tasks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCompletedTasks(tasks);
            }
        };

        fetchCompletedTasks();
    }, [currentUser]);

    return (
        <div className="profile-container">
            <div className="user-info">
                <h2>User Profile</h2>
                {currentUser && (
                    <div className="user-details">
                        <p>Name: {currentUser.displayName || 'No name set'}</p>
                        <p>Email: {currentUser.email}</p>
                    </div>
                )}
            </div>
            <div className="completed-tasks">
                <h3>Completed Tasks</h3>
                <ul>
                    {completedTasks.map(task => (
                        <li key={task.id}>{task.title}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default UserProfile;
