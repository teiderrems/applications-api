import { Request, Response } from "express"

import UserService from "../services/user.service"
import { isValidObjectId } from "mongoose";
import { User } from "../mocks/models";
import UploadFile from "../services/uploadFile.service";

export default class UserController{

    public async findAll(req: any, res: Response){
        const { user }=req;
        if (user && (user.role==='instructor' || user.role==='admin')){
            try {
                const {page,limit,role}=req.query;
                let pageIn=parseInt(page)?parseInt(page):0;
                let skipIn=parseInt(limit)?parseInt(limit):10;
                const data:{
                    users:User[],
                    count:number
                }=await new UserService().findAll(pageIn,skipIn,user.role==='instructor'?'student':role);
                const val=pageIn*(skipIn);

                return res.status(200).json({
                    data:data,
                    next:((data.count) && (data.count>skipIn))?`${req.protocol}/${req.headers.host}/api/applications?page=${(val<data.count)?(pageIn++):pageIn}&limit=${limit}`:null,
                    prev:((data.count) && (data.count>skipIn))?`${req.protocol}/${req.headers.host}/api/applications?page=${(pageIn--)>0?(pageIn--):pageIn}&limit=${limit}`:null
                });
            } catch (error: any) {
    
                return res.status(404).json({message:error.message});
            }
        }
        return res.status(401).json({message:"UnAuthorize"});
    }


    public async findAllUserAndApplication(req: any, res: Response) {
        const {user}=req;
        if (user && (user.role==='instructor' || user.role==='admin')) {
            const {page,limit,owner}=req.query;
            let pageIn=parseInt(page)?parseInt(page):0;
            let skipIn=parseInt(limit)?parseInt(limit):10;
            const data:any=await new UserService().findAllUserAndApplication(pageIn,skipIn,owner);
            const val=pageIn*(skipIn);
            return res.status(200).json({
                data:data,
                next:((data.count) && (data.count>skipIn))?`${req.protocol}//${req.headers.host}/api/applications?page=${(val<data.count)?(pageIn++):pageIn}&limit=${limit}`:null,
                prev:((data.count) && (data.count>skipIn))?`${req.protocol}//${req.headers.host}/api/applications?page=${(pageIn--)>0?(pageIn--):pageIn}&limit=${limit}`:null
            });
        }
        return res.status(401).json({message:"UnAuthorize"});
    }
    
    public async findOne(req: any, res: Response){
        if(req.user && (req.user.role=='admin' || req.user._id==req.params.id)){
            const id:String=req.user._id;
            try {
                const user:User=await new UserService().findOne(req.params.id);
                return res.status(200).json({user});
    
            } catch (error: any) {
                return res.status(404).json({message:error.message});
            }
        }
        return res.status(401)
        
    }
    
    
    public async create(req: any, res: Response){
        if(req.body){
            try {
                const res=await new UploadFile().createFile(req.file);
                if (res) {
                    req.body.ProfileId=res;
                }
            } catch (error) {
                console.log(error);
            }
            try {
                
                return res.status(201).json(await new UserService().create(req.body));
    
            } catch (error: any) {
                return res.status(404).json({message:error.message});
            }
        }
        else{
            return res.status(404).json({message:"NotFound"});
        }
    }
    
    public async update(req: any, res: Response){
    
        if(req.body && req.params && (req.params.id==req.user._id || req.user.role=='admin')){
            if (!isValidObjectId(req.params.id)) {
                res.status(502).json({message:'id must be ObjectId'});
                return;
            }
            if (req.file) {
                try {
                    const res=await new UploadFile().update(req.user.profileId,req.file);
                    if (res) {
                        req.body.ProfileId=res;
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            try {
                return res.status(201).json(await new UserService().update(req.params.id, req.body));
            } catch (error: any) {
                return res.status(404).json({message:error.message});
            }
        }
        else{
            return res.status(404).json({message:"NotFound or you aren't authorize to execute this request"});
        }
    }
    
    public async remove(req: any, res: Response){

        if (req.params && (req.params.id==req.user._id || req.user.role=='admin')){
            if (!isValidObjectId(req.params.id)) {
                res.status(502).json({message:'id must be ObjectId'});
                return;
            }
            try {
                await new UploadFile().deleteFile(req.user.profileId);
            } catch (error) {
                
            }
            try {
                return res.status(204).json(await new UserService().remove(req.params.id));
            } catch (error: any) {
                return res.status(404).json({message:error.message});
            }
        }
        else
            return res.status(401).json({message:"NotFound or you aren't authorize to execute this request"});
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
                return res.status(201).json({token:await new UserService().refresh_token(req)});
            } catch (error:any) {
                return res.status(404).json({message:error.message});
            }
        }
        return res.status(401).json({ message: 'Unauthorize' });
    }

    public verif_email(req:Request,res:Response){
        if (req.query.email) {
            return res.status(200).redirect('https://applications-custom.vercel.app/login');
        }
        return res.status(404).send('email address is required');
    }
}