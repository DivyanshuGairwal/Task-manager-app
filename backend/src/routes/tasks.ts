import { Router, Request, Response } from 'express';

const router = Router();

// In-memory task storage
interface Task {
  id: string;
  title: string;
  status: 'PENDING' | 'COMPLETED';
  dueDate: Date | null;
  projectId: string;
  createdAt: Date;
}
export const tasks: Task[] = [];

// Create a new task
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { title, projectId, dueDate } = req.body;
  
  const newTask: Task = {
    id: Math.random().toString(36).substr(2, 9),
    title,
    status: 'PENDING',
    projectId,
    dueDate: dueDate ? new Date(dueDate) : null,
    createdAt: new Date(),
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Update a task
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, status, dueDate } = req.body;

  const task = tasks.find(t => t.id === id);
  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  if (title !== undefined) task.title = title;
  if (status !== undefined) task.status = status;
  if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;

  res.json(task);
});

// Delete a task
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const index = tasks.findIndex(t => t.id === id);
  
  if (index === -1) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  tasks.splice(index, 1);
  res.status(204).send();
});

export default router;
