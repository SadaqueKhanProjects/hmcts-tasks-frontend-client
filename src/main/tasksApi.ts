// src/main/tasksApi.ts
import axios from 'axios';

const BASE_URL = process.env.BACKEND_URL || 'http://localhost:4000';

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface Task {
    id: number;
    caseNumber: string;
    title: string;
    description?: string | null;
    status: TaskStatus;
    createdDate: string;
    dueDate?: string | null;
}

export class TasksApi {
    async getAll(): Promise<Task[]> {
        const { data } = await axios.get(`${BASE_URL}/tasks`);
        return data;
    }

    async getById(id: number): Promise<Task> {
        const { data } = await axios.get(`${BASE_URL}/tasks/${id}`);
        return data;
    }

    async create(payload: {
        title: string;
        description?: string | null;
        status: TaskStatus;
        dueDate?: string | null;
        caseNumber: string;
    }): Promise<Task> {
        const { data } = await axios.post(`${BASE_URL}/tasks`, payload, {
            headers: { 'Content-Type': 'application/json' },
        });
        return data;
    }

    async updateStatus(id: number, status: TaskStatus): Promise<Task> {
        const { data } = await axios.patch(
            `${BASE_URL}/tasks/${id}/status`,
            { status },
            { headers: { 'Content-Type': 'application/json' } }
        );
        return data;
    }

    async delete(id: number): Promise<void> {
        await axios.delete(`${BASE_URL}/tasks/${id}`);
    }
}