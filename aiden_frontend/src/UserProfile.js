// src/UserProfile.js
import React, { useEffect, useState } from 'react';
import { db } from './firebaseConfig';
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from './AuthProvider'; // Assuming this is your authentication context

const UserProfile = () => {
    const { currentUser } = useAuth(); // Getting the current user from AuthProvider
    const [completedTasks, setCompletedTasks] = useState([]);

    useEffect(() => {
        const fetchCompletedTasks = async () => {
            if (currentUser) {
                const q = query(collection(db, "tasks"), where("userId", "==", currentUser.uid), where("status", "==", "Completed"));
                const querySnapshot = await getDocs(q);
                const tasks = querySnapshot.docs.map(doc => doc.data());
                setCompletedTasks(tasks);
            }
        };

        fetchCompletedTasks();
    }, [currentUser]);

    return (
        <div>
            <h2>User Profile</h2>
            {currentUser && (
                <div>
                    <p>Name: {currentUser.displayName || 'No name set'}</p>
                    <p>Email: {currentUser.email}</p>
                </div>
            )}
            <h3>Completed Tasks</h3>
            <ul>
                {completedTasks.map(task => (
                    <li key={task.id}>{task.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default UserProfile;
