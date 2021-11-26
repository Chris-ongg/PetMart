const  {gql} = require('apollo-server-express')

const typeDefs = gql`
    type customerLogin {
        name: String!,
        email: String!,
        password: String!
        accessToken: String!
    }
    
    type authenticatedUser {
        name: String!
        email: String!
        accessToken: String!
    }
    
    type customerDetails {
        name: String!
        email: String!
    }
    
    type petDetails {
        name: String!,
        gender: String!,
        species: String!,
        petBreed: String!,
        age: Int!,
        weight: Float!,
        healthConcern: String!,
        ownerEmail: String!
    }
    
    type productList {
        itemID: Int! ,
        name: String, 
        healthConcern: String!, 
        species: String!,
        price: Int!,
        stock: Int!,
        imagePath: String!
    }
    
    type cartItems {
        itemID: Int!,
        name: String!,
        price: Int!,
        quantity: Int!,
        imagePath: String!
    }
    
    input cartItemsInput {
        itemID: Int!,
        name: String!,
        price: Int!,
        quantity: Int!,
        imagePath: String!
    }
    
    type dummytest {
        email: String!
    }
    
    input customerCart {
        email: String!,
        emptyCart: Boolean!,
        cart: [cartItemsInput]!
    }
    
    input customerEmailInput {
        email: String!
    }
    
    input customerLoginInput {
        email: String!,
        password: String!
    }
    
    input customerRegistrationInput {
        name: String!,
        email: String!,
        password: String!
    }
    
    input accessTokenInput {
        token: String!
    }
    
    input newPetDetails {
        name: String!,
        gender: String!,
        species: String!,
        petBreed: String!,
        age: String!,
        weight: String!,
        healthConcern: String!,
        ownerEmail: String!
    }
    
    input searchInput {
        searchType: Int!,
        species: String!,
        healthConcern: String!
    }
    
    type Query {
        customerEmailLogin(login: customerLoginInput!) : authenticatedUser
        customerGoogleLogin(login: accessTokenInput!): authenticatedUser
        verifyAccessToken(token: accessTokenInput!) : authenticatedUser
        getCustomerPets(customer: customerEmailInput!): [petDetails]
        searchWarehouse(search: searchInput): [productList]
        searchShoppingCart(cart: customerEmailInput): [cartItems]
    }
    
    type Mutation {
        customerLogout(logout: customerEmailInput): customerDetails
        customerRegistration(register: customerRegistrationInput!): customerDetails
        registerPet(newPet: newPetDetails): petDetails
        saveShoppingCart(saveCart: customerCart): dummytest
    }
    
    
`;


module.exports = typeDefs;