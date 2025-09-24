// routes/lab.route.ts

import { Router } from "express";
import { registerLab } from "./lab.controller.js";

const RegisterlabRouter = Router();

// Register a lab (with auto-created Admin user)
RegisterlabRouter.post("/register", registerLab);

export default RegisterlabRouter;
