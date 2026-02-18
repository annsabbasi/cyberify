import { Request, Response, NextFunction } from 'express';

interface ValidationError {
  field: string;
  message: string;
}

export function validateSubmission(req: Request, res: Response, next: NextFunction): void {
  const { name, email, message } = req.body;
  const errors: ValidationError[] = [];

  // Validate name
  if (!name || typeof name !== 'string') {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
  } else if (name.trim().length > 100) {
    errors.push({ field: 'name', message: 'Name must be less than 100 characters' });
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string') {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!emailRegex.test(email.trim())) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  // Validate message
  if (!message || typeof message !== 'string') {
    errors.push({ field: 'message', message: 'Message is required' });
  } else if (message.trim().length < 10) {
    errors.push({ field: 'message', message: 'Message must be at least 10 characters' });
  } else if (message.trim().length > 1000) {
    errors.push({ field: 'message', message: 'Message must be less than 1000 characters' });
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
}
