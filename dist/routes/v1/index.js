import { Router } from 'express';
import farmerRouter from './farmer/farmer.routes.js';
import captchaRouter from './captcha/index.js';
import labRouter from './lab/lab.route.js';
const v1Router = Router();
v1Router.use('/farmer', farmerRouter);
v1Router.use('/captcha', captchaRouter);
v1Router.use('/lab', labRouter);
export default v1Router;
//# sourceMappingURL=index.js.map