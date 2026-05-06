import { Hono } from 'hono';
import { validateCredentials } from './shared/middleware';

const router = new Hono().basePath('/session');

router.post('/login', validateCredentials, async (c) => {});
