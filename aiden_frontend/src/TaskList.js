import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import './TaskList.css';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            const querySnapshot = await getDocs(collection(db, "tasks"));
            const fetchedTasks = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // Calculate initial completion percentage for tasks with subtasks
                completion: doc.data().subtasks ? calculateCompletion(doc.data().subtasks) : doc.data().status === 'Completed' ? 100 : 0,
            }));
            setTasks(fetchedTasks);
        };

        fetchTasks();
    }, []);

    const calculateCompletion = (subtasks) => {
        const completedSubtasks = subtasks.filter(subtask => subtask.completed).length;
        return (completedSubtasks / subtasks.length) * 100;
    };

    const deleteTask = async (id) => {
        await deleteDoc(doc(db, "tasks", id));
        setTasks(tasks.filter(task => task.id !== id));
    };

    const markAsCompleted = async (taskId, subtaskId = null) => {
        const taskDoc = doc(db, "tasks", taskId);
        let updatedTask;

        if (subtaskId) {
            // Mark the specific subtask as completed
            updatedTask = tasks.map(task => {
                if (task.id === taskId) {
                    const updatedSubtasks = task.subtasks.map(subtask =>
                        subtask.id === subtaskId ? { ...subtask, completed: true } : subtask
                    );
                    return { ...task, subtasks: updatedSubtasks, completion: calculateCompletion(updatedSubtasks) };
                }
                return task;
            });
        } else {
            // Mark the entire task as completed
            updatedTask = tasks.map(task =>
                task.id === taskId ? { ...task, status: "Completed", completion: 100 } : task
            );
        }

        await updateDoc(taskDoc, updatedTask.find(task => task.id === taskId));
        setTasks(updatedTask);
    };

    return (
        <div className="task-list-container">
            <h2>Tasks</h2>
            <div className="task-list">
                {tasks.map(task => (
                    <div key={task.id} className={`task-item ${task.status === "Completed" ? "completed" : ""}`}>
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <p>Due: {task.dueDate}</p>
                        <p>Priority: {task.priority}</p>
                        <p>Status: {task.status}</p>
                        <p>Tags: {task.tags.join(', ')}</p>
                        {/* Display subtasks if they exist */}
                        {task.subtasks && task.subtasks.map(subtask => (
                            <div key={subtask.id} className={`subtask ${subtask.completed ? "completed" : ""}`}>
                                <span>{subtask.title}</span>
                                <button onClick={() => markAsCompleted(task.id, subtask.id)}>Mark Subtask Completed</button>
                            </div>
                        ))}
                        <div className="progress-bar">
                            <div className="progress-bar-fill" style={{ width: `${task.completion}%` }}></div>
                        </div>
                        <div className="task-actions">
                            <button onClick={() => markAsCompleted(task.id)} className="complete-btn">Mark Task Completed</button>
                            <button onClick={() => deleteTask(task.id)} className="delete-btn">Delete Task</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskList;

