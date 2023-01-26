import { PrismaClient } from '@prisma/client';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { appRoutes } from './routes';

const app = Fastify();

app.register(cors, {
    // origin: ['http://localhost:3000'],
});
app.register(appRoutes);

const prisma = new PrismaClient();
const port = 3333;
const host = '0.0.0.0' || 'localhost';

app.get('/', async () => {
    const habits = await prisma.habit.findMany();

    return habits;
});

app.listen({
    port,
    host,
}).then(() => {
    console.log(`HTTP Server running on port ${port} 🔥`);
});