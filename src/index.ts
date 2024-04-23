import express, {Express, NextFunction, Request, Response} from "express"
import cors from "cors"
import morgan from "morgan";
import main from "./mocks/db.connection";
import userRouter from "./routes/user.route";
import applicationRouter from "./routes/application.route";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import helmet from 'helmet';

mongoose.Promise = global.Promise
const app:Express=express();
app.use(express.json());

app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
main().then(res=>console.log("connexion réussit")).catch(err=>console.log(err.message));

app.use(cors());
app.use((error: any,req:Request,res:Response,next:NextFunction)=>{
    if(error){
        res.status(500).json({"message":error.message});
    }
    else{
        next();
    }
});
app.use(helmet());
app.get('/',(req:Request,res:Response)=>{
    res.status(200).send("<h1>Hello world</h1>");
});

app.use("/api/applications",applicationRouter);
app.use("/api/users",userRouter);

app.listen(5000,()=>{
    console.log("http://localhost:5000");
})

