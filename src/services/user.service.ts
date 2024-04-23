import { UserModel } from "../mocks/models";
import bcrypt from "bcrypt"

import * as jwt from "jsonwebtoken"

import dotenv from "dotenv";

dotenv.config();

interface Client{
    _id:String
    username:String;
    email:String
    firstname:String
    password:String
};

const findAll=async()=>{
    try {
        return await UserModel.find({});
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
    const salt=bcrypt.genSaltSync(10);
    client.password=bcrypt.hashSync(client.password,salt);
    try {
        return await UserModel.create(client)??{};
    } catch (error:any) {
        return error.message;
    }
}

const update=async(id:any,client:any)=>{
    client.id=id;
    try {
        return await UserModel.findOneAndUpdate(client);
    } catch (error:any) {
        return error.message;
    }
}

const remove=async(id:any)=>{
    try {
        return await UserModel.findByIdAndDelete(id);
    } catch (error:any) {
        return error.message;
    }
}

const getClient=async(username:string)=>{
    try {
        return (((await UserModel.findOne({email:username}))||(await UserModel.findOne({username:username}))) as Client);
    } catch (error:any) {
        return error.message;
    }
}

const login=async(credentiel:any)=>{
    
    if(credentiel!=null){
        const user:any=await (getClient(credentiel.username));
        if (user) {
            
            const hashpw=user.password;
            const islog=bcrypt.compareSync(credentiel.password,(hashpw as string));
            if (islog) {
                
                const token= jwt.sign({_id:user._id,role:user.role,username:user.username,firstname:user?.firstname,email:user?.email},process.env.SECRET_KEY!,{
                    algorithm:"HS256",
                    expiresIn:"10m"
                });
                return token;
            }
            return undefined;
        }
        return undefined;
    }
    return undefined;
}


export {findAll,findOne,create,update,remove,login}