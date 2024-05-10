import { Request, Response } from "express"

import UserService from "../services/user.service"
import { isValidObjectId } from "mongoose";
import UploadFile from "../services/uploadFile.service";
import { User } from "../mocks/models";

export default class UserController{

    public async findAll(req: any, res: Response){
        if ((req.user) && req.user.role=='admin'){
            try {
                const {page,limit}=req.query;
                let pageIn=parseInt(page)?parseInt(page):0;
                let skipIn=parseInt(limit)?parseInt(limit):10;
                const data:{
                    users:User[],
                    count:number
                }=await new UserService().findAll(pageIn,skipIn);
                const val=pageIn*(skipIn);

                return res.status(200).json({
                    data:data,
                    next:((data.count) && (data.count>skipIn))?`${req.protocol}//${req.headers.host}/api/applications?page=${(val<data.count)?(pageIn++):pageIn}&limit=${limit}`:null,
                    prev:((data.count) && (data.count>skipIn))?`${req.protocol}/${req.headers.host}/api/applications?page=${(pageIn--)>0?(pageIn--):pageIn}&limit=${limit}`:null
                });
            } catch (error: any) {
    
                return res.status(404).json({message:error.message});
            }
        }
        return res.status(401).json({message:"UnAuthorize"});
    }
    
    public async findOne(req: any, res: Response){
        if(req.user && (req.user.role=='admin' || req.user._id==req.params.id)){
            const id:String=req.user._id;
            try {
                const user:User=await new UserService().findOne(req.params.id);
                user.Profile=`${req.protocol}://${req.headers.host}/profile/${user.ProfileId}`;
                return res.status(200).json({user});
    
            } catch (error: any) {
                return res.status(404).json({message:error.message});
            }
        }
        return res.status(401)
        
    }
    
    
    public async create(req: Request, res: Response){
        if(req.body.Username){
            try {
                try {
                    const id=await new UploadFile().createFile(req.file);
                    req.body.ProfileId=id;
                } catch (error:any) {
                    return res.status(404).json({message:error.message});
                }
                return res.status(201).json(await new UserService().create(req.body));
    
            } catch (error: any) {
                return res.status(404).json({message:error.message});
            }
        }
        else
            return res.status(404).json({message:"NotFound"});
    }
    
    public async update(req: any, res: Response){
    
        if(req.body && req.params && (req.params.id==req.user._id || req.user.role=='admin')){
            if (!isValidObjectId(req.params.id)) {
                res.status(502).json({message:'id must be ObjectId'});
                return;
            }
            try {
                const id=await new UploadFile().update(req.body.ProfileId,req.file);
                req.body.ProfileId=id;
                req.body.Profile=null;
                return res.status(201).json(await new UserService().update(req.params.id, req.body));
            } catch (error: any) {
                return res.status(404).json({message:error.message});
            }
        }
        else
            return res.status(404).json({message:"NotFound or you aren't authorize to execute this request"});
    }
    
    public async remove(req: any, res: Response){
    
        if (req.params && req.params.id==req.user._id){
            if (!isValidObjectId(req.params.id)) {
                res.status(502).json({message:'id must be ObjectId'});
                return;
            }
            try {
                return res.status(204).json(await new UserService().remove(req.params.id));
            } catch (error: any) {
                return res.status(404).json({message:error.message});
            }
        }
        else
            return res.status(404).json({message:"NotFound or you aren't authorize to execute this request"});
    }
    
    public async login(req: Request, res: Response){
        if (req.body){
            const data = await new UserService().login(req);
            if (data) {
                try {
                    return res.status(201).json(data);
                } catch (error:any) {
                    return res.status(404).json({message:error.message});
                }
            }
            try {
                return res.status(401).json({ message: 'Unauthorize' });
            } catch (error:any) {
                return res.status(404).json({message:error.message});
    
            }
        }
        else
            return res.status(404).json({message:"NotFound"});
    }
    
    public async refresh_token(req:Request,res:Response){
        if (req.body) {
            try {
                return res.status(201).json(new UserService().refresh_token(req));
    
            } catch (error:any) {
                return res.status(404).json({message:error.message});
    
            }
        }
        return res.status(401).json({ message: 'Unauthorize' });
    }
}