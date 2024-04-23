import { Router } from "express";
import * as ApplicationController from "../controllers/application.controller"
import Authorize from "./middlewares/auth.middleware";


const applicationRouter=Router();

applicationRouter.get("/",Authorize,ApplicationController.findAll);
applicationRouter.get("/:id",ApplicationController.findOne);
applicationRouter.post("/",Authorize,ApplicationController.create);
applicationRouter.put("/:id",Authorize,ApplicationController.update);
applicationRouter.delete("/:id",Authorize,ApplicationController.remove);


export default applicationRouter;