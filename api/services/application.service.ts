import { ApplicationModel } from "../mocks/models";

export default class ApplicationService{

    public async findAll(user:String,page:number,skip:number,status='all'){
        try {
            let offset:number=page*skip;
            
            let data=status==='all'?await ApplicationModel.find({Owner:user}).limit(skip).skip(offset):await ApplicationModel.find({Owner:user,Status:status}).limit(skip).skip(offset);
            return {
                applications:data,
                count:(await ApplicationModel.find({Owner:user})).length
            };
        } catch (error:any) {
            return error.message;
        }
    }
    
    public async findOne(id:any){
        try {
            return await ApplicationModel.findById(id);
        } catch (error:any) {
            return error.message;
        }
    }
    
    
    public async create(application:any){
        application.CreatedAt=Date.now();
        try {
            return await ApplicationModel.create(application);
        } catch (error:any) {
            return error.message;
        }
    }
    
    public async update(id:any,application:any){
        application._id=id;
        application.UpdatedAt=Date.now();
        try {
            const res= await ApplicationModel.updateOne({_id:application._id},application);
            return res;
        } catch (error:any) {
            return error.message;
        }
    }
    
    public async remove(id:any){
        try {
            return await ApplicationModel.findByIdAndDelete(id);
        } catch (error:any) {
            return error.message;
        }
    }

    public  async removeMany(array:[string]):Promise<any> {
        try {
            return array.map(async(i)=>await this.remove(i));
        }
        catch (e:any){
            return e.message;
        }
    }
}