import { Router } from "express";
import ApplicationController from "../controllers/application.controller"
import Authorize from "./middlewares/auth.middleware";


const applicationRouter=Router();

const applicationController=new ApplicationController();

applicationRouter.get("/",Authorize,applicationController.findAll);
applicationRouter.get("/:id",applicationController.findOne);
applicationRouter.post("/",Authorize,applicationController.create);
applicationRouter.put("/:id",Authorize,applicationController.update);
applicationRouter.delete("/:id",Authorize,applicationController.remove);


export default applicationRouter;