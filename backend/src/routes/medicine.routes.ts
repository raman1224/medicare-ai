import { Router } from 'express';
const router = Router();

// Simple test route
router.get('/test', (req, res) => {
  res.json({ message: 'Medicine routes working' });
});

export default router;