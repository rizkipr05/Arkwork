import { Router } from 'express';
const router = Router();

const tenders = Array.from({length: 10}).map((_,i)=>({
  id: i+1,
  title: `Tender ${i+1} - EPC Pipeline`,
  publishedAt: new Date(Date.now()- i*86400000).toISOString(),
  link: "https://example.com/tender/" + (i+1),
  company: "Hempart Partner Co."
}));

router.get('/', (_req,res)=>{
  res.json({ data: tenders, total: tenders.length });
});

export default router;
