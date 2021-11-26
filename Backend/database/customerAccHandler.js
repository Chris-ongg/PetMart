class CustomerAccHandler{
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

    async registerCustomer(customer) {
        const exists = await this.model.exists({emailAdd: customer.emailAdd})

        if (!exists) {
            const temp = new this.model(customer);
            temp.save()
        }

        return exists
    }
}

module.exports = CustomerAccHandler;