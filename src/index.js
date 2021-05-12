// import apollo-server
// import prisma client
const { PrismaClient } = require('@prisma/client')
const { ApolloServer } = require('apollo-server')
const fs = require('fs')
const path = require('path')

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
    Query: {
        info: ()=> 'This is an API of my forum website',
        posts :  async (parent,args,context) => {
            const allPosts = await context.prisma.post.findMany({
                include : {
                    author : true
                },
            })
            console.log(allPosts)
            return allPosts
        },

        users : async (parent,args,context) => {
            return context.prisma.users.findMany()
        },
        selectUserPosts : async (parent,args,context) => {
            const user = await context.prisma.users.findUnique({
                where : {
                    id : args.userID,
                },
                include : {
                    posts : true
                },
            })
            console.log(user)
            return user
        }
    },

    Mutation : {
        createUser : (parent,args,context) => {
            const newUser = context.prisma.users.create( {
                data : {
                    firstName : args.firstName,
                    lastName : args.lastName,
                    pseudo : args.pseudo
                },
            })
            return newUser
        },

        

        createPost: (parent,args,context) => {
            console.log(context.prisma)
            const newPost = context.prisma.post.create({
                data : {
                    author : {
                        connect : {
                           id : args.userID
                    }
                  } ,
                  text : args.text
            }})
                
            return newPost
    },

        updatePost: (_, {postID, text}) => {
            const post = topic.find(x => x.id === postID)
            if (!post) {
                throw new Error(`Couldn’t find post with id ${postID}`);
            }
            post.text = text
            return post
        },

        deletePost: (_,{postID}) => {
            topic = topic.filter(x => x.id != postID)
            return `post wiht id ${postID} removed`
        }
}
}

//instantiate server
const server = new ApolloServer({
    typeDefs : fs.readFileSync(
        path.join(__dirname,'schema.graphql'),
        'utf8'),
    resolvers,
    // pass the prisma client to the graphql server at initialistaion
    context : {
        prisma,
    }
})

server.listen()
    .then(({ url }) => console.log(`Server is runing on ${url}`));