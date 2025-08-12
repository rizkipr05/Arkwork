import { Router } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const router = Router();

const users = new Map<string, {id: number, email: string, password: string, name: string}>();
let uid = 1;

router.post('/register', (req, res) => {
  const schema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(6) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { name, email, password } = parsed.data;
  if (users.has(email)) return res.status(409).json({ error: 'Email already registered' });
  users.set(email, { id: uid++, email, password, name });
  res.json({ ok: true });
});

router.post('/login', (req, res) => {
  const schema = z.object({ email: z.string().email(), password: z.string().min(6) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { email, password } = parsed.data;
  const u = users.get(email);
  if (!u || u.password != password) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ sub: u.id, email: u.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
  res.json({ token, user: { id: u.id, name: u.name, email: u.email } });
});

export default router;
