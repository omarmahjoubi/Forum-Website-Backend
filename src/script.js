const { PrismaClient } = require("@prisma/client")

//instantiate Prisma client
const prisma = new PrismaClient()


// define query to the database in main
async function main() {
   /* const newUser = await prisma.users.create( {
        data : {
            firstName : "Omar",
            lastName : "Mahjoubi",
            pseudo : "Zlat"
        },
    }) */
    console.log(prisma)
    const newPost = await prisma.post.create( {
        data : {
            author : {
                connect : {
                    id : 1
                }
            },
            text : "My first comment on the forum"
        }
    })
    const allUsers = await prisma.users.findMany()
    const allPosts = await prisma.post.findMany()
    console.log("All users in database ===> ", allUsers)
    console.log("All post in database ===> ", allPosts)
}

// call main function
main().catch(e => { throw e })
        .finally(async () => {
            await prisma.$disconnect()
        })
