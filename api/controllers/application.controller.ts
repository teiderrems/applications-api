import {Request,Response} from "express"

import ApplicationService from "../services/application.service"
import { isValidObjectId } from "mongoose";
import { ApplicationModel } from "../mocks/models";
import * as XLSX from 'xlsx';


export default class ApplicationController{

    public async findAll(req:any,res:Response){
     
        try {
            const {page,limit,status}=req.query;
            let pageIn=parseInt(page)?parseInt(page):0;
            let skipIn=parseInt(limit)?parseInt(limit):10;
            const data=await new ApplicationService().findAll(req.user._id,pageIn,skipIn,status);
            return res.status(200).json(data);
            
        } catch (error:any) {
            return res.status(404).json({message:error.message} );
        }
    }
    
    public async findOne(req:Request,res:Response){
        if (req.params){
            if (!isValidObjectId(req.params.id)) {
                return res.status(502).json({message:'id must be ObjectId'});
            }
            try {
                return res.status(200).json(await new ApplicationService().findOne(req.params.id));
    
            } catch (error:any) {
                return res.status(404).json({message:error.message});  
    
            }
        }
        return res.status(404).json({message:"Parameter is required"});
    }
    
    
    public async create(req:any,res:Response){
        if (req.body && req.user){
            req.body.Owner=req.user._id;
            try {
                res.status(201).json(await new ApplicationService().create(req.body));
                return;
    
            } catch (error:any) {
                res.status(404).json({message:error.message});
                return;
            }
        }
        return res.status(404).json({message:"NotFound"});
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
                res.status(404).json({message:error.message});
                return;
            }
        }
        return res.status(404).json({message:"NotFound"});
    }
    
    public async remove(req:any,res:Response){
        
        const {user}=req;
        const {id}=req.params;
        if (!isValidObjectId(id)) {
            return res.status(502).json({message:'id must be ObjectId'});
        }
        let app;
        app= await ApplicationModel.findOne({Owner:user?._id,_id:id});
        if (app){
            try {
                return res.status(204).json(await new ApplicationService().remove(id));

            } catch (error:any) {
                return res.status(404).json({message:error.message});
            }
        }
        else
            return res.status(401).json({message:"Unauthorize"});
    }

    public async removeMany(req:any,res:Response){
        const {user}=req;
        const {applications}=req.body;
        let app;
        app= await ApplicationModel.findOne({Owner:user?._id,_id:applications[0]});
        if (app){
            try {
                return res.status(204).json(await new ApplicationService().removeMany(applications));

            } catch (error:any) {
                return res.status(404).json({message:error.message});
            }
        }
        else
            return res.status(401).json({message:"Unauthorize"});
    }

    public async downloadLink(req:Request,res:Response){
        
        const {type,id}=req.body;
        try {
            // Convertir l'objet JavaScript en une feuille de calcul
            const data=await new ApplicationService().downloadFile(id as string,type)
            // const worksheet = XLSX.utils.json_to_sheet(data);
            //
            // // Créer un nouveau classeur et y ajouter la feuille de calcul
            // const workbook = XLSX.utils.book_new();
            // XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
            //
            // // Écrire le classeur dans un fichier Excel
            // const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            // const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
            return res.status(200).json(data);
        } catch (error) {
            console.log(error);
            return res.status(404).json(error);
        }
    }
}