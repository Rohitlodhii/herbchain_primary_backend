import { Router } from 'express'
import { registerFarmer, verifyOTP } from './farmer.auth.controller.js'
// import { registerFarmerProfile } from './farmer.auth.controller.js';

const farmerAuthRouter =  Router()

farmerAuthRouter.post('/register' , registerFarmer )
farmerAuthRouter.post('/verifyotp' , verifyOTP )
farmerAuthRouter.get('/test' , (req ,res )=> {
    res.send("Properly Working")
} )


export default farmerAuthRouter;