import {NextFunction} from "express";

const  ErrorHandle=(error: any,req:Request,res:Response,next:NextFunction)=>{
    console.log(error);
}

export  default  ErrorHandle;