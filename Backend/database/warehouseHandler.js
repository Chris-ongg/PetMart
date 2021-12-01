class warehouseHandler{
    constructor(model_){
        this.model = model_
    }

    async findOne(query){
        const result = await this.model.findOne(query);
        return result
    }

    async findOneAndUpdate(filter, update){
        const result = await this.model.findOneAndUpdate(filter , update)
    }

    async rowCount() {
        const result = await this.model.count()
        return result
    }

    async bulkInsert(products) {
        const result = await this.model.insertMany(products)
    }

    async getAllProducts() {
        const result = await this.model.find()
        return result
    }

    async getProductGroup(query){
        const result = await this.model.find(query)
        return result
    }
}

module.exports = warehouseHandler;