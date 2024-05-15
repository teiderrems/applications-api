import {Request,Response} from "express"

import ApplicationService from "../services/application.service"
import { isValidObjectId } from "mongoose";


export default class ApplicationController{

    public async findAll(req:any,res:Response){
     
        try {
            const {page,limit,status}=req.query;
            let pageIn=parseInt(page)?parseInt(page):0;
            let skipIn=parseInt(limit)?parseInt(limit):10;
            const data=await new ApplicationService().findAll(req.user._id,pageIn,skipIn,status);
            const val=pageIn*(skipIn);
            return res.status(200).json({
                data:data,
                next:((data.count) && (data.count>skipIn))?`${req.protocol}//${req.headers.host}/api/applications?page=${(val<data.count)?(pageIn++):pageIn}&limit=${limit}`:null,
                prev:((data.count) && (data.count>skipIn))?`${req.protocol}//${req.headers.host}/api/applications?page=${(pageIn--)>0?(pageIn--):pageIn}&limit=${limit}`:null
            });
            
        } catch (error:any) {
            res.status(404).json({"message":error.message} );
            return;
        }
    }
    
    public async findOne(req:Request,res:Response){
        if (req.params){
            if (!isValidObjectId(req.params.id)) {
                res.status(502).json({message:'id must be ObjectId'});
                return;
            }
            try {
                res.status(200).json(await new ApplicationService().findOne(req.params.id));
                return;
    
            } catch (error:any) {
                res.status(404).json({"message":error.message});
                return;
    
            }
        }
        return res.status(404).json({"message":"Parameter is required"});
    }
    
    
    public async create(req:any,res:Response){
        if (req.body && req.user){
            req.body.Owner=req.user._id;
            try {
                res.status(201).json(await new ApplicationService().create(req.body));
                return;
    
            } catch (error:any) {
                res.status(404).json({"message":error.message});
                return;
            }
        }
        return res.status(404).json({"message":"NotFound"});
    }
    
    public async update(req:Request,res:Response){
        if (req.params && req.body){
            if (!isValidObjectId(req.params.id)) {
                res.status(502).json({message:'id must be ObjectId'});
                return;
            }
            try {
                res.status(201).json(await new ApplicationService().update(req.params.id,req.body));
                return;
    
            } catch (error:any) {
                res.status(404).json({"message":error.message});
                return;
            }
        }
        return res.status(404).json({"message":"NotFound"});
    }
    
    public async remove(req:Request,res:Response){
        if (req.params){
            if (!isValidObjectId(req.params.id)) {
                res.status(502).json({message:'id must be ObjectId'});
                return;
            }
            try {
                res.status(204).json(await new ApplicationService().remove(req.params.id));
                return;
            } catch (error:any) {
                res.status(404).json({"message":error.message});
                return;
            }
        }
        return res.status(404).json({"message":"NotFound"});
    }
}