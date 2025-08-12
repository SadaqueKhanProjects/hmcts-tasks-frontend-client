import { Application, Request, Response } from 'express';
import { TasksApi, TaskStatus } from '../tasksApi';

const STATUSES: TaskStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];

export default function (app: Application): void {
    const api = new TasksApi();

    // LIST
    app.get('/tasks', async (_req: Request, res: Response) => {
        try {
            const tasks = await api.getAll();
            res.render('tasks.njk', { title: 'Tasks', tasks, created: _req.query.created, updated: _req.query.updated });
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

            res.redirect('/tasks?created=1');
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

    // EDIT (form) — only status for now
    app.get('/tasks/:id/edit', async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const task = await api.getById(id);
            res.render('task-edit.njk', { title: 'Update task status', task, statuses: STATUSES, errors: {} });
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            res.status(404).render('error.njk', { message: 'Task not found' });
        }
    });

    // EDIT (submit) — only status for now
    app.post('/tasks/:id/edit', async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const { status } = req.body || {};
        const errors: Record<string, string> = {};

        if (!STATUSES.includes(status)) errors.status = 'Choose a valid status';

        if (Object.keys(errors).length) {
            try {
                const task = await api.getById(id);
                return res.status(400).render('task-edit.njk', {
                    title: 'Update task status',
                    task,
                    statuses: STATUSES,
                    errors,
                });
            } catch {
                return res.status(404).render('error.njk', { message: 'Task not found' });
            }
        }

        try {
            await api.updateStatus(id, status);
            res.redirect('/tasks?updated=1');
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            const task = await api.getById(id).catch(() => null);
            res.status(500).render('task-edit.njk', {
                title: 'Update task status',
                task,
                statuses: STATUSES,
                errors: { global: 'Something went wrong updating the status. Try again.' },
            });
        }
    });
}