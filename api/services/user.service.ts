import { User, UserModel } from "../mocks/models";
import bcrypt from "bcrypt"

import * as jwt from "jsonwebtoken"
import sgMail from '@sendgrid/mail';
import { Request } from "express";


import dotenv from "dotenv";

import UploadFile from "./uploadFile.service";

dotenv.config();


export default class UserService {
    public async findAll(page:number,skip:number){
        try {
            let offset:number=page*skip;
            let data=await UserModel.find({}).limit(skip).skip(offset);
            return {
                users:data,
                count:(await UserModel.find({})).length
            };
        } catch (error:any) {
            return error.message;
        }
    }
    
    public async findOne(id:any){
        try {
            return await UserModel.findById(id);
        } catch (error:any) {
            return error.message;
        }
    }
    
    
    public async create(client:any){
        client.CreatedAt=Date.now();
        const salt=bcrypt.genSaltSync(10);
        client.Password=bcrypt.hashSync(client.Password,salt);
        try {
            const user=await UserModel.create(client);
            sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
            const msg = {
            to: client.Email,
            from: process.env.EMAIL??'teidaremi0@gmail.com',
            subject: 'Register',
            text: 'Welcome',
            html: `<strong>Your account is added successfully. <a href=${client.Email}> Welcome ${client.Username}</a> Thank you for choosing us for a good history of your applications</strong>`,
            }
            try {
                const res= await sgMail.send(msg);
                return user;
            } catch (error) {
                console.log(error);
            }
        } catch (error:any) {
            return error.message;
        }
    }
    
    public async update(id:any,client:any){
        client._id=id;
        client.UpdatedAt=Date.now();
        try {
            const user=await UserModel.findById(id);
            return await UserModel.updateOne({_id:client._id},client);
        } catch (error:any) {
            return error.message;
        }
    }
    
     public async remove(id:any){
        try {
            const user=await UserModel.findById(id);
            try {
                const res= await new UploadFile().deleteFile(user?.ProfileId as string);
                return await UserModel.deleteOne({_id:id});
            } catch (error:any) {
                return error.message;
            }
        } catch (error:any) {
            return error.message;
        }
    }
    
    public async getClient(username:string):Promise<User>{
        try {
            return (((await UserModel.findOne({Email:username}))||(await UserModel.findOne({Username:username}))) as User);
        } catch (error:any) {
            return error.message;
        }
    }
    
    public async login(req:Request){
        const credentiel=req.body;
        if(credentiel!=null){
            const user:User=await (this.getClient(credentiel.Username));
            user.Profile=`${req.protocol}//${req.headers.host}/profile/${user.ProfileId}`;
            if (user) {
                const hashpw=user.Password;
                const islog=bcrypt.compareSync(credentiel.Password,(hashpw as string));
                if (islog) {
                    const token= jwt.sign({_id:user._id,profileId:user.ProfileId,profile:user.Profile,role:user.Role,username:user.Username,firstname:user?.Firstname,email:user?.Email},process.env.SECRET_KEY!,{
                        algorithm:"HS256",
                        expiresIn:"10m"
                    });
                    const refresh=jwt.sign({_id:user._id,profileId:user.ProfileId,profile:user.Profile,role:user.Role,username:user.Username,firstname:user?.Firstname,email:user?.Email},process.env.SECRET_KEY!,{
                        algorithm:"HS256",
                        expiresIn:'1h'
                    });
                    return {
                        token,
                        refresh
                    };
                }
                return undefined;
            }
            return undefined;
        }
        return undefined;
    }
    
    public async refresh_token(req:Request){
        const refresh_t=req.body.refresh;
        console.log(refresh_t);
        const user = JSON.parse(atob(refresh_t.split('.')[1]));
        
        const token= jwt.sign({_id:user._id,role:user.role,username:user.username,profile:user.profile,firstname:user?.firstname,email:user?.email},process.env.SECRET_KEY!,{
            algorithm:"HS256",
            expiresIn:"10m"
        });
        return {
            token
        };
    }
}