//Back-end API Restful
// vamos usar fastify que e mais perfomatico que o express
// Utilizaremos os metodos Http normally
// get, post, put, patch, delete
// Pelo navegador so conseguimos fazer operacoes com o Get
// Com o Post, Put, Patch e Delete nao e possivel fazer operacoes pelo navegador

import Fastify from 'fastify';
import cors from '@fastify/cors';
import { appRoutes } from './routes';

const app = Fastify();

app.register(cors);
app.register(appRoutes)

app.listen({
    port: 3333,
    host: '0.0.0.0'

}).then(()=>{console.log('Http Server is running')})

