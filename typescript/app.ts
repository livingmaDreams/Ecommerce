import express from 'express';
const app = express();

import bp from 'body-parser';
app.use(bp.json());

import todoRouter from './routes/todo';
app.use(todoRouter);




app.listen(3000);