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

    async registerPet(pet) {
        const exists = await this.model.exists({ownerEmail: pet.ownerEmail , name: pet.name , species: pet.species})

        if (!exists){
            const temp = new this.model(pet);
            temp.save()
        }

        return exists
    }

    async getPets(email){
        const result = await this.model.find({ownerEmail: email})
        return result
    }

}

module.exports = warehouseHandler;