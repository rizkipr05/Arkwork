import { Router } from 'express';
const router = Router();

router.get('/:userId', (req,res)=>{
  const userId = Number(req.params.userId);
  res.json({
    userId,
    applications: [
      { id: 1, job: 'Process Engineer', status: 'Under Review' },
      { id: 2, job: 'HSE Officer', status: 'Submitted' }
    ],
    stats: { applied: 2, interviews: 0, offers: 0 }
  });
});

export default router;
