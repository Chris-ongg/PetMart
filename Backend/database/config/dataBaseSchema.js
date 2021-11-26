const mongoose_ = require('./database')
const mongoose = require('mongoose');


const customerAccHandler = require('../customerAccHandler')

const customerAccountSchema = new mongoose.Schema({
    name: {type: String , required: true},
    emailAdd: {type: String , required: true},
    password: {type: String},
    registered: {type: Boolean},
    accessToken: {type: String},
    tokenExpiry: {type: Number}
})

const customerAcc = mongoose.model('customerAcc' , customerAccountSchema , 'customerAcc')

const customerPetRecords = new mongoose.Schema({
    name: {type: String , required: true},
    gender: {type: String ,  required: true},
    species: {type: String, required: true},
    petBreed: {type: String, required: true},
    age: {type: String , required: true},
    weight: {type: String , required: true},
    healthConcern: {type: String, required: true},
    ownerEmail: {type: String , required: true}
})

const customerPets = mongoose.model('customerPets' , customerPetRecords , 'customerPets')

const products = new mongoose.Schema({
    itemID: {type: Number , required: true},
    name: {type: String , required: true},
    healthConcern: {type: String , required: true},
    species: {type: String , required: true},
    price: {type: Number, required: true},
    stock: {type: Number , required: true},
    imagePath: {type: String, required: true}
})

const warehouse = mongoose.model('warehouse' , products , 'warehouse')

const cartItems = new mongoose.Schema({
    itemID: {type: Number , required: true},
    name: {type: String , required: true},
    price: {type: Number , required: true},
    quantity: {type: Number, required: true},
    imagePath: {type: String , required: true}
})

const shoppingCart = mongoose.model('shoppingCart' , cartItems , 'shoppingCart')

const custActivity = new mongoose.Schema({
    email: {type: String , required: true},
    emptyCart: {type: Boolean, required: true},
    cartItems: {type: [cartItems] , default: undefined}
})

const customerActivity = mongoose.model('customerActivity' , custActivity , 'customerActivity')

//Insert a dummy customer into deluxeRoom during first start up
//const deluxeRoom_test = new waitList_handler(deluxeRoom);
//module.exports = {Customer_: customer , DeluxeRoom_: deluxeRoom , PremierRoom_: premierRoom};

module.exports = {custAcc : customerAcc , custPet: customerPets ,
    warehouse: warehouse , customerActivity: customerActivity, shoppingCart: shoppingCart}