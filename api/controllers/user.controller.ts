import { Request, Response } from "express"

import * as UserService from "../services/user.service"
import { isValidObjectId } from "mongoose";

const findAll = async (req: any, res: Response) => {
    if (req.user && req.user.role=='admin'){
        try {
            return res.status(200).json(await UserService.findAll());
        } catch (error: any) {

            return res.status(404).json({"message":error.message});
        }
    }
    return res.status(401).json({message:"UnAuthorize"});
}

const findOne = async (req: any, res: Response) => {
    if(req.user){
        const id:String=req.user._id;
        try {
            return res.status(200).json({user:await UserService.findOne(req.params.id)});

        } catch (error: any) {
            return res.status(404).json({"message":error.message});
        }
    }
    return res.status(401)
    
}


const create = async (req: Request, res: Response) => {
    if(req.body.Username){
        try {
            return res.status(201).json(await UserService.create(req.body));

        } catch (error: any) {
            return res.status(404).json({"message":error.message});
        }
    }
    else
        return res.status(404).json({"message":"NotFound"});
}

const update = async (req: Request, res: Response) => {

    if(req.body && req.params){
        if (!isValidObjectId(req.params.id)) {
            res.status(502).json({message:'id must be ObjectId'});
            return;
        }
        try {
            return res.status(201).json(await UserService.update(req.params.id, req.body));
        } catch (error: any) {
            return res.status(404).json({"message":error.message});
        }
    }
    else
        return res.status(404).json({"message":"NotFound"});
}

const remove = async (req: Request, res: Response) => {

    if (req.params){
        if (!isValidObjectId(req.params.id)) {
            res.status(502).json({message:'id must be ObjectId'});
            return;
        }
        try {
            return res.status(204).json(await UserService.remove(req.params.id));
        } catch (error: any) {
            return res.status(404).json({"message":error.message});
        }
    }
    else
        return res.status(404).json({"message":"NotFound"});
}

const login = async (req: Request, res: Response) => {
    if (req.body){
        const token = await UserService.login(req.body);
        if (token) {
            try {
                return res.status(201).json({ "token": token });

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

export { findAll, findOne, create, update, remove, login }