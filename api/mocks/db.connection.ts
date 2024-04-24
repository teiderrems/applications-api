import { connect,connection } from "mongoose";

const main=async()=>{
    await connect("mongodb+srv://teiderrems0:Rems2001@students.7gftavk.mongodb.net/applications",{
        socketTimeoutMS:1000
    });
    connection.on('connected', () => console.log('connected success full'));
}

export default main;