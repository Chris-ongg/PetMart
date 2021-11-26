const express = require('express')
const {ApolloServer} = require('apollo-server-express')

const schema = require('./graphql/graphqlSchema')
const resolvers = require('./graphql/resolvers')

const dataBaseSetUp = require('./database/config/initialiseDataBase')

PORT = 5000

const corsOption =  { origin: "http://localhost:3000", credentials: true, }

async function startApolloServer(typeDefs, resolvers){
    const server = new ApolloServer({typeDefs, resolvers ,
        context: ({ res , req }) => {
            return { res , req};
        }
    })

    const app = express();
    await server.start();
    server.applyMiddleware({app, path: '/graphql' , cors: corsOption});

    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}${server.graphqlPath}`);
    })
}

startApolloServer(schema, resolvers);



