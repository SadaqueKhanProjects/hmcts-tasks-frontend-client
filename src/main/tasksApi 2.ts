import axios from 'axios';

const BASE_URL = process.env.BACKEND_URL || 'http://localhost:4000';

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export class TasksApi {
    async getAll() {
        const { data } = await axios.get(`${BASE_URL}/tasks`);
        return data;
    }

    async create(payload: {
        title: string;
        description?: string | null;
        status: TaskStatus;
        dueDate?: string | null; // ISO string or null
        caseNumber: string;
    }) {
        const { data } = await axios.post(`${BASE_URL}/tasks`, payload, {
            headers: { 'Content-Type': 'application/json' },
        });
        return data;
    }
}