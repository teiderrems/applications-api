import { NextFunction,Response } from "express";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();

const Authorize=(req:any,res:Response,next:NextFunction)=>{

    const token=req.header('authorization')?.split(" ")[1];
    let decode:any=undefined;
    if (token){
        jwt.verify(token,process.env.SECRET_KEY!,function(error: any,decoded: any){
            if (error) {
                res.statusCode=401;
                return res.json({message:error.message});
                
            }
            decode=decoded;
        });
    }
    else{
        res.statusCode=401;
        return res.send({message:'Unauthorized'});
    }

    if (decode) {
        req.user=decode;
        next();
        return;
    }
    else{
        res.statusCode=401;
        return res.send({message:'Unauthorize'});
    }

}
export default Authorize;