class customerActivityHandler{
    constructor(model_){
        this.model = model_
    }

    async findOne(query){
        const result = await this.model.findOne(query);
        return result
    }

    async getShoppingCart(email){
        const result = await this.model.findOne({email: email})
        return result
    }

    async getPastTransaction(email) {
        const result = await this.model.findOne({email:email})
        return result
    }

    async findOneAndUpdate(filter, update){
        const result = await this.model.findOneAndUpdate(filter , update , {
            new: true,
            upsert: true
        })
    }

}

module.exports = customerActivityHandler;