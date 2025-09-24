import { Router } from 'express'
import farmerAuthRouter from './auth/farmer.auth.route.js';
import farmerProfileRouter from './profile/farmer.profile.route.js';

const farmerRouter =  Router()


farmerRouter.use('/auth' , farmerAuthRouter)
farmerRouter.use('/profile' , farmerProfileRouter)

export default farmerRouter;