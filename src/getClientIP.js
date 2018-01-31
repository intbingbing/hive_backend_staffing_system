/***
 * function : get client IP
 * parameter : request
 * return value : client IP , type : string
 * 2018.1.27 by bing
 * */

function getClientIP(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
};

exports = module.exports = { getClientIP };
