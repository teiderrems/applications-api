import { Router } from "express";
import ApplicationController from "../controllers/application.controller"
import Authorize from "./middlewares/auth.middleware";


const applicationRouter=Router();

applicationRouter.get("/",Authorize,new ApplicationController().findAll);
applicationRouter.get("/:id",new ApplicationController().findOne);
applicationRouter.post("/",Authorize,new ApplicationController().create);
applicationRouter.put("/:id",Authorize,new ApplicationController().update);
applicationRouter.delete("/:id",Authorize,new ApplicationController().remove);


export default applicationRouter;