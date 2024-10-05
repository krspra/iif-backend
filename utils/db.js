const {connect} =require('mongoose');

const connectDB= async()=>{
    try {
        await connect(process.env.MONGO_URI);
        console.log('Connected to MONGODB');    
    } catch (error) {
        console.log('Unable to connect MONGODB','and error is',error);
    }
}
module.exports=connectDB;