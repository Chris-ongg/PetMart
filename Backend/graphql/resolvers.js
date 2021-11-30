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
const orderTable = database_schema.order_ID
const encryption_key = 'secret key 123'

//Number of days access token is valid for
const tokenValidity = 7
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
        //return encryption key to client
        encryptionKey: async (parent, args, res, req) => {
            return {key: encryption_key}
        },

        customerEmailLogin: async (parent, args, res, req) => {
            let result = await customerAcc.findOne({emailAdd: args.login.email})
            if (result) {
                //decrypt password from database
                let bytes = CryptoJS.AES.decrypt(result.password, encryption_key);
                let decryptedPassword_1 = bytes.toString(CryptoJS.enc.Utf8);
                //decrypt password from user login
                bytes = CryptoJS.AES.decrypt(args.login.password, encryption_key);
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
            //Receive access token from client and check for token validity
            //If valid, send client the logged in user details
            //Otherwise, log out the user on client and flush the expired access token from browser cookie
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
            // Authenticate user through google login api
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
            // Receive product request from client and return product status
            if (args.search.searchType === 0) {
                let result = await warehouse.getAllProducts()
                return result
            } else {
                let query;
                if (args.search.healthConcern === "No Health Concern") {
                    query = {species: args.search.species}
                }
                else {
                    query = {
                        species: args.search.species,
                        healthConcern: args.search.healthConcern
                    }

                }

                let result = await warehouse.getProductGroup(query)
                return result
            }
        },

        searchShoppingCart: async (parent, args, res, req) => {
            //Return customer items in shopping cart
            let result = await activity.getShoppingCart(args.cart.email)
            if (result && !result.emptyCart) {
                return result.cartItems
            }
            return null
        },

        customerPastOrders: async (parent, args, res, req) => {
            //Return customer past transaction
            let result = await activity.getPastTransaction(args.customer.email)

            try {
                return result.pastOrders
            } catch {
                return []
            }

        }

    },

    Mutation: {

        customerLogout: async (parent, args, res, req) => {
            //Log out customer from client. Flush access token at browser cookie.
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
            //Receive new customer details from client and create customer record in database

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
            //Save customer pet to database
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
            //Save customer shopping cart to database.
            //Persist customer shopping details.
            let newCart = []
            if (!args.saveCart.emptyCart) {
                args.saveCart.cart.map(function (item, index) {
                    let new_cart = new database_schema.shoppingCart(item)
                    newCart.push(new_cart)
                })
            }

            let filter = {email: args.saveCart.email}
            let update = {emptyCart: false, cartItems: newCart}
            await activity.findOneAndUpdate(filter, update)
        },

        saveCustomerOrder: async (parent, args, res, req) => {
            //Save customer completed transaction
            let itemsCount = 0;
            let totalPrice = 0;
            if (!args.saveOrder.emptyCart) {
                args.saveOrder.cart.map(function (item, index) {
                    itemsCount += 1
                    totalPrice += (item.price * item.quantity)
                })

                let date_ = new Date().toLocaleDateString()
                let lastOrderID = await orderTable.find({name: "PetMart"})
                let trackingID = new Date().getTime().toString()

                let pastOrder = {
                    date: date_,
                    orderID: lastOrderID[0].lastOrderID,
                    store: 'Online',
                    items: itemsCount,
                    total: totalPrice,
                    trackingID: trackingID,
                    status: "Completed"
                }

                let filter = {email: args.saveOrder.email}
                let result = await activity.findOne(filter)
                if (result.pastOrders) {
                    let newPastOrders = result.pastOrders
                    newPastOrders.push(pastOrder)
                    let update = {emptyCart: true, cartItems: [] , pastOrders: newPastOrders}
                    await activity.findOneAndUpdate(filter, update)
                    await orderTable.findOneAndUpdate({name: "PetMart"} , {lastOrderID: lastOrderID[0].lastOrderID + 1})
                }

            }

        }

    }

}


module.exports = resolvers