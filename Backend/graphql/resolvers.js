const database_schema = require('../database/config/dataBaseSchema')
const customerAccHandler = require('../database/customerAccHandler')
const customerPetHandler = require('../database/customerPetHandler')
const customerActivityHandler = require('../database/customerActivityHandler')
const warehouseHandler = require("../database/warehouseHandler")

const CryptoJS = require("crypto-js");
const randomUUID = require("crypto")
const {OAuth2Client} = require("google-auth-library")
const client = new OAuth2Client("10043720919-sdvflhtpemgtvn6cs043ims18ut4pk53.apps.googleusercontent.com")

const customerAcc = new customerAccHandler(database_schema.custAcc)
const customerPet = new customerPetHandler(database_schema.custPet)
const warehouse = new warehouseHandler(database_schema.warehouse)
const activity = new customerActivityHandler(database_schema.customerActivity)

let count = 0
//Number of days access token is valid for
const tokenValidity = 7
//const deluxeRoom = new waitList_handler(database_schema.DeluxeRoom_);
//const premierRoom = new waitList_handler(database_schema.PremierRoom_);

const generateAccessToken = () => {
    //Generate a unique access token
    let accessToken = randomUUID.randomUUID()
    //Access token is only valid for X number of days (date is converted/stored as milliseconds)
    //86400000 is equivalent to one day in milliseconds
    let currentDate = new Date()
    let tokenExpiry = new Date(currentDate.getTime() + (86400000 * tokenValidity))
    return {accessToken, tokenExpiry}
}

resolvers = {

    Query: {

        customerEmailLogin: async (parent, args, res, req) => {
            let result = await customerAcc.findOne({emailAdd: args.login.email})
            if (result) {
                //decrypt password from database
                let bytes = CryptoJS.AES.decrypt(result.password, 'secret key 123');
                let decryptedPassword_1 = bytes.toString(CryptoJS.enc.Utf8);
                //decrypt password from user login
                bytes = CryptoJS.AES.decrypt(args.login.password, 'secret key 123');
                let decryptedPassword_2 = bytes.toString(CryptoJS.enc.Utf8);
                //compare to check if user login password is correct
                if (decryptedPassword_1 == decryptedPassword_2) {
                    let {accessToken, tokenExpiry} = generateAccessToken()
                    let filter = {emailAdd: args.login.email}
                    let update = {accessToken: accessToken, tokenExpiry: tokenExpiry}
                    //update user tokenExpiry date in database
                    await customerAcc.findOneAndUpdate(filter, update)
                    //push access token to website cookie
                    await res.res.cookie("PET_MART_USER", accessToken)
                    return {
                        name: result.name,
                        email: result.emailAdd,
                        accessToken: accessToken
                    }
                }
            }

            return {
                name: "",
                email: "",
                accessToken: ""
            }

        },

        verifyAccessToken: async (parent, args, res, req) => {

            let result = await customerAcc.findOne({accessToken: args.token.token})

            let currentDate = new Date()
            if (result && (currentDate.getTime() < result.tokenExpiry)) {

                return {
                    name: result.name,
                    email: result.emailAdd,
                    accessToken: args.token.token
                }
            } else {
                if (!Object.is(args.token.token, "")) {
                    await res.res.cookie("PET_MART_USER", "")
                }
                return {
                    name: "",
                    email: "",
                    accessToken: ""
                }
            }
        },

        customerGoogleLogin: async (parent, args, res, req) => {

            const ticket = await client.verifyIdToken({
                idToken: args.login.token,
                audience: "10043720919-sdvflhtpemgtvn6cs043ims18ut4pk53.apps.googleusercontent.com"
            })
            const {name, email, picture} = ticket.getPayload()

            let result = await customerAcc.findOne({emailAdd: email})
            let {accessToken, tokenExpiry} = generateAccessToken(email)
            //if customer alr exists in database
            if (result) {

                let filter = {emailAdd: email}
                let update = {accessToken: accessToken, tokenExpiry: tokenExpiry}
                //update user tokenExpiry date in database
                await customerAcc.findOneAndUpdate(filter, update)
            } else {
                //upsert customer into database
                const createCustomer = {
                    name: name,
                    emailAdd: email,
                    password: "",
                    registered: false,
                    accessToken: accessToken,
                    tokenExpiry: tokenExpiry
                }
                const newCustomer = new database_schema.custAcc(createCustomer)
                await customerAcc.registerCustomer(newCustomer)
            }
            await res.res.cookie("PET_MART_USER", accessToken)
            return {
                name: name,
                email: email,
                accessToken: accessToken
            }
        },

        getCustomerPets: async (parent, args, res, req) => {
            let result = customerPet.getPets(args.customer.email)
            return result
        },

        searchWarehouse: async (parent, args, res, req) => {
            console.log(args)
            if (args.search.searchType === 0) {
                let result = await warehouse.getAllProducts()
                return result
            } else {
                let query = {
                    species: args.search.species,
                    healthConcern: args.search.healthConcern
                }

                let result = await warehouse.getProductGroup(query)
                return result
            }
        },

        searchShoppingCart: async (parent, args, res, req) => {
            let result = await activity.getShoppingCart(args.cart.email)
            if (result && !result.emptyCart) {
                return result.cartItems
            }
            return null
        }

    },

    Mutation: {

        customerLogout: async (parent, args, res, req) => {
            let result = await customerAcc.findOne({emailAdd: args.logout.email})
            if (result) {
                let filter = {emailAdd: args.logout.email}
                let update = {accessToken: "", tokenExpiry: 0}
                await customerAcc.findOneAndUpdate(filter, update)
                await res.res.cookie("PET_MART_USER", "")
                return {
                    name: result.name,
                    email: result.emailAdd
                }
            }
        },

        customerRegistration: async (parent, args, res, req) => {
            //Create Customer profile
            const createCustomer = {
                name: args.register.name,
                emailAdd: args.register.email,
                password: args.register.password,
                registered: true,
                accessToken: "",
                tokenExpiry: 0
            }
            //Store new customer in database.
            let result = await customerAcc.registerCustomer(createCustomer)
            if (!result) {
                return {
                    name: args.register.name,
                    email: args.register.email
                }
            } else {
                return {
                    name: "",
                    email: ""
                }
            }
        },

        registerPet: async (parent, args, res, req) => {
            let result = await customerPet.registerPet(args.newPet)
            if (!result) {
                return args.newPet
            } else {
                return {
                    name: "",
                    gender: "",
                    species: "",
                    petBreed: "",
                    age: "",
                    weight: "",
                    healthConcern: "",
                    ownerEmail: "",
                }
            }
        },

        saveShoppingCart: async (parent, args, res, req) => {

            let newCart = []

            if (!args.saveCart.emptyCart) {
                args.saveCart.cart.map(function (item, index) {
                    let new_cart = new database_schema.shoppingCart(item)
                    newCart.push(new_cart)
                })
            }
            console.log(args.saveCart.cart.length)
            let filter = {email: args.saveCart.email}
            let update = {emptyCart: false, cartItems: newCart}
            await activity.findOneAndUpdate(filter, update)
        }

    }

}


module.exports = resolvers