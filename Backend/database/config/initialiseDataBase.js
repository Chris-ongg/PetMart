const customerAccHandler = require('../customerAccHandler')
const warehouseHandler = require('../warehouseHandler')
const database_schema = require('./dataBaseSchema')

const customerLogin_test = new customerAccHandler(database_schema.custAcc)
const warehouse_handler = new warehouseHandler(database_schema.warehouse)


async function insertDummyCustomer(){
    let currentDate = new Date()
    let tokenExpiry = new Date(currentDate.getTime() + (86400000 * 7))
    //password is testing
    let dummyCustomer = {
        name: "Christopher",
        emailAdd: "chris@gmail.com",
        password: "U2FsdGVkX1/n3sz/uRWMYnxxJpEpKZi7SCEc8WAlXBE=",
        registered: true,
        accessToken: "simple",
        tokenExpiry: tokenExpiry
    }

    await customerLogin_test.registerCustomer(dummyCustomer)

}

async function setupOrderIDTable() {
    let startOrderID = {
        name: "PetMart",
        lastOrderID: 0
    }

    let temp = new database_schema.order_ID(startOrderID)
    let result = await database_schema.order_ID.count()
    if (result < 1) {
        await temp.save()
    }
}

async function warehouseSetup() {
    let tempArr = []
    let healthCondition = ["Weight Management", "Diabetes"]

    for (let i = 1; i < 17; i++) {
        let randStock = Math.floor(Math.random() * 50)
        let randPrice = Math.floor(Math.random() * 100) + 20
        let dogProduct
        let catProduct
        if (i < 9) {
            dogProduct = {
                itemID: i,
                name: "Dog Food " + i,
                healthConcern: healthCondition[0],
                species: "Dog",
                price: randPrice,
                stock: randStock,
                imagePath: '../../Images/Product/' + i + '.jpg'
            }

            catProduct = {
                itemID: i + 16,
                name: "Cat Food " + (i + 16),
                healthConcern: healthCondition[0],
                species: "Cat",
                price: randPrice,
                stock: randStock,
                imagePath: '../../Images/Product/' + (i + 16) + '.jpg'
            }

        } else {
            dogProduct = {
                itemID: i,
                name: "Dog Food " + i,
                healthConcern: healthCondition[1],
                species: "Dog",
                price: randPrice,
                stock: randStock,
                imagePath: '../../Images/Product/' + i + '.jpg'
            }

            catProduct = {
                itemID: i + 16,
                name: "Cat Food " + (i + 16),
                healthConcern: healthCondition[1],
                species: "Cat",
                price: randPrice,
                stock: randStock,
                imagePath: '../../Images/Product/' + (i + 16) + '.jpg'
            }
        }
        tempArr.push(dogProduct)
        tempArr.push(catProduct)
    }
    let result = await warehouse_handler.rowCount()
    if (result != 32) {
        await warehouse_handler.bulkInsert(tempArr)
    }
}


insertDummyCustomer()
warehouseSetup()
setupOrderIDTable()


