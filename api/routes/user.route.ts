import { Router } from "express";
import UserController from "../controllers/user.controller"
import Authorize from "./middlewares/auth.middleware";
import multer from "multer";



const userRouter=Router();


userRouter.get("/",Authorize,new UserController().findAll);
userRouter.get("/:id",Authorize,new UserController().findOne);
userRouter.post("/",multer().single('profile'),new UserController().create);
userRouter.put("/:id",multer().single('profile'),Authorize,new UserController().update);
userRouter.delete("/:id",Authorize,new UserController().remove);
userRouter.post("/auth",new UserController().login);
userRouter.post("/refresh_token",new UserController().refresh_token);



export default userRouter;