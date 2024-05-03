import {Request,Response} from "express"

import * as ApplicationService from "../services/application.service"
import { isValidObjectId } from "mongoose";


const findAll=async(req:any,res:Response)=>{
     
    try {
        const {page,limit}=req.query;
        let pageIn=parseInt(page)?parseInt(page):0;
        let skipIn=parseInt(limit)?parseInt(limit):10;
        const data=await ApplicationService.findAll(req.user._id,pageIn,skipIn);
        const val=pageIn*(skipIn);
        return res.status(200).json({
            data:data,
            next:((data.count) && (data.count>skipIn))?`https://${req.headers.host}/api/applications?page=${(val<data.count)?(pageIn++):pageIn}&limit=${limit}`:null,
            prev:((data.count) && (data.count>skipIn))?`https://${req.headers.host}/api/applications?page=${(pageIn--)>0?(pageIn--):pageIn}&limit=${limit}`:null
        });
        
    } catch (error:any) {
        res.status(404).json({"message":error.message} );
        return;
    }
}

const findOne=async(req:Request,res:Response)=>{
    if (req.params){
        if (!isValidObjectId(req.params.id)) {
            res.status(502).json({message:'id must be ObjectId'});
            return;
        }
        try {
            res.status(200).json(await ApplicationService.findOne(req.params.id));
            return;

        } catch (error:any) {
            res.status(404).json({"message":error.message});
            return;

        }
    }
    return res.status(404).json({"message":"Parameter is required"});
}


const create= async(req:any,res:Response)=>{
    if (req.body && req.user){
        req.body.Owner=req.user._id;
        try {
            res.status(201).json(await ApplicationService.create(req.body));
            return;

        } catch (error:any) {
            res.status(404).json({"message":error.message});
            return;
        }
    }
    return res.status(404).json({"message":"NotFound"});
}

const update=async(req:Request,res:Response)=>{
    if (req.params && req.body){
        if (!isValidObjectId(req.params.id)) {
            res.status(502).json({message:'id must be ObjectId'});
            return;
        }
        try {
            res.status(201).json(await ApplicationService.update(req.params.id,req.body));
            return;

        } catch (error:any) {
            res.status(404).json({"message":error.message});
            return;
        }
    }
    return res.status(404).json({"message":"NotFound"});
}

const remove=async(req:Request,res:Response)=>{
    if (req.params){
        if (!isValidObjectId(req.params.id)) {
            res.status(502).json({message:'id must be ObjectId'});
            return;
        }
        try {
            res.status(204).json(await ApplicationService.remove(req.params.id));
            return;
        } catch (error:any) {
            res.status(404).json({"message":error.message});
            return;
        }
    }
    return res.status(404).json({"message":"NotFound"});
}

export{findAll,findOne,create,update,remove}