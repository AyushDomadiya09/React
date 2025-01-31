import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState('');

    const API_URL = 'http://localhost:8000/todos/';

    const fetchTodos = async () => {
        try {
            const response = await axios.get(API_URL);
            setTodos(response.data);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    // Add a new todo
    const addTodo = async () => {
        if (!title) return;

        try {
            const response = await axios.post(API_URL, { title, completed: false });
            setTodos([...todos, response.data]);
            setTitle('');
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    // Toggle todo completion
    const toggleCompleted = async (id) => {
        const todo = todos.find((t) => t.id === id);
        if (!todo) return;

        try {
            const updatedTodo = { ...todo, completed: !todo.completed };
            await axios.put(`${API_URL}${id}/`, updatedTodo);
            setTodos(todos.map((t) => (t.id === id ? updatedTodo : t)));
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    // Delete a todo
    const deleteTodo = async (id) => {
        try {
            await axios.delete(`${API_URL}${id}/`);
            setTodos(todos.filter((t) => t.id !== id));
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    return (
        <div>
            <h1>To-Do List</h1>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a new todo"
            />
            <button onClick={addTodo}>Add</button>
            <table>
                {todos.map((todo) => (
                    <tr key={todo.id}>
                        <td>
                            <span
                                style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
                            >
                                {todo.title}
                            </span>
                        </td>
                        <td>
                            <button
                                onClick={() => toggleCompleted(todo.id)}
                                style={{
                                    backgroundColor: todo.completed ? 'green' : '#ddd2d2', // Green for incomplete, red for complete
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '5px 10px',
                                    cursor: 'pointer',
                                }}
                            >
                                {todo.completed ? 'Completed' : 'Complete'}
                            </button>
                        </td>
                        <td>
                            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                        </td>
                        
                    </tr>
                ))}
            </table>
        </div>
    );
};

export default TodoList;