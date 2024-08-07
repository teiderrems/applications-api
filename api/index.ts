import express, {Express, NextFunction, Request, Response} from "express"
import cors from "cors"
import morgan from "morgan";
import main from "./mocks/db.connection";
import userRouter from "./routes/user.route";
import applicationRouter from "./routes/application.route";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import helmet from 'helmet';
import path from "path";
import dotenv from 'dotenv';
import UploadFile from "./services/uploadFile.service";
import UserController from "./controllers/user.controller";


dotenv.config();

mongoose.Promise = global.Promise
const app:Express=express();
app.use(express.json());

app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
main().then(res=>console.log("connexion réussit")).catch(err=>console.log(err.message));
app.use(express.static(path.join('.', 'public')))

app.use(cors({
    origin:["https://applications-custom.vercel.app","http://localhost:3000",]
})); 
app.use((error: any,req:Request,res:Response,next:NextFunction)=>{
    if(error){
        res.status(500).json({"message":error.message});
    }
    else{
        next();
    }
});
app.use(helmet());


app.use("/api/applications",applicationRouter);
app.use("/api/users",userRouter);
userRouter.post('/api/verif_email',new UserController().verif_email)

app.get('/api/profile/:profile',async(req:Request,res:Response)=>{
    try {
        const file=await new UploadFile().getFile(req.params.profile);
        return res.status(200).json(file);
    } catch (error) {
        return res.status(502).send(error);
    }
})

app.get('/',(req:Request,res:Response)=>{
    res.status(200).send("<h1><i> Welcome</i></h1>");
})
app.listen(5000,()=>{
    console.log("http://localhost:5000");
});

export default app;

