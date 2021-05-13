const jwt = require('jsonwebtoken')
APP_SECRET =  'GraphQL-is-awesome'

function getTokenPayload(token) {
    return jwt.verify(token,APP_SECRET)
}

function getUserId(req,authToken) {
    if (req) {
        const authHeader = req.headers.authorization
        if (authHeader) {
            const token = authHeader.replace('Bearer ','')
            if (!token) {
                throw new Error('No token found')
            }
            console.log(token)
            const { userId } = getTokenPayload(token)
            console.log("userid ======> ",userId)
            return userId
        } else if (authToken) {
            const {userId} = getTokenPayload(authToken)
            return userId
        }
        return new Error('Not authenticated')
    }
}

module.exports = {
    APP_SECRET,
    getUserId,
}