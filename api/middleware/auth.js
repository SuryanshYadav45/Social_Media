const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    // Get token from header
    const token = req.header('Authorization');
    
    // Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        
        // Attach user from payload to request object
        req.user = decoded;
        
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = authenticateToken;