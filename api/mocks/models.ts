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
    title:{
        type:String
    },
    description:{
        type:String
    },
    fichePoste:{
        type:String
    },
    entreprise:{
        type:String
    },
    adresse:{
        type:String
    },
    status:{
        type:String,
        default:StatusRole.PENDING
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