// import apollo-server
// import prisma client
const { PrismaClient } = require('@prisma/client')
const { ApolloServer } = require('apollo-server')
const fs = require('fs')
const path = require('path')
const { APP_SECRET, getUserId }  = require('./utils')

// import resolver
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutations')



// instanciate a prisma client
const prisma = new PrismaClient() ;

let topic = [{
    id : 1,
    user : {
        id : 1,
        firstName : "Omar",
        lastName : "Mahjoubi",
        pseudo : "Big ROM"
    },
    text : "First Comment on the forum" 
}]

//define correspending resolver
const resolvers = {
    Query,
    Mutation
}

//instantiate server
const server = new ApolloServer({
    typeDefs : fs.readFileSync(
        path.join(__dirname,'schema.graphql'),
        'utf8'),
    resolvers,
    cors : true,
    // pass the prisma client to the graphql server at initialistaion
    context : ({ req }) => {
        return {
            ...req,
            prisma,
            userId:
                req && req.headers.authorization
                ? getUserId(req)
                : null
        }
    }
        
    })

server.listen()
    .then(({ url }) => console.log(`Server is runing on ${url}`));