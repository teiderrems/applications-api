
import path from "path";

import { google } from 'googleapis';


export default class UploadFile{

    public async deleteFile(id:string){
      try {
        const auth = new google.auth.GoogleAuth({
        keyFile: path.resolve('.','modern-mystery-418021-6b28887f09f5.json'),
        scopes: [process.env.AUTH_URL!]
        });
        const res=await fetch(`${process.env.GET_URL}${id}`,{
          method:'DELETE',
          headers:{
            'Authorization':'Bearer '+await auth.getAccessToken()
          }
        });
        return res.ok;
      }
      catch (error:any){
        return error.message;
      }
    }

    public async update(id:string,file?:Express.Multer.File){
      try {
        const auth = new google.auth.GoogleAuth({
        keyFile: path.resolve('.','modern-mystery-418021-6b28887f09f5.json'),
        scopes: [process.env.AUTH_URL!]
        });
        const d=new Blob([Buffer.from(file?.buffer!)]);
        
        const content=new File([d],file?.originalname!,{type:file?.mimetype});

        const res=await fetch(`${process.env.UPLOAD_URL!.split('?')[0]}/${id}?uploadType=media`,{
            method:'PATCH',
            body:content,
            headers:{
                'Content-Type':file?.mimetype!,
                'Content-Length':`${file?.size!}`,
                'Authorization':'Bearer '+await auth.getAccessToken()
            }
        });
        return (await res.json() as any).id;
      } catch (error:any) {
          return error.message;
      }
    }

    public async createFile(file?:Express.Multer.File){
      try {
          const auth = new google.auth.GoogleAuth({
          keyFile: path.resolve('.','modern-mystery-418021-6b28887f09f5.json'),
          scopes: [process.env.AUTH_URL!]
          });
          const d=new Blob([Buffer.from(file?.buffer!)]);
          
          const content=new File([d],file?.originalname!,{type:file?.mimetype});
  
          const res=await fetch(`${process.env.UPLOAD_URL!}uploadType=media`,{
              method:'POST',
              body:content,
              headers:{
                  'Content-Type':file?.mimetype!,
                  'Content-Length':`${file?.size!}`,
                  'Authorization':'Bearer '+await auth.getAccessToken()
              }
          });
          return (await res.json() as any).id;
      } catch (error:any) {
          return error.message;
      }
  }
  
  public getUrlImg(id:string):string{
      return `${process.env.GET_URL}${id}`;
  }

  public async getFile(id:string){
    try {
      const auth = new google.auth.GoogleAuth({
      keyFile: path.resolve('.','modern-mystery-418021-6b28887f09f5.json'),
      scopes: [process.env.AUTH_URL!]
      });
      const res=await fetch(`${process.env.GET_URL}${id}?alt=media`,{
        method:'GET',
        headers:{
          'Authorization':'Bearer '+await auth.getAccessToken()
        }
      });
      return {
        image:Buffer.from(await(await res.blob()).arrayBuffer()),
        minetype:res.headers.get('content-type')
      } 
    }
    catch (error:any){
      return error.message;
    }
  }
}
