import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { validateSubmission } from '../middleware/validation.js';

const router = Router();
const prisma = new PrismaClient();

// Check if email has already submitted
router.get('/check/:email', async (req: Request, res: Response) => {
  try {
    const email = decodeURIComponent(req.params.email).toLowerCase().trim();

    const existing = await prisma.submission.findUnique({
      where: { email }
    });

    res.json({ exists: !!existing });
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit form
router.post('/', validateSubmission, async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already exists
    const existing = await prisma.submission.findUnique({
      where: { email: normalizedEmail }
    });

    if (existing) {
      res.status(409).json({
        error: 'You have already submitted this form.'
      });
      return;
    }

    // Create new submission
    const submission = await prisma.submission.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        message: message.trim()
      }
    });

    res.status(201).json({
      success: true,
      id: submission.id
    });
  } catch (error) {
    console.error('Error creating submission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as submissionsRouter };
