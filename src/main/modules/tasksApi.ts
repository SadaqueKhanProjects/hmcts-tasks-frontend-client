import axios from 'axios';
import { config } from './config';

export type Status = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface Task {
    id: number;
    caseNumber: string;
    title: string;
    description?: string | null;
    status: Status;
    createdDate: string;
    dueDate?: string | null;
}

export interface CreateTaskBody {
    title: string;
    description?: string | null;
    status: Status;
    dueDate?: string | null;      // ISO string e.g. 2025-08-20T10:00:00
    caseNumber: string;
}

const http = axios.create({
    baseURL: config.backendUrl,
    timeout: 8000,
});

export async function listTasks(): Promise<Task[]> {
    const { data } = await http.get<Task[]>('/tasks');
    return data;
}

export async function getTask(id: number): Promise<Task> {
    const { data } = await http.get<Task>(`/tasks/${id}`);
    return data;
}

export async function createTask(body: CreateTaskBody): Promise<Task> {
    const { data } = await http.post<Task>('/tasks', body);
    return data;
}

export async function patchStatus(id: number, status: Status): Promise<Task> {
    const { data } = await http.patch<Task>(`/tasks/${id}/status`, { status });
    return data;
}

export async function deleteTask(id: number): Promise<void> {
    await http.delete(`/tasks/${id}`);
}