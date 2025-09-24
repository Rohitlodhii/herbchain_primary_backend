import express from 'express';
import apiRouter from './routes/index.js';
const app = express();
app.use(express.json());
app.use('/', apiRouter);
app.listen(3000);
//# sourceMappingURL=index.js.map