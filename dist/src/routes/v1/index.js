import { Router } from 'express';
import farmerRouter from './farmer/farmer.routes.js';
const v1Router = Router();
v1Router.use('/farmer', farmerRouter);
export default v1Router;
//# sourceMappingURL=index.js.map