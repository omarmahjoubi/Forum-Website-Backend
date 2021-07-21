const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

// BEGIN CRUD USER

function createUser (parent,args,context)  {
    const newUser = context.prisma.users.create( {
        data : {
            firstName : args.firstName,
            lastName : args.lastName,
            pseudo : args.pseudo
        },
    })
    return newUser
}

async function signup(parent,args,context) {
    const password = await bcrypt.hash(args.password, 10)
    const user = context.prisma.users.create({
        data : {
            firstName : args.firstName,
            lastName : args.lastName,
            pseudo : args.pseudo,
            password : password
        }
    })

    const token = jwt.sign( { userId : user.id}, APP_SECRET)

    return {
        user,
        token
    }
} 

async function login(parent,args,context) {
    const user = await context.prisma.users.findUnique({
        where : {
            pseudo : args.pseudo
        }
    })
    console.log(user)
    if (!user) {
        throw new Error(`There is no user with this psuedo : ${args.pseudo}`)
    }
    const valid = await bcrypt.compare(args.password,user.password)
    if (!valid) {
        throw new Error(`Password is incorrect`)
    }

    const token = jwt.sign({ userId : user.id}, APP_SECRET)
    console.log({ user,token})
    return {
        user,
        token
    }
}   

async function updateUser (parent,args,context)  {
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
}

async function deleteUser (parent,args,context) {
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
}

// END CRUD USER

// BEGIN CRUD POST

async function createPost  (parent,args,context)  {
     
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
}

async function updatePost (parent,args,context) {
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
    
}

async function deletePost (parent,args,context)  {
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
}

// END CRUD POST

// BEGIN CRUD TOPIC

async function createTopic (parent,args,context)  {
    const newTopic = await context.prisma.topic.create({
        data : {
            title : args.title
        }
    })
    return newTopic
}

async function updateTopic (parent,args,context) {
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
}

async function deleteTopic (parent,args,context) {
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

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    createPost,
    updatePost,
    deletePost,
    createTopic,
    updateTopic,
    deleteTopic,
    signup,
    login
}