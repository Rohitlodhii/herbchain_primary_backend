// routes/lab.route.ts

import { Router } from "express";
import { loginLabUser } from "./login.lab.controller.js";


const LoginlabRouter = Router();

// Register a lab (with auto-created Admin user)
LoginlabRouter.post("/", loginLabUser);

export default LoginlabRouter;
