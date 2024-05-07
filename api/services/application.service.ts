import { ApplicationModel } from "../mocks/models";

export default class ApplicationService{

    findAll=async(user:String,page:number,skip:number)=>{
        try {
            let offset:number=page*skip;
            let data=await ApplicationModel.find({Owner:user}).limit(skip).skip(offset);
            return {
                applications:data,
                count:(await ApplicationModel.find({Owner:user})).length
            };
        } catch (error:any) {
            return error.message;
        }
    }
    
    findOne=async(id:any)=>{
        try {
            return await ApplicationModel.findById(id);
        } catch (error:any) {
            return error.message;
        }
    }
    
    
    create= async(application:any)=>{
        application.CreatedAt=Date.now();
        try {
            return await ApplicationModel.create(application);
        } catch (error:any) {
            return error.message;
        }
    }
    
    update=async(id:any,application:any)=>{
        application._id=id;
        application.UpdatedAt=Date.now();
        console.log(application);
        try {
            const res= await ApplicationModel.updateOne({_id:application._id},application);
            return res;
        } catch (error:any) {
            return error.message;
        }
    }
    
    remove=async(id:any)=>{
        try {
            return await ApplicationModel.findByIdAndDelete(id);
        } catch (error:any) {
            return error.message;
        }
    }
}