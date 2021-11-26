class CustomerPetHandler{
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

module.exports = CustomerPetHandler;