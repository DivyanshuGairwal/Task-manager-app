import { Router, Request, Response } from 'express';
import { tasks } from './tasks';

const router = Router();

// In-memory project storage
interface Project {
  id: string;
  name: string;
  description: string;
  userId: string;
  createdAt: Date;
}
const projects: Project[] = [];

// Get all projects for a user
router.get('/', async (req: Request, res: Response): Promise<void> => {
  const user = (req as any).user;
  const userProjects = projects.filter(p => p.userId === user.id);
  res.json(userProjects);
});

// Create a new project
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { name, description } = req.body;
  const user = (req as any).user;

  const newProject: Project = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    description,
    userId: user.id,
    createdAt: new Date(),
  };

  projects.push(newProject);
  res.status(201).json(newProject);
});

// Get a single project with its tasks
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const project = projects.find(p => p.id === id);

  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  const projectTasks = tasks.filter(t => t.projectId === id);
  res.json({ ...project, tasks: projectTasks });
});

// Update a project
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, description } = req.body;
  
  const project = projects.find(p => p.id === id);
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  project.name = name || project.name;
  project.description = description || project.description;

  res.json(project);
});

// Delete a project
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  projects.splice(index, 1);
  res.status(204).send();
});

export default router;
