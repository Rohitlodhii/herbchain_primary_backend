import { Router } from 'express';
import { authMiddleware } from '../../../../middlewares/auth.js';
import { CropInformation, DocumentInformation, LandInformation, PersonalProfileInformation } from './farmer.profile.controller.js';
const farmerProfileRouter = Router();
farmerProfileRouter.use('/profile', authMiddleware, PersonalProfileInformation);
farmerProfileRouter.use('/addlandInfo', authMiddleware, LandInformation);
farmerProfileRouter.use('/addDocs', authMiddleware, DocumentInformation);
farmerProfileRouter.use('/addCrops', authMiddleware, CropInformation);
export default farmerProfileRouter;
//# sourceMappingURL=farmer.profile.route.js.map