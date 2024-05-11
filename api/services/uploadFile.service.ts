
import path from "path";

import { google } from 'googleapis';


export default class UploadFile{

    public async deleteFile(id:string){
      try {
        const auth = new google.auth.GoogleAuth({
        keyFile: path.join(__dirname,'modern-mystery-418021-7007c22d9a73_cle_google.json'),
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
        keyFile: path.join(__dirname,'modern-mystery-418021-7007c22d9a73_cle_google.json'),
        scopes: [process.env.AUTH_URL!]
        });
        const d=new Blob([Buffer.from(file?.buffer!)]);
        
        const content=new File([d],file?.originalname!,{type:file?.mimetype});

        const res=await fetch(`${process.env.UPLOAD_URL!}/${id}?uploadType=media`,{
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
          keyFile: path.join(__dirname,'modern-mystery-418021-7007c22d9a73_cle_google.json'),
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
      keyFile: path.join(__dirname,'modern-mystery-418021-7007c22d9a73_cle_google.json'),
      scopes: [process.env.AUTH_URL!]
      });
      const res=await fetch(`${process.env.GET_URL}${id}?alt=media`,{
        method:'GET',
        headers:{
          'Authorization':'Bearer '+await auth.getAccessToken()
        }
      });
      // const imgb64=Buffer.from((await res.body?.getReader().read())?.value).toString('base64');
      const file=new File([Buffer.from(await(await res.blob()).arrayBuffer())],`profile.${res.headers.get('content-type')?.split('/')[1]}`);
      const imgb64=(Buffer.from(await file.arrayBuffer())).toString('base64');
 
      return `data:${res.headers.get('content-type')};base64,${imgb64}`;
    }
    catch (error:any){
      return error.message;
    }
  }
}
