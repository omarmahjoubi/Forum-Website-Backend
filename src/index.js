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
        topic : async (parent,args,context) => {
                    const topic = await context.prisma.topic.findUnique ({
                        where : {
                            id : args.topicID
                        },
                        include : {
                            posts : true
                        }
                    })
                    return topic
        },
        
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

        // BEGIN CRUD USER

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

        updateUser : async (parent,args,context) => {
            try {
                    const user = await context.prisma.users.update( {
                        where : {
                            id : args.userID
                        },
                        data : {
                            firstName : args.firstName !== undefined ? args.firstName : undefined,
                            lastName : args.lastName !== undefined ? args.lastName : undefined,
                            pseudo : args.pseudo !== undefined ? args.pseudo : undefined,
                        }
                    })
                    return {
                        user : user,
                        message : `user wiht id ${args.userID} successfully updated`
                }
            }
            catch(e) {
                console.error(e)
                return {
                    user : undefined,
                    message : `user wiht id ${args.userID} does not exsist in database`
                }
            }
        },

        deleteUser: async (parent,args,context) => {
            try {
                    const deletedUser = await context.prisma.users.delete({
                        where : {
                            id : args.userID
                        }
                    })
                }
            catch (e) {
                console.error(e)
                return `post wiht id ${args.userID} does not exsist in database`
            }
            return `post wiht id ${args.userID} removed`
        },
        
        // END CRUD USER

        // BEGIN CRUD POST

        createPost: (parent,args,context) => {
            console.log(context.prisma)
            const newPost = context.prisma.post.create({
                data : {
                    author : {
                        connect : {
                           id : args.userID
                    }
                  } ,
                    topic : {
                        connect : {
                            id : args.topicID
                        }
                    },
                    text : args.text
            }})
                
            return newPost
    },

        updatePost: async (parent,args,context) => {
            try {
                    const post = await context.prisma.post.update({
                        where : {
                            id : args.postID
                        },
                        data : {
                            text : args.text
                        }
                    })
                    return {
                        post : post,
                        message : `post wiht id ${args.postID} successfully updated`
                    }
                }
            catch(e) {
                console.error(e)
                return {
                    message : `post wiht id ${args.postID} does not exist in database`
                }
            }
            
        },

        deletePost: async (parent,args,context) => {
            try {
                    const deletedPost = await context.prisma.post.delete({
                        where : {
                            id : args.postID
                        }
                    })
                }
            catch (e) {
                console.error(e)
                return `post wiht id ${args.postID} does not exsist in database`
            }
            return `post wiht id ${args.postID} removed`
        },

        // END CRUD POST

        // BEGIN CRUD TOPIC

        createTopic : async(parent,args,context) => {
            const newTopic = await context.prisma.topic.create({
                data : {
                    title : args.title
                }
            })
            return newTopic
        },

        updateTopic : async(parent,args,context) => {
            try {
                    const topic = await context.prisma.topic.update({
                        where : {
                            id : args.topicID
                        },
                        data : {
                            title : args.title
                        }
                    })
                    return {
                        topic : topic,
                        message : `topic wiht id ${args.topicID} successfully updated`
                    }
                }
                catch(e) {
                    console.error(e)
                    return {
                        message : `topic wiht id ${args.topicID} does not exist in database`
                    }
                }
        },

        deleteTopic : async(parent,args,context) => {
            try {
                    const deletedTopic = await context.prisma.topic.delete({
                        where : {
                            id : args.topicID
                        }
                    })
                    return `topic wiht id ${args.topicID} removed`
                }
            catch(e) {
                    return  `post wiht id ${args.postID} deos not exist in database`
                }
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