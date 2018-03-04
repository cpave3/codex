const jwt = require('jsonwebtoken');
const secret = require('../../config/app.config.js').general.secret;
module.exports = (apiRoutes) => {
    // API v1 Routes
    //
    // Get an instance of the router for the api Routes
    //const apiRoutes = express.Router();

    // Authentication route
    // Accepts a username and password, returns a JWT
    // TODO

    // Registration route
    // Accepts a username, password and email, creates and returns a new user
    // TODO

    require('./user.routes.js')(apiRoutes);
    // PLACE ALL UNSECURED ROUTES ABOVE THIS POINT
    apiRoutes.use((req, res, next) => {
        // Check for a token
        const token = req.body.token  ||
                      req.query.token ||
                      req.headers['x-access-token'];
    
        // Decode the token
        if (token) {
            // Validate token
            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    return res.json({success: false, message: 'Failed to authenticate token.'});
                } else {
                    req.decoded = decoded;
                 next();
                }
            });
        } else {
            // Unauthorised
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }

    });
    // ALL SECURE ROUTES BELOW THISE POINT
    require('./sheet.routes.js')(apiRoutes);
    require('./snippet.routes.js')(apiRoutes);
};
