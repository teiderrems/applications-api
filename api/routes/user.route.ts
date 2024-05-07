import { Router } from "express";
import UserController from "../controllers/user.controller"
import Authorize from "./middlewares/auth.middleware";


const userRouter=Router();

const userController=new UserController();

userRouter.get("/",Authorize,userController.findAll);
userRouter.get("/:id",Authorize,userController.findOne);
userRouter.post("/",userController.create);
userRouter.put("/:id",Authorize,userController.update);
userRouter.delete("/:id",Authorize,userController.remove);
userRouter.post("/auth",userController.login);
userRouter.post("/refresh_token",userController.refresh_token);


export default userRouter;