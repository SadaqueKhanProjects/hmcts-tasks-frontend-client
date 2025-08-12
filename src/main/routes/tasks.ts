import { Application, Request, Response } from 'express';
import { TasksApi, TaskStatus } from '../tasksApi';

const STATUSES: TaskStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];

export default function (app: Application): void {
    const api = new TasksApi();

    // LIST
    app.get('/tasks', async (_req: Request, res: Response) => {
        try {
            const tasks = await api.getAll();
            res.render('tasks.njk', { title: 'Tasks', tasks });
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            res.status(500).render('error.njk', { message: 'Unable to load tasks' });
        }
    });

    // NEW (form)
    app.get('/tasks/new', (_req: Request, res: Response) => {
        res.render('task-new.njk', {
            title: 'Create a task',
            statuses: STATUSES,
            form: { title: '', description: '', status: 'PENDING', dueDate: '', caseNumber: '' },
            errors: {},
        });
    });

    // CREATE (submit)
    app.post('/tasks', async (req: Request, res: Response) => {
        const { title, description, status, dueDate, caseNumber } = req.body || {};
        const errors: Record<string, string> = {};

        if (!title?.trim()) errors.title = 'Enter a title';
        if (!caseNumber?.trim()) errors.caseNumber = 'Enter a case number';
        if (!STATUSES.includes(status)) errors.status = 'Choose a valid status';

        if (Object.keys(errors).length) {
            return res.status(400).render('task-new.njk', {
                title: 'Create a task',
                statuses: STATUSES,
                form: { title, description, status, dueDate, caseNumber },
                errors,
            });
        }

        try {
            const isoDue = dueDate ? new Date(dueDate).toISOString() : null;

            await api.create({
                title: title.trim(),
                description: description?.trim() || null,
                status,
                dueDate: isoDue,
                caseNumber: caseNumber.trim(),
            });

            res.redirect('/tasks');
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            res.status(500).render('task-new.njk', {
                title: 'Create a task',
                statuses: STATUSES,
                form: { title, description, status, dueDate, caseNumber },
                errors: { global: 'Something went wrong creating the task. Try again.' },
            });
        }
    });
}