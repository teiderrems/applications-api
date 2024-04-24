import { NextFunction,Request,Response } from "express";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const Authorize=(req:any,res:Response,next:NextFunction)=>{

    const token=req.header('authorization')?.split(" ")[1];
    let decode:any=undefined;
    if (token){
        jwt.verify(token,process.env.SECRET_KEY!,function(error: any,decoded: any){
            if (error) {
                res.status(401).json({"message":error.message});
                return;
            }
            decode={...decode,_id:decoded._id,role:decoded.role,username:decoded.username,email:decoded?.email,firstname:decoded?.firstname};
        });
    }
    else{
        res.status(401).send({"message":'Unauthorized'});
        return;
    }

    if (decode) {
        req.user={_id:decode._id,username:decode.username,email:decode?.email,firstname:decode?.firstname};
        next();
        return;
    }
    else{
        res.status(401).send({"message":'Unauthorize'});
        return;
    }

}
export default Authorize;