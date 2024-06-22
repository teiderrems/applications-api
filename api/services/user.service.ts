import { ApplicationModel, User, UserModel } from "../mocks/models";
import bcrypt from "bcrypt"

import * as jwt from "jsonwebtoken"
import sgMail from '@sendgrid/mail';
import { Request } from "express";


import dotenv from "dotenv";
import { count } from "console";
import ApplicationService from "./application.service";


dotenv.config();


export default class UserService {
    public async findAll(page:number,skip:number,role='all'){
        try {
            let offset:number=page*skip;
            let data=role=='all'?await UserModel.find({}).limit(skip).skip(offset):await UserModel.find({Role:role}).limit(skip).skip(offset);
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
            html: `<strong>Your account is added successfully. <a href=https://applications-custom.vercel.app/login> Confirm your email address</a> Thank you for choosing us for a good history of your applications</strong>`,
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
            return await UserModel.updateOne({_id:client._id},client);
        } catch (error:any) {
            return error.message;
        }
    }
    
     public async remove(id:any){
        try {
            const user=await UserModel.findById(id);
            try {
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
            if (user) {
                const hashpw=user.Password;
                const islog=bcrypt.compareSync(credentiel.Password,(hashpw as string));
                if (islog) {
                    const token= jwt.sign({_id:user._id,profile:user.Profile,profileId:user.ProfileId,role:user.Role,username:user.Username,firstname:user?.Firstname,email:user?.Email},process.env.SECRET_KEY!,{
                        algorithm:"HS256",
                        expiresIn:"10m"
                    });
                    const refresh=jwt.sign({_id:user._id,profile:user.Profile,profileId:user.ProfileId,role:user.Role,username:user.Username,firstname:user?.Firstname,email:user?.Email},process.env.SECRET_KEY!,{
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
        const user = JSON.parse(atob(refresh_t.split('.')[1]));
        const token= jwt.sign({_id:user._id,role:user.role,profileId:user.profileId,username:user.username,profile:user.profile,firstname:user?.firstname,email:user?.email},process.env.SECRET_KEY!,{
            algorithm:"HS256",
            expiresIn:"10m"
        });
        return token;
    }

    public async findAllUserAndApplication(page:number,skip:number,user:string){
        return await new ApplicationService().findAll(user,page,skip);
    }

    public async resetPassword(email:string,password:string){
        try {
            const result=await UserModel.findOneAndUpdate({Email:email},{Password:password});
            sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
            const msg = {
                to: email,
                from: process.env.EMAIL??'teidaremi0@gmail.com',
                subject: 'Update Password',
                text: 'Greeting',
                html: `<strong> <a href=https://applications-custom.vercel.app/login>Your password account has been updated successfully.Click here for continue </a> </strong>`,
            }
            const res= await sgMail.send(msg);
            return result;
        }
        catch (e:any) {
            return e.message;
        }
    }

    public async confirmEmail(email:string){
        try {
            sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
            const msg = {
                to: email,
                from: process.env.EMAIL??'teidaremi0@gmail.com',
                subject: 'Reset Password',
                text: 'Welcome',
                html: `<strong><a href=https://applications-custom.vercel.app/reset-password> Please click. Here  for reset your password</a></strong>`,
            }
            const res= await sgMail.send(msg);
            return res;
        }
        catch (e:any) {
            return e.message;
        }
    }
}