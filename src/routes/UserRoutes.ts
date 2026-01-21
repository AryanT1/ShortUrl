import { Router } from "express";
export const userRoute = Router()

import { GeneralAuth } from "../middleware/GeneralAut.js";
import { login, me, signup } from "../controllers/user.controller.js";


userRoute.post("/signup",signup)


  
userRoute.post("/login",login)

  
userRoute.get("/me",GeneralAuth,me)