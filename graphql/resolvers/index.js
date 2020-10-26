const eventsResolver = require('./events');
const userResolver = require('./user');
const bookingResolver = require('./booking');


const rootResolver = {
    ...eventsResolver,
    ...userResolver,
    ...bookingResolver
};

module.exports = rootResolver;