import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig'; // Ensure this path is correct
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import './TaskList.css';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            const querySnapshot = await getDocs(collection(db, "tasks"));
            const fetchedTasks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTasks(fetchedTasks);
        };

        fetchTasks();
    }, []);

    const deleteTask = async (id) => {
        await deleteDoc(doc(db, "tasks", id));
        setTasks(tasks.filter(task => task.id !== id));
    };

    const markAsCompleted = async (id) => {
        const taskDoc = doc(db, "tasks", id);
        await updateDoc(taskDoc, { status: "Completed" });
        setTasks(tasks.map(task => task.id === id ? { ...task, status: "Completed" } : task));
    };

    // Optional: Implement an editTask function if you want inline editing

    return (
        <div className="task-list-container">
            <h2>Tasks</h2>
            <div className="task-list">
                {tasks.map(task => (
                    <div key={task.id} className="task-item">
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <p>Due: {task.dueDate}</p>
                        <p>Priority: {task.priority}</p>
                        <p>Status: {task.status}</p>
                        <p>Tags: {task.tags.join(', ')}</p>
                        <button onClick={() => markAsCompleted(task.id)}>Mark as Completed</button>
                        <button onClick={() => deleteTask(task.id)}>Delete</button>
                        {/* For inline editing, you might add an Edit button here */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskList;
