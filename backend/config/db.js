require('dotenv').config();
const mongoose = require('mongoose');
const ConnectedDb = async ()  => {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Well Mongodb is Working")
    }catch(err){
        console.log("Mongodb is'nt Working now please check")
    }
}   

module.exports = ConnectedDb;