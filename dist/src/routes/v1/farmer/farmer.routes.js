import { Router } from 'express';
import farmerAuthRouter from './auth/farmer.auth.route.js';
const farmerRouter = Router();
farmerRouter.use('/auth', farmerAuthRouter);
export default farmerRouter;
//# sourceMappingURL=farmer.routes.js.map