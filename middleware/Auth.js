const jwt = require('jsonwebtoken');

//TODO: update to use bearer <token> as token header
//TODO: add expiration to token
exports.checkLoggedIn = function(req, res, next) {
    const token = getTokenFromHeader(req);
    if (!token)
        return res
            .status(401)
            .send({ msg: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send({ msg: 'Invalid token.' });
    }
};

// exports.checkLoggedInOrAnonymous = function(req, res, next) {
//     const token = getTokenFromHeader(req);

//     req.user = null;

//     try {
//         const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
//         req.user = decoded;
//         next();
//     } catch (ex) {
//         next(); //if the user isn't there it's ok for this one
//     }
// };

const getTokenFromHeader = (req) => {
    const rawHeader =
        req.headers['x-access-token'] || req.headers['authorization'];
    if (!rawHeader) return null;

    const parsedHeader = rawHeader.split(' ');
    return parsedHeader[1];
};
