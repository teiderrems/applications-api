import { UserModel } from "../mocks/models";
import bcrypt from "bcrypt"

import * as jwt from "jsonwebtoken"
import sgMail from '@sendgrid/mail';


import dotenv from "dotenv";

dotenv.config();

interface Client{
    _id:String
    Username:String;
    Email:String
    Firstname:String
    Password:String
};

const findAll=async(page:number,skip:number)=>{
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

const findOne=async(id:any)=>{
    try {
        return await UserModel.findById(id);
    } catch (error:any) {
        return error.message;
    }
}


const create= async(client:any)=>{
    client.CreatedAt=Date.now();
    const salt=bcrypt.genSaltSync(10);
    client.Password=bcrypt.hashSync(client.Password,salt);
    try {
        const user=await UserModel.create(client);
        sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
        const msg = {
        to: client.Email,
        from: 'teidaremi0@gmail.com',
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

const update=async(id:any,client:any)=>{
    client._id=id;
    client.UpdatedAt=Date.now();

    try {
        return await UserModel.updateOne({_id:client._id},client);
    } catch (error:any) {
        return error.message;
    }
}

const remove=async(id:any)=>{
    try {
        return await UserModel.deleteOne({_id:id});
    } catch (error:any) {
        return error.message;
    }
}

const getClient=async(username:string)=>{
    try {
        return (((await UserModel.findOne({Email:username}))||(await UserModel.findOne({Username:username}))) as Client);
    } catch (error:any) {
        return error.message;
    }
}

const login=async(credentiel:any)=>{
    
    if(credentiel!=null){
        const user:any=await (getClient(credentiel.Username));
        if (user) {
            const hashpw=user.Password;
            const islog=bcrypt.compareSync(credentiel.Password,(hashpw as string));
            if (islog) {
                
                const token= jwt.sign({_id:user._id,role:user.Role,username:user.Username,firstname:user?.Firstname,email:user?.Email},process.env.SECRET_KEY!,{
                    algorithm:"HS256",
                    expiresIn:"10m"
                });
                const refresh=jwt.sign({_id:user._id,role:user.Role,username:user.Username,firstname:user?.Firstname,email:user?.Email},process.env.SECRET_KEY!,{
                    algorithm:"HS256",
                    expiresIn:"1d"
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

const refresh_token=(refresh_t:string)=>{
    const user = JSON.parse(atob(refresh_t.split('.')[1]));
    const token= jwt.sign({_id:user._id,role:user.role,username:user.username,firstname:user?.firstname,email:user?.email},process.env.SECRET_KEY!,{
        algorithm:"HS256",
        expiresIn:"10m"
    });
    const refresh=jwt.sign({_id:user._id,role:user.Role,username:user.Username,firstname:user?.Firstname,email:user?.Email},process.env.SECRET_KEY!,{
        algorithm:"HS256",
        expiresIn:"1d"
    });
    return {
        token,
        refresh
    };
}


export {findAll,findOne,create,update,remove,login,refresh_token}