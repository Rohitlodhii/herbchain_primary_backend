// routes/lab.route.ts
import { Router } from "express";
import { registerLab } from "./lab.controller.js";
const labRouter = Router();
// Register a lab (with auto-created Admin user)
labRouter.post("/register", registerLab);
export default labRouter;
//# sourceMappingURL=lab.route.js.map