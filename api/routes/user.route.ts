import { Router } from "express";
import * as UserController from "../controllers/user.controller"
import Authorize from "./middlewares/auth.middleware";


const userRouter=Router();

userRouter.get("/",Authorize,UserController.findAll);
userRouter.get("/:id",Authorize,UserController.findOne);
userRouter.post("/",UserController.create);
userRouter.put("/:id",Authorize,UserController.update);
userRouter.delete("/:id",Authorize,UserController.remove);
userRouter.post("/auth",UserController.login);


export default userRouter;