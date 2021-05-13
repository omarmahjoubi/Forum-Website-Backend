async function topic (parent,args,context) {
    const topic = await context.prisma.topic.findUnique ({
        where : {
            id : args.topicID
        },
        include : {
            posts : true
        }
    })
    return topic
}

async function posts  (parent,args,context) {
    const allPosts = await context.prisma.post.findMany({
        include : {
            author : true
        },
    })
    console.log(allPosts)
    return allPosts
}

async function users (parent,args,context)  {
    return context.prisma.users.findMany()
}

async function selectUserPosts (parent,args,context) {
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

module.exports = {
    topic,
    posts,
    users,
    selectUserPosts
}