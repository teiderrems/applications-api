import { ApplicationModel } from "../mocks/models";


const findAll=async(user:String,page:number,skip:number)=>{
    try {
        let offset:number=page*skip;
        return await ApplicationModel.find({Owner:user}).limit(skip).skip(offset);
    } catch (error:any) {
        return error.message;
    }
}

const findOne=async(id:any)=>{
    try {
        return await ApplicationModel.findById(id);
    } catch (error:any) {
        return error.message;
    }
}


const create= async(application:any)=>{
    try {
        return await ApplicationModel.create(application);
    } catch (error:any) {
        return error.message;
    }
}

const update=async(id:any,application:any)=>{
    application.id=id;
    try {
        return await ApplicationModel.findOneAndUpdate(application);
    } catch (error:any) {
        return error.message;
    }
}

const remove=async(id:any)=>{
    try {
        return await ApplicationModel.findByIdAndDelete(id);
    } catch (error:any) {
        return error.message;
    }
}



export {findAll,findOne,create,update,remove}