import React, { useState } from 'react';
import { db } from './firebaseConfig'; // Ensure this path matches your project structure
import { collection, addDoc } from "firebase/firestore";
import './AddTaskForm.css';

const AddTaskForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [status, setStatus] = useState('Not Started');
    const [tags, setTags] = useState('');
    const [hasSubtasks, setHasSubtasks] = useState(false);
    const [subtasks, setSubtasks] = useState([{ id: Date.now(), title: '', completed: false }]);

    const handleSubtaskChange = (id, value) => {
        const updatedSubtasks = subtasks.map(subtask =>
            subtask.id === id ? { ...subtask, title: value } : subtask
        );
        setSubtasks(updatedSubtasks);
    };

    const addSubtask = () => {
        setSubtasks([...subtasks, { id: Date.now(), title: '', completed: false }]);
    };

    const removeSubtask = (id) => {
        setSubtasks(subtasks.filter(subtask => subtask.id !== id));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const taskTags = tags.split(',').map(tag => tag.trim());
        try {
            await addDoc(collection(db, "tasks"), {
                title,
                description,
                dueDate,
                priority,
                status,
                tags: taskTags,
                subtasks: hasSubtasks ? subtasks : [],
            });
            console.log("Task added!");
            // Reset form fields after successful submission
            resetForm();
        } catch (error) {
            console.error("Error adding task: ", error);
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setDueDate('');
        setPriority('Medium');
        setStatus('Not Started');
        setTags('');
        setHasSubtasks(false);
        setSubtasks([{ id: Date.now(), title: '', completed: false }]);
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} className="task-form">
                <h2>Add a New Task</h2>
                {/* Form inputs and labels */}
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="dueDate">Due Date:</label>
                    <input
                        type="date"
                        id="dueDate"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="priority">Priority:</label>
                    <select
                        id="priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        required>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="status">Status:</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required>
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="tags">Tags (comma-separated):</label>
                    <input
                        type="text"
                        id="tags"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />
                </div>

                {/* Subtasks Section */}
                <div className="form-group">
                    <label htmlFor="hasSubtasks">Has Subtasks:</label>
                    <input
                        type="checkbox"
                        id="hasSubtasks"
                        checked={hasSubtasks}
                        onChange={(e) => setHasSubtasks(e.target.checked)}
                    />
                </div>
                {hasSubtasks && subtasks.map((subtask, index) => (
                    <div key={subtask.id} className="subtask">
                        <input
                            type="text"
                            placeholder={`Subtask ${index + 1} Title`}
                            value={subtask.title}
                            onChange={(e) => handleSubtaskChange(subtask.id, e.target.value)}
                            required={hasSubtasks}
                        />
                        <button type="button" onClick={() => removeSubtask(subtask.id)}>Remove</button>
                    </div>
                ))}
                {hasSubtasks && <button type="button" onClick={addSubtask}>Add Subtask</button>}

                <button type="submit">Add Task</button>
            </form>
        </div>
    );
};

export default AddTaskForm;
