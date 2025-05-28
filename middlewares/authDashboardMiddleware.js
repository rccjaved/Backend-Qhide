const jwt = require('jsonwebtoken');

module.exports = function authDashboardMiddleware(req, res, next) {
    const {accessToken} = req.cookies

    if (!accessToken) {
        return res.status(409).json({ error : 'Please Login First'})
    } else {
        try {
            const deCodeToken = jwt.verify(accessToken, process.env.SECRET)
            req.role_id = deCodeToken.role_id; // ✅ Use the actual decoded variable
            req.id = deCodeToken.id
            next()            
        } catch (error) {
            return res.status(409).json({ error : 'Please Login'})
        }        
    }

}