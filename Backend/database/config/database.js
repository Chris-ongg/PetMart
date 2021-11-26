const mongoose = require('mongoose');

async function connectDatabase() {

 let mongooseConnect;
 try{
    mongooseConnect = await mongoose.connect('mongodb://localhost:27017/PetMart' , { useNewUrlParser: true });
 } catch (error) {
     //Throw error if initial connection fail
    console.log(error)
    throw error
 }
 return mongooseConnect
}

async function getDataBaseConnection() {
    return await connectDatabase()
}

const connection =  getDataBaseConnection()

module.exports = connection;
