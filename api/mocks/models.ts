import { Schema, model } from "mongoose";

enum StatusRole{
    PENDING='pending',
    COMPLETED='completed',
    DENIED='denied'
}

const UserSchema:Schema=new Schema({
    Username:{
        type:String,
        unique:true
    },
    Firstname:{
        type:String
    },
    Email:{
        type:String,
        unique:true
    },
    Lastname:{
        type:String
    },

    Role:{
        type:String,
        default:"user"
    },
    Password:{
        type:String
    },
    CreatedAt:{
        type:Date
    },
    UpdatedAt:{
        type:Date
    }
},{
    versionKey:false
})



const ApplicationSchema:Schema=new Schema({
    Title:{
        type:String
    },
    Description:{
        type:String
    },
    JobDescription:{
        type:String
    },
    Entreprise:{
        type:String
    },
    Adresse:{
        type:String
    },
    Status:{
        type:String,
        default:StatusRole.PENDING
    },
    TypeContrat:{
        type:String
    },
    CreatedAt:{
        type:Date
    },
    UpdatedAt:{
        type:Date
    },
    Owner:{
        type:String
    }
},{versionKey:false});


const ApplicationModel=model('applications',ApplicationSchema);
const UserModel=model('users',UserSchema);
export {ApplicationModel,UserModel};