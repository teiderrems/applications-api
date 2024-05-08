import { writeFile } from "fs/promises";
import path from "path";
import { v4 } from 'uuid';
import { Request } from 'express';
import { rm,existsSync } from "fs";

export default class UploadFile{
    public async getPath(file:Express.Multer.File|undefined):Promise<string>{
        const endPath=`profiles/${v4()+'_'+file?.originalname}`;
        const filePath=path.resolve('.','public',endPath);
        await writeFile(filePath,Buffer.from(file?.buffer!));
        return endPath;
    }


    public getProfileUrl(req:Request,profileUrl:string):string{
        return `${req.protocol}://${req.headers.host}/${profileUrl}`;
    }

    public removeProfile(profileUrl:string):boolean{
        const filePath=path.resolve('.','public',profileUrl);
        if (existsSync(filePath)) { 
            rm(filePath,(err)=>{
                if (err) {
                    console.log(err);
                    return false
                }
                return true;
            });
        }
        return false
    }
}