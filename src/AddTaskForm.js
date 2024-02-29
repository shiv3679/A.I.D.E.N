import React, { useState } from 'react';
import { db, auth } from './firebaseConfig'; // Ensure these are imported correctly
import { collection, addDoc } from "firebase/firestore";
import './AddTaskForm.css'; // Ensure you have the CSS file for styling

const AddTaskForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [status, setStatus] = useState('Not Started');
    const [tags, setTags] = useState('');
    const [hasSubtasks, setHasSubtasks] = useState(false);
    const [subtasks, setSubtasks] = useState([{ id: Date.now(), title: '', completed: false }]);

    const handleSubtaskChange = (index, event) => {
        const newSubtasks = [...subtasks];
        newSubtasks[index].title = event.target.value;
        setSubtasks(newSubtasks);
    };

    const addSubtask = () => {
        setSubtasks([...subtasks, { id: Date.now(), title: '', completed: false }]);
    };

    const removeSubtask = (index) => {
        const newSubtasks = [...subtasks];
        newSubtasks.splice(index, 1);
        setSubtasks(newSubtasks);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!auth.currentUser) {
            console.error("No authenticated user found.");
            return;
        }

        try {
            await addDoc(collection(db, "tasks"), {
                userId: auth.currentUser.uid,
                title,
                description,
                dueDate,
                priority,
                status,
                tags: tags.split(',').map(tag => tag.trim()),
                subtasks: hasSubtasks ? subtasks : [],
            });
            console.log("Task added successfully!");
            // Reset form fields
            setTitle('');
            setDescription('');
            setDueDate('');
            setPriority('Medium');
            setStatus('Not Started');
            setTags('');
            setHasSubtasks(false);
            setSubtasks([{ id: Date.now(), title: '', completed: false }]);
        } catch (error) {
            console.error("Error adding task: ", error);
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} className="task-form">
                <h2>Add a New Task</h2>
                <div className="form-group">
                    <label>Title:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Due Date:</label>
                    <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Priority:</label>
                    <select value={priority} onChange={(e) => setPriority(e.target.value)} required>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Status:</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} required>
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Tags (comma-separated):</label>
                    <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Has Subtasks:</label>
                    <input type="checkbox" checked={hasSubtasks} onChange={(e) => setHasSubtasks(e.target.checked)} />
                </div>
                {hasSubtasks && subtasks.map((subtask, index) => (
                    <div key={subtask.id} className="subtask">
                        <input type="text" placeholder="Subtask title" value={subtask.title} onChange={(e) => handleSubtaskChange(index, e)} required />
                        <button type="button" onClick={() => removeSubtask(index)}className="icon-btn delete-btn"></button>
                    </div>
                ))}
                {hasSubtasks && <button type="button" onClick={addSubtask} className="icon-btn add-btn"></button>}
                <button type="submit" className="submit-btn">Add Task</button>
            </form>
        </div>
    );
};

export default AddTaskForm;
