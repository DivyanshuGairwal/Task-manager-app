import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import prisma from '../prisma';

const router = Router();

router.use(authenticateToken);

// Get all projects for the logged-in user
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { tasks: true }
        }
      }
    });
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new project
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, description } = req.body;
  if (!title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }

  try {
    const project = await prisma.project.create({
      data: {
        title,
        description,
        userId: req.user!.id,
      },
    });
    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a project
router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const { title, description } = req.body;

  try {
    const project = await prisma.project.findFirst({
      where: { id, userId: req.user!.id },
    });

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: { title, description },
    });
    res.json(updatedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a project
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;

  try {
    const project = await prisma.project.findFirst({
      where: { id, userId: req.user!.id },
    });

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    await prisma.project.delete({ where: { id } });
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get tasks for a specific project
router.get('/:projectId/tasks', async (req: AuthRequest, res: Response): Promise<void> => {
  const projectId = req.params.projectId as string;
  const { status } = req.query; // Optional filter

  try {
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: req.user!.id },
    });

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const whereClause: any = { projectId };
    if (status) {
      whereClause.status = status;
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a task for a specific project
router.post('/:projectId/tasks', async (req: AuthRequest, res: Response): Promise<void> => {
  const projectId = req.params.projectId as string;
  const { title, dueDate } = req.body;

  if (!title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }

  try {
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: req.user!.id },
    });

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const task = await prisma.task.create({
      data: {
        title,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
      },
    });
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
