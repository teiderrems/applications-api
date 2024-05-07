import { Request, Response } from "express"

import UserService from "../services/user.service"
import { isValidObjectId } from "mongoose";



export default class UserController{

    userService:UserService=new UserService();

    findAll = async (req: any, res: Response) => {
        if (req.user && req.user.role=='admin'){
            try {
                const {page,limit}=req.query;
                let pageIn=parseInt(page)?parseInt(page):0;
                let skipIn=parseInt(limit)?parseInt(limit):10;
                const data=await this.userService.findAll(pageIn,skipIn);
                const val=pageIn*(skipIn);
                return res.status(200).json({
                    data:data,
                    next:((data.count) && (data.count>skipIn))?`https://${req.headers.host}/api/applications?page=${(val<data.count)?(pageIn++):pageIn}&limit=${limit}`:null,
                    prev:((data.count) && (data.count>skipIn))?`https://${req.headers.host}/api/applications?page=${(pageIn--)>0?(pageIn--):pageIn}&limit=${limit}`:null
                });
            } catch (error: any) {
    
                return res.status(404).json({"message":error.message});
            }
        }
        return res.status(401).json({message:"UnAuthorize"});
    }
    
    findOne = async (req: any, res: Response) => {
        if(req.user){
            const id:String=req.user._id;
            try {
                return res.status(200).json({user:await this.userService.findOne(req.params.id)});
    
            } catch (error: any) {
                return res.status(404).json({"message":error.message});
            }
        }
        return res.status(401)
        
    }
    
    
    create = async (req: Request, res: Response) => {
        
        if(req.body.Username){
            try {
                return res.status(201).json(await this.userService.create(req.body));
    
            } catch (error: any) {
                return res.status(404).json({"message":error.message});
            }
        }
        else
            return res.status(404).json({"message":"NotFound"});
    }
    
    update = async (req: Request, res: Response) => {
    
        if(req.body && req.params){
            if (!isValidObjectId(req.params.id)) {
                res.status(502).json({message:'id must be ObjectId'});
                return;
            }
            try {
                return res.status(201).json(await this.userService.update(req.params.id, req.body));
            } catch (error: any) {
                return res.status(404).json({"message":error.message});
            }
        }
        else
            return res.status(404).json({"message":"NotFound"});
    }
    
    remove = async (req: Request, res: Response) => {
    
        if (req.params){
            if (!isValidObjectId(req.params.id)) {
                res.status(502).json({message:'id must be ObjectId'});
                return;
            }
            try {
                return res.status(204).json(await this.userService.remove(req.params.id));
            } catch (error: any) {
                return res.status(404).json({"message":error.message});
            }
        }
        else
            return res.status(404).json({"message":"NotFound"});
    }
    
    login = async (req: Request, res: Response) => {
        if (req.body){
            const data = await this.userService.login(req.body);
            if (data) {
                try {
                    return res.status(201).json(data);
    
                } catch (error:any) {
                    return res.status(404).json({"message":error.message});
    
                }
            }
            try {
                return res.status(401).json({ "message": 'Unauthorize' });
            } catch (error:any) {
                return res.status(404).json({"message":error.message});
    
            }
        }
        else
            return res.status(404).json({"message":"NotFound"});
    }
    
    refresh_token=async(req:Request,res:Response)=>{
        if (req.body) {
            try {
                return res.status(201).json(this.userService.refresh_token(req.body.refresh));
    
            } catch (error:any) {
                return res.status(404).json({"message":error.message});
    
            }
        }
        return res.status(401).json({ "message": 'Unauthorize' });
    }
}