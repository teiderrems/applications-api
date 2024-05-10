import { profile } from "console";
import { Schema, model } from "mongoose";

enum StatusRole{
    PENDING='pending',
    COMPLETED='completed',
    DENIED='denied'
}

export interface User{
    _id?:string;
    Username?:string;
    Firstname?:string;
    Email?:string;
    Lastname?:string;
    Role?:string;
    Password?:string;
    Profile?:string;
    ProfileId?:string
    CreatedAt?:Date;
    UpdatedAt?:Date;
}

export interface Application{
    _id?:string;
    Title?:string;
    Description?:string;
    JobDescription?:string;
    Entreprise?:string;
    Adresse?:string;
    Status?:string;
    TypeContrat?:string;
    Owner?:string;
    CreatedAt?:Date;
    UpdatedAt?:Date;
}


const UserSchema:Schema=new Schema({
    Username:{
        type:String
    },
    Firstname:{
        type:String
    },
    Email:{
        type:String
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
    Profile:{
        type:String
    },
    ProfileId:String
},
{
    versionKey:false,
    timestamps:{
        createdAt:'CreatedAt',
        updatedAt:'UpdatedAt'
    }
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
    Owner:{
        type:String
    }
},{versionKey:false,
    timestamps:{
        createdAt:'CreatedAt',
        updatedAt:'UpdatedAt'
    }
});


const ApplicationModel=model('applications',ApplicationSchema);
const UserModel=model('users',UserSchema);
export {ApplicationModel,UserModel};