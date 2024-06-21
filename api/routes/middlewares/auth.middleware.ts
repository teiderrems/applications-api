import { NextFunction,Response } from "express";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();

const Authorize=(req:any,res:Response,next:NextFunction)=>{

    const token=req.header('authorization')?.split(" ")[1]??"";
    let decode:any={};
    if (!!token){
        jwt.verify(token,process.env.SECRET_KEY!,function(error: any,decoded: any){
            if (error) {
                res.sendStatus(401);
                res.json({message:error.message});
                return;
            }
            decode={...decode,_id:decoded._id,role:decoded.role};
        });
    }
    else{
        res.status(401).send({message:'Unauthorized'});
        return;
    }

    if (decode) {
        req.user={...req.user,_id:decode._id,role:decode.role};
        return next();
    }
    else{
        res.status(401).send({message:'Unauthorize'});
        return;
    }

}
export default Authorize;
