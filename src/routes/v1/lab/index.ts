import { Router } from 'express'
import RegisterlabRouter from './register/lab.route.js';
import LoginlabRouter from './login/login.lab.route.js';


const labRouter =  Router()


labRouter.use('/auth' , RegisterlabRouter)
labRouter.use('/login' , LoginlabRouter)


export default labRouter;