import { Application } from 'express';
import axios from 'axios';

export default function (app: Application): void {
    app.get('/tasks', async (req, res) => {
        try {
            const response = await axios.get('http://localhost:4000/tasks'); // backend API
            res.render('tasks', { tasks: response.data, title: 'Tasks' });
        } catch (error) {
            console.error('Error fetching tasks:', error);
            res.render('tasks', { tasks: [], title: 'Tasks' });
        }
    });
}